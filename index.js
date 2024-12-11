const express = require('express');
const mysql = require('./mysql');

const path = require('path');

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pages'));


app.listen(3004, () => {
    console.log("Running on port 3004")
})


   

app.get('/', (req, res) => {
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
        }
        header {
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 20px;
        }
        header h1 {
            margin: 0;
            font-size: 3em;
        }
        nav {
            margin-top: 20px;
            text-align: center;
        }
        nav ul {
            list-style-type: none;
            padding: 0;
        }
        nav ul li {
            display: inline;
            margin: 0 15px;
        }
        nav ul li a {
            text-decoration: none;
            color: #4CAF50;
            font-size: 1.2em;
            padding: 10px 15px;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }
        nav ul li a:hover {
            background-color: #4CAF50;
            color: white;
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
        console.error("Error fetching students:", error);
        res.status(500).send("Error loading students");
    }
});

app.get("/addStudent", (req, res) => {
    res.render("addStudent");  // This will render addStudent.ejs
});

app.get("/updateStudent/:id", (req, res) => {
    // Capture the student ID from the URL
    const studentId = req.params.id;  
   

    // render the updateStudent page with the studentId
    res.render("updateStudent", { studentId });
});


