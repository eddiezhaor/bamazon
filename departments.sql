drop database if exists departments;
create database departments;
use departments;
drop table if exists departments;
create table departments(
   department_id int(11 )not null auto_increment,
   department_name varchar(50) not null,
   over_head_cost int(11) not null,
   primary key(department_id)
)

insert into departments("department_id", "department_name","over_head_cost") values(01,"electronics",100000);
insert into departments("department_id", "department_name","over_head_cost") values(02,"grocery",600000);
