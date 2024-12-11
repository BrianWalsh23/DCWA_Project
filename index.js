const express = require("express");
const mysql = require("./mysql");

const path = require("path");

// MongoDB
const { connectToDatabase, getLecturers } = require("./mongodb");

const app = express();



app.use(express.urlencoded({ extended: true }));
// Handles JSON
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "pages"));

app.listen(3004, () => {
  console.log("Running on port 3004");
});

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home Page</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        header {
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 20px;
            width: 100%;
        }
        header h1 {
            margin: 0;
            font-size: 3em;
        }
        nav {
            margin-top: 50px;
            text-align: center;
        }
        nav ul {
            list-style-type: none;
            padding: 0;
            display: flex;
            flex-direction: column; /* Stack buttons vertically */
            gap: 20px; /* Add space between the buttons */
        }
        nav ul li {
            display: inline;
            margin: 0 15px;
        }
        nav ul li a {
            display: block;
            padding: 20px 40px;
            font-size: 1.5em;
            font-weight: bold;
            text-decoration: none;
            background-color: #4CAF50;
            color: white;
            border-radius: 10px;
            width: 200px;
            text-align: center;
            transition: background-color 0.3s ease, transform 0.3s ease;
        }
        nav ul li a:hover {
            background-color: #45a049;
            transform: scale(1.1);
        }
        footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            background-color: #333;
            color: white;
            padding: 10px;
        }
    </style>
</head>
<body>

    <header>
        <h1>Welcome to G00424410</h1>
    </header>

    <nav>
        <ul>
            <li><a href="/students">Students</a></li>
            <li><a href="/grades">Grades</a></li>
            <li><a href="/lecturers">Lecturers</a></li>
        </ul>
    </nav>

    <footer>
        <p>&copy; 2024 G00424410 Project</p>
    </footer>

</body>
</html>
    `);
});

app.get("/students", async (req, res) => {
  try {
    const students = await mysql.getStudents();
    res.render("students", { students }); // Pass students data to the view
  } catch (error) {
    console.error("Error loading students:", error);
    res.status(500).send("Error loading students");
  }
});

app.get("/students/add", (req, res) => {
    console.log("Add Student page requested");
    res.render("addStudent", { errors: null, student: {} });
  });

  app.post("/students/add", async (req, res) => {
    const { sid, name, age } = req.body;
    let errors = {};
    let student = { sid, name, age };

    // Validation logic
    if (!sid || sid.length !== 4) {
      errors.sid = "Student ID must be exactly 4 characters.";
    }
    if (!name || name.length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }
    if (!age || age < 18) {
      errors.age = "Age must be 18 or older.";
    }

    // If there are validation errors, return the form with the error messages and previously entered data
    if (Object.keys(errors).length > 0) {
      return res.render("addStudent", { errors, student });
    }

    try {
      // If data is valid, insert the student into the database
      await mysql.pool
        .promise()
        .query("INSERT INTO student (sid, name, age) VALUES (?, ?, ?)", [
          sid,
          name,
          age,
        ]);

      // Redirect to the students page after successful insertion
      res.redirect("/students");
    } catch (error) {
      console.error("Error adding student:", error);
      res.status(500).send("Error adding student");
    }
  });

app.get("/students/edit/:sid", async (req, res) => {
  // Capture the student ID from the URL
  const studentId = req.params.sid;

  try {
    // Fix: Use pool.promise() to get the promise-based query interface
    const [students] = await mysql.pool
      .promise()
      .query("SELECT * FROM student WHERE sid = ?", [studentId]);

    if (students.length > 0) {
      // Get the student details
      const student = students[0];
      // Render the updateStudent page with student data
      res.render("updateStudent", { student });
    } else {
      res.status(404).send("Student not found");
    }
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).send("Error fetching student details");
  }
});

app.post("/students/update/:sid", async (req, res) => {
  const studentId = req.params.sid;
  const { name, age } = req.body;

  try {
    // Update student details in the database
    await mysql.pool
      .promise()
      .query("UPDATE student SET name = ?, age = ? WHERE sid = ?", [
        name,
        age,
        studentId,
      ]);

    // Redirect back to the students page after the update
    res.redirect("/students");
  } catch (error) {
    console.error("Error updating student details:", error);
    res.status(500).send("Error updating student details");
  }
});

app.get("/grades", async (req, res) => {
    try {
      // Fetch the grades, student names, and module names in the correct order
      const [grades] = await mysql.pool
        .promise()
        .query(`
          SELECT s.sid, s.name AS student_name, m.name AS module_name, g.grade
          FROM student s
          LEFT JOIN grade g ON s.sid = g.sid
          LEFT JOIN module m ON g.mid = m.mid
          ORDER BY s.name, g.grade ASC;
        `);
  
      // Render the grades page with the fetched data
      res.render("grades", { grades });
    } catch (error) {
      console.error("Error loading grades:", error);
      res.status(500).send("Error loading grades");
    }
  });
  
  
  

  (async () => {
    try {
        db = await connectToDatabase();
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
})();

app.get("/lecturers", async (req, res) => {
  try {
      const lecturers = await getLecturers();
      res.render("lecturers", { lecturers });
  } catch (error) {
      console.error("Error loading lecturers:", error);
      res.status(500).send("Error loading lecturers");
  }
});

app.get("/lecturers/delete/:lid", async (req, res) => {
  const lecturerId = req.params.lid;

  try {
      // Check if the lecturer teaches any modules
      const moduleCount = await db.collection("modules").countDocuments({ lecturerId: lecturerId });

      if (moduleCount > 0) {
          // Lecturer teaches modules; cannot delete
          console.log(`Lecturer with ID ${lecturerId} cannot be deleted as they teach ${moduleCount} module(s).`);
          return res.status(400).send(`
              <p>Cannot delete lecturer because they teach ${moduleCount} module(s).</p>
              <a href="/lecturers">Go Back to Lecturers</a>
          `);
      }

      

      // If no modules are taught, delete the lecturer
      const result = await db.collection("lecturers").deleteOne({ _id: new require('mongodb').ObjectId(lecturerId) });

      if (result.deletedCount > 0) {
          console.log(`Lecturer with ID ${lecturerId} deleted successfully.`);
      } else {
          console.log(`No lecturer found with ID ${lecturerId}.`);
      }

      // Redirect to the Lecturers page
      res.redirect("/lecturers");
  } catch (error) {
      console.error("Error deleting lecturer:", error);
      res.status(500).send("Error deleting lecturer");
  }
});




  
  


