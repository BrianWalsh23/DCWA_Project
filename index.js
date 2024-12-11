var express = require('express')
var mysql = require('./mysql')

var app = express()

app.listen(3004, () => {
    console.log("Running on port 3004")
})


   

app.get("/", (req, res) => {
    console.log("Home");
    res.send("Brian");
})


app.get("/students", (req, res) => {
    mysql.getStudents()
        .then((data) => {
            // Log the retrieved data for debugging
            console.log("Retrieved students:", data); 
            // Send data as JSON with a success status code
            res.status(200).json(data); 
        })
        .catch((error) => {
            console.error("Error fetching students:", error); // Log the error
            res.status(500).json({ error: error.message }); // Send error with proper status code and message
        });
});


