var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');
var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "products"
});

connection.connect(function(err) {
    if (err) throw err
    start()
})


function start() {
    inquirer.prompt([{
        name: "selection",
        message: "Please select your options!",
        type: "list",
        choices: ["View Product Sales by Department", "Create New Department"]
    }]).then(function(user) {
        switch (user.selection) {
            case "View Product Sales by Department":
                connection.query(`select departments.department_id, departments.department_name,departments.over_head_cost, a.product_sales, (departments.over_head_cost-a.product_sales) as total_profit  from 
                (select sum(products.product_sales) as product_sales,products.department_name from products group by products.department_name) a 
                inner join  departments  on a.department_name=departments.department_name
                group by departments.department_id;`, function(err, result) {
                    if (err) throw err;

                    var data = JSON.parse(JSON.stringify(result));
                    console.log(Object.keys(data).length);
                    var table = new Table({
                        head: Object.keys(data[0]),

                        chars: {
                            'top': '═',
                            'top-mid': '╤',
                            'top-left': '╔',
                            'top-right': '╗',
                            'bottom': '═',
                            'bottom-mid': '╧',
                            'bottom-left': '╚',
                            'bottom-right': '╝',
                            'left': '║',
                            'left-mid': '╟',
                            'mid': '─',
                            'mid-mid': '┼',
                            'right': '║',
                            'right-mid': '╢',
                            'middle': '│'
                        }
                    });

                    Object.keys(data).forEach(function(element) {
                        var data1 = Object.values(data[element])
                        table.push(
                            data1
                        );

                    })


                    console.log(table.toString());
                    process.exit();
                })
                break;
            case "Create New Department":
                addDepartment();
                break;


        }
    })
}

function addDepartment() {
    inquirer.prompt([

        {
            name: "department",
            message: "Enter the department name that you want to add",
            type: "input",

        },
        {
            name: "cost",
            message: "Enter the overhead cost",
            type: "input",
        }
    ]).then(function(data) {
        connection.query(`insert into departments set ?`, [{
            department_name: data.department,
            over_head_cost: parseInt(data.cost)
        }], function(err) {
            if (err) throw err;
            console.log("You have successfully added a new department!")
            process.exit()
        })
    })

}