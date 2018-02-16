var inquirer = require("inquirer");
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "products"
})

connection.connect(function(err) {
    if (err) throw err;
    start()
})

function start() {
    inquirer.prompt([{
        name: "selection",
        message: "Please select your options!",
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }]).then(function(user) {
        switch (user.selection) {
            case "View Products for Sale":
                connection.query(`select * from products where stock_quantity>0`, function(err, result) {
                    if (err) throw err;
                    var data = JSON.parse(JSON.stringify(result));
                    data.forEach(function(element) {
                        console.log("Item ID: " + element["item_id"] + " Name: " + element["product_name"] + " Pice: " + element["price"] + " Quantity: " + element["stock_quantity"])
                    });
                    process.exit()
                });
                break;
            case "View Low Inventory":
                connection.query(`select * from products where stock_quantity<5`, function(err, result) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No matched results found!")
                    }
                    var data = JSON.parse(JSON.stringify(result));
                    data.forEach(function(element) {
                        console.log("Item ID: " + element["item_id"] + " Name: " + element["product_name"] + " Pice: " + element["price"] + " Quantity: " + element["stock_quantity"])
                    });
                    process.exit()
                });
                break;
            case "Add to Inventory":
                addItem();
                break;

            case "Add New Product":
                addNewItem();
                break;
        }
    })
}

function addItem() {
    inquirer.prompt([{
            name: "itemID",
            message: "Enter the item ID that you want to add",
            type: "input",
            validate: function(value) {
                if (Number.isInteger(Number(value))) {
                    return true
                } else {
                    console.log("\nDo not troll me! Please enter a valid number!!!!!")
                    return false
                }
            }
        },
        {
            name: "quantity",
            message: "Enter the quantity you want to add to the item",
            type: "input",
            validate: function(value) {
                if (Number.isInteger(Number(value))) {
                    return true
                } else {
                    console.log("\nDo not troll me! Please enter a valid number!!!!!")
                    return false
                }
            }
        }
    ]).then(function(user) {
        connection.query(`select product_name,stock_quantity from products where item_id=${user.itemID}`, function(err, data) {
            if (err) throw err;
            var name = data[0]["product_name"];
            var stock = data[0]["stock_quantity"];
            connection.query(`update products set ? where ?`, [{
                    stock_quantity: parseInt(user.quantity) + stock
                },
                {
                    item_id: user.itemID
                }
            ], function(err) {
                if (err) throw err;
                console.log(`You have successfully added ${user.quantity} ${name} to its stock`);
                process.exit()
            })
        })

    })
}


function addNewItem() {
    inquirer.prompt([{
            name: "newitem",
            message: "Enter the new item name that you want to add",
            type: "input",
        },
        {
            name: "quantity",
            message: "Enter the quantity you want to add to the item",
            type: "input",
            validate: function(value) {
                if (Number.isInteger(Number(value))) {
                    return true
                } else {
                    console.log("\nDo not troll me! Please enter a valid number!!!!!")
                    return false
                }
            }
        },
        {
            name: "department",
            message: "Enter the department name that the item belongs to",
            type: "input",

        },
        {
            name: "price",
            message: "Enter the item price",
            type: "input",
        }
    ]).then(function(data) {
        connection.query(`insert into products set ?`, [{
            product_name: data.newitem,
            department_name: data.department,
            price: data.price,
            stock_quantity: data.quantity
        }], function(err) {
            if (err) throw err
            console.log(`You have succeffuly added ${data.quantity} ${data.newitem} to the database!`)
            process.exit()
        })
    })
}