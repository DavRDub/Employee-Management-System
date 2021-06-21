const inquirer = require("inquirer")
const mysql = require("mysql")
const consoleTable = require("console.table")

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "RootPassword1*",
    database: "company_db"
});

connection.connect(function(err) {
    if (err) throw err
    console.log("Connected to New Company")
    startPrompt();
});

function startPrompt() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: [
                    "View All Employees",
                    "View All Employees by Role",
                    "View All Employees by Department",
                    "Update Employee",
                    "Add Employee",
                    "Add Role",
                    "Add Deparment"
            ]
        }
    ]).then(function(val) {
        switch (val.choice) {
            case "View All Employees":
                viewAllEmployees();
                break;

            case "View All Employees by Roles":
                viewAllRoles();
                break;

            case "View All Employees by Department":
                viewAllDepartments();
                break;

            case "Add Employee":
                addEmployee();
                break;

            case "Update Employee":
                updateEmployee();
                break;

            case "Add Role":
                addRole();
                break;
            
            case "Add Department":
                addDepartment();
                break;
        }
    })
}

function viewAllEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, roles.role_title, roles.salary, department.department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on roles.id = employee.role_id INNER JOIN department on department.id = roles.department_id left join employee e on employee.manager_id = e.id;",
    function(err, res) {
        if (err) throw err
        console.table(res)
        startPrompt()
    })
}

function viewAllRoles() {
    connection.query("SELECT employee.first_name, employee.last_name, roles.role_title AS Title FROM employee JOIN role ON employee.role_id = roles.id;", 
    function(err, res) {
    if (err) throw err
    console.table(res)
    startPrompt()
    })
}

function viewAllDepartments() {
    connection.query("SELECT employee.first_name, employee.last_name, department.department_name AS Department FROM employee JOIN role ON employee.role_id = roles.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
    })
}

var roleArr = [];
function selectRole() {
  connection.query("SELECT * FROM roles", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

  })
  return roleArr;
}

var managersArr = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
}

function addEmployee() { 
    inquirer.prompt([
        {
          name: "firstname",
          type: "input",
          message: "Enter Employees First Name"
        },
        {
          name: "lastname",
          type: "input",
          message: "Enter Employees Last Name"
        },
        {
          name: "roles",
          type: "list",
          message: "What Is The Employees Role?",
          choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Whats Their Managers Name?",
            choices: selectManager()
        }
    ]).then(function (val) {
      var roleId = selectRole().indexOf(val.role) + 1
      var managerId = selectManager().indexOf(val.choice) + 1
      connection.query("INSERT INTO employee SET ?", 
      {
          first_name: val.firstName,
          last_name: val.lastName,
          manager_id: managerId,
          role_id: roleId
          
      }, function(err){
          if (err) throw err
          console.table(val)
          startPrompt()
      })

  })
}

function updateEmployee() {
    connection.query("SELECT employee.last_name, roles.role_title FROM employee JOIN role ON employee.role_id = roles.id;", function(err, res) {
    // console.log(res)
     if (err) throw err
     console.log(res)
    inquirer.prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: function() {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "Please enter the employees last name. ",
          },
          {
            name: "roles",
            type: "rawlist",
            message: "Please enter the title of this employee. ",
            choices: selectRole()
          },
      ]).then(function(val) {
        var roleId = selectRole().indexOf(val.role) + 1
        connection.query("UPDATE employee SET WHERE ?", 
        {
          last_name: val.lastName
           
        }, 
        {
          role_id: roleId
           
        }, 
        function(err){
            if (err) throw err
            console.table(val)
            startPrompt()
        })
  
    });
  });

  }

function addRole() { 
  connection.query("SELECT role.role_title AS Title, roles.salary AS Salary FROM roles",   function(err, res) {
    inquirer.prompt([
        {
          name: "Title",
          type: "input",
          message: "Please enter the title of role."
        },
        {
          name: "Salary",
          type: "input",
          message: "Please enter in the salary amount of this current role."

        } 
    ]).then(function(res) {
        connection.query(
            "INSERT INTO role SET ?",
            {
              title: res.Title,
              salary: res.Salary,
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )

    });
  });
  }

function addDepartment() { 

    inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "Please add another Department you would like to add."
        }
    ]).then(function(res) {
        var query = connection.query(
            "INSERT INTO department SET ? ",
            {
              name: res.name
            
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )
    })
  }