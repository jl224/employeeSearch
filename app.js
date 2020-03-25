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
        console.log(choicesDept)


        /// then build a choices array
        // do the inquirer
        // then inser the role
        inquirer
            .prompt([{
                name: "title",
                type: "input",
                message: "What is their title?"

            },
            {
                name: "salary",
                type: "number",
                message: "What is their salary?"
            },
            {
                name: "department_id",
                type: "list",
                message: "What is their department ?",
                choices: choicesDept


            }])
            .then(function (answer) {
                console.log(answer)
                var query = "INSERT INTO role SET ?";
                // console.log(query)
                connection.query(query, answer, function (err, res) {
                    if (err) throw err;
                    // console.log("role added")
                    runMenu();
                });
            });
    })
}


function addEmployee() {

    // go to the db and get the departments
    connection.query("select * from role", function (err, res) {
        let choicesRole = res.map(elem => {
            return {
                name: elem.title,
                value: elem.id
            }
        })
        connection.query("select * from employee", function (err, res) {
            let choicesEmployee = res.map(elem => {
                return {
                    name: elem.firstName + " " + elem.lastName,
                    value: elem.id
                }
            })
            choicesEmployee.push({
                name: "no manager",
                value: null
            })
            console.log(choicesEmployee)


            /// then build a choices array
            // do the inquirer
            // then inser the role
            inquirer
                .prompt([{
                    name: "firstName",
                    type: "input",
                    message: "What is their first name?"

                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What is their last name?"
                },
                {
                    name: "role_id",
                    type: "list",
                    message: "What is their role?",
                    choices: choicesRole


                },
                {
                    name: "manager_id",
                    type: "list",
                    message: "Who is their manager?",
                    choices: choicesEmployee

                }])
                .then(function (answer) {
                    console.log(answer)
                    var query = "INSERT INTO employee SET ?";
                    // console.log(query)
                    connection.query(query, answer, function (err, res) {
                        if (err) throw err;
                        // console.log("role added")
                        runMenu();
                    });
                });
        })
    })
}

function viewRole() {
    connection.query("select role.title, role.salary, department.name AS department from role LEFT JOIN department on role.department_id =department.id", function (err, res) {
        console.table(res)
        runMenu()

    })

}


function viewEmployee() {
    connection.query("select CONCAT(employee.firstName, ' ', employee.lastName) AS name, role.title, role.salary, CONCAT(manager.firstName, ' ' , manager.lastName) AS manager, department.name AS department FROM employee LEFT JOIN role on employee.role_id=role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager  on employee.manager_id = manager.id", function (err, res) {
        console.log("*************")
        console.log(err)
        console.table(res)
        runMenu()

    })

}

function viewDept() {
    connection.query("select * from department", function (err, res) {
        console.log("*************")
        console.table(res)
        runMenu()

    })

}



