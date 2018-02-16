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
    displayItems();
})


function displayItems() {
    connection.query("select item_id, product_name, price from products where stock_quantity>0", function(err, result) {
        if (err) throw err;
        var data = JSON.parse(JSON.stringify(result));
        data.forEach(function(element) {
            console.log("Item ID: " + element["item_id"] + " Name: " + element["product_name"] + " Pice: " + element["price"])
        });
        userChoice()
    })
}

function userChoice() {
    inquirer.prompt([{
            name: "itemId",
            message: "please enter the ID of the product you would like to buy",
            type: "input"
        },
        {
            name: "quantity",
            message: "Enter the quantity you would like to buy",
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
    ]).then(function(answer) {
        connection.query(`select product_sales,stock_quantity,price from products where item_id=${answer.itemId}`, function(err, result) {
            if (err) throw err
            var sales = result[0]["product_sales"];
            var quan = result[0]["stock_quantity"];
            var price = result[0]["price"];
            if (parseInt(answer.quantity) >= quan) {
                console.log("Insufficient quantity!")
            } else {
                connection.query(`update products set ? where ?`, [{
                        stock_quantity: quan - answer.quantity,
                        product_sales: answer.quantity * price + sales
                    },
                    {
                        item_id: answer.itemId
                    }

                ], function(err) {
                    if (err) throw err;
                    console.log("Total cost is: $" + Math.round(answer.quantity * price * 100) / 100);
                    process.exit()
                })

            }

        })


    });
}