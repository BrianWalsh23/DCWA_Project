var express = require('express')
var mysql = require('./mysql')

var app = express()

app.listen(3004, () => {
    console.log("Running on port 3004")
})
   

app.get("/", (req, res) => {
    mysql.getStudents()
    .then((data) => {
        res.send(data)
    })
    .catch((error) => {
        res.send(error)
    })
})