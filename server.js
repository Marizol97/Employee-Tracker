
const express = require('express');
const mysql = require('mysql2');
const askQuestions = require('./prompt_questions');
const PORT = process.env.PORT || 3000;
const app = express();
const db = askQuestions.db;

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());




// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
    console.log(`Connected to the employee database.`)
    if (err) throw err;
    app.listen(PORT, () => {});
});


// Call to start app
askQuestions.askQuestions();