var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table")

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Learning10!",
    database: "employees"
});

connection.connect(function (err) {
    if (err) throw err;
    runMenu();
});

function runMenu() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add Department",
                "Add Role",
                "Add Employee",
                "View Department",
                "View Role",
                "View Employee",
                "Update Employee",
                "End"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add Department":
                    addDept();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "View Department":
                    viewDept();
                    break;

                case "View Role":
                    viewRole();
                    break;

                case "View Employee":
                    viewEmployee();
                    break;

                case "Update Employee":
                    updateEmployee();
                    break;

                case "End":
                    connection.end();
                    process.exit()
                    break;
            }
        });


}

function addDept() {
    inquirer
        .prompt({
            name: "name",
            type: "input",
            message: "What department would you like?"
        })
        .then(function (answer) {
            console.log(answer)
            var query = "INSERT INTO department SET ?";
            console.log(query)
            connection.query(query, answer, function (err, res) {
                if (err) throw err;
                console.log("department added")
                runMenu();
            });
        });
}

function addRole() {

    // go to the db and get the departments
    connection.query("select * from department", function (err, res) {
        let choicesDept = res.map(elem => {
            return {
                name: elem.name,
                value: elem.id
            }
        })

        /// then build a choices array
        // do the inquirer
        // then inser the role
        inquirer
            .prompt([{
                name: "title",
                department: "input",
                message: "What is their title?"

            },
            {
                name: "salary",
                department: "input",
                message: "What is their salary?"
            },
            {
                name: "department_id",
                department: "list",
                message: "What is their department id?",
                choices: choicesDept


            }])
            .then(function (answer) {
                console.log(answer)
                var query = "INSERT INTO roles SET ?";
                console.log(query)
                connection.query(query, answer, function (err, res) {
                    if (err) throw err;
                    console.log("role added")
                    runMenu();
                });
            });
    })
}