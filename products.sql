drop database if exists products;
create database products;
use products;
drop table if exists products;
create table products (
    item_id int(11) not null unique auto_increment,
    product_name varchar(255) not null,
    department_name varchar(50) not null,
    price decimal(10,2) not null,
    stock_quantity int(11) not null,
    product_salesv decimal(20,2),
    primary key(item_id)
);


insert into products (product_name, department_name, price, stock_quantity) values("sour patch","grocery","5.00","218");
insert into products (product_name, department_name, price, stock_quantity) values("penaut banana","grocery","19.99","69");
insert into products (product_name, department_name, price, stock_quantity) values("spicy apple","grocery","3.12","89");
insert into products (product_name, department_name, price, stock_quantity) values("the dispatcher","books","14.95","50");
insert into products (product_name, department_name, price, stock_quantity) values("50 grey shades","books","25.33","10");
insert into products (product_name, department_name, price, stock_quantity) values("Llama Llama I Love You","books","4.06","150");
insert into products (product_name, department_name, price, stock_quantity) values("Pete the Cat: Valentine's Day Is Cool","books","6.11","510");
insert into products (product_name, department_name, price, stock_quantity) values("iphone x","electronics","1142.00","345");
insert into products (product_name, department_name, price, stock_quantity) values("macbook","electronics","1324.00","134");
insert into products (product_name, department_name, price, stock_quantity) values("ipad 3","electronics","675.00","245");


