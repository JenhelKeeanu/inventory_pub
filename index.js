require('dotenv').config();

var express = require('express');
var winston = require('winston');
var app = express();
require('./app')(app);

app.listen(app.get('port'), () => {
    winston.info(`Zagana Inventory System is on PORT:${app.get('port')}`);
});

const cron = require("node-cron");
let shell = require("shelljs");

var n =  new Date();
var y = n.getFullYear();
var m = n.getMonth() + 1;
var d = n.getDate();
var hr = n.getHours();
var min = n.getMinutes();
var sec = n.getSeconds();  
var mt=m+1;
var dt=d+1;
if(m<10)m="0"+m;
if(d<10)d="0"+d;
if(mt<10)mt="0"+mt;
if(dt<10)dt="0"+dt;
var now = y +"-"+ m +"-"+ d; 
var nextDay = y +"-"+ mt +"-"+ dt; 

var db = require('./app/lib/database')();
var db_mage = require('./app/lib/database_mage')();
// cron.schedule("*/1 * * * *", function(){
    
//     console.log("Schedule Running...");
    
//     var query =`SELECT e.entity_id AS id,
//     v1.value AS name,
//     e.sku,
//     d1.value AS price
//     FROM catalog_product_entity e
//     LEFT JOIN catalog_product_entity_varchar v1 ON e.entity_id = v1.entity_id
//     AND v1.store_id = 0
//     AND v1.attribute_id =
//     (SELECT attribute_id
//     FROM eav_attribute
//     WHERE attribute_code = 'name'
//     AND entity_type_id =
//         (SELECT entity_type_id
//         FROM eav_entity_type
//         WHERE entity_type_code = 'catalog_product'))
//     LEFT JOIN catalog_product_entity_decimal d1 ON e.entity_id = d1.entity_id
//     AND d1.store_id = 0
//     AND d1.attribute_id =
//     (SELECT attribute_id
//     FROM eav_attribute
//     WHERE attribute_code = 'price'
//     AND entity_type_id =
//     (SELECT entity_type_id
//      FROM eav_entity_type
//      WHERE entity_type_code = 'catalog_product'))`;
//     db_mage.query(query, (err, prod_magento, fields) => {
//         if (err) console.log(err);
//         var query =`SELECT * FROM products`;
//         db.query(query, (err, prod_inventory, fields) => {
//             if (err) console.log(err);
//             for(var i=0;i<prod_magento.length;i++){
//                 var count=0;
//                 for(var x=0;x<prod_inventory.length;x++){
//                     if(prod_magento[i].sku==prod_inventory[x].SKU){
//                         count++;
//                     }else{
//                     }
//                 }
//                 var uom="";
//                 uom=prod_magento[i].sku;
//                 if(count==0){
//                 // echo "3";
//                     var arr = uom.split("-");
//                     if(arr.length<2){
//                     }else{
//                         var query = `INSERT INTO products VALUES(NULL,'`+prod_magento[i].sku+`' ,'`+prod_magento[i].name+`', '`+arr[1]+`', '`+prod_magento[i].price+`','Active');`;
//                         db.query(query,(err, insert, fields) => {
//                             if (err) console.log(err);
//                         });
//                         var query = `INSERT INTO stocks VALUES(NULL,'`+prod_magento[i].sku+`' ,0, 0, 0);`;
//                         db.query(query,(err, insert, fields) => {
//                             if (err) console.log(err);
//                         });
//                         // $query="INSERT INTO products VALUES(NULL,'".$package->sku."' ,'".$package->name."', '".$arr[1]."', '".$package->price."','Active');";
//                         // add_inventory($query);
//                         // $query="INSERT INTO stocks VALUES(NULL,'".$package->sku."' ,0, 0, 0);";
//                         // add_inventory($query);
//                     }
//                 }else{
//                 }
//             } 
//         });
//     });

//     //get latest order # in zagana_inventory
//     var query =`select * from orders order by order_id desc limit 1`;
//     db.query(query, (err, latest_in_order, fields) => {
//         if (err) console.log(err);
//         //get latest order # and item qty in zagana_magento
//         // console.log(latest_in_order);
//         var query =`select count(*) as line_items, order_id from sales_order_item where order_id > `+latest_in_order[0].order_id+` group by order_id order by order_id desc`;
//         db_mage.query(query, (err, latest_orders, fields) => {
//             if (err) console.log(err);
//             var query =`select so.entity_id,so.customer_firstname,so.customer_middlename,so.customer_lastname,so.shipping_amount,soa.vat_id,soa.street,soa.city,soa.address_type from sales_order so inner join sales_order_address soa on so.entity_id = soa.parent_id`;
//             db_mage.query(query, (err, latest_order, fields) => {
//                 if (err) console.log(err);
//                 var query =`select * from products join stocks on products.prod_id = stocks.prod_id order by products.prod_id desc`;
//                 db.query(query, (err, prod_list, fields) => {
//                     if (err) console.log(err);
//                     for(var i=0;i<latest_orders.length;i++){
//                         //get order details
//                         var query =`select so.entity_id,so.customer_firstname,so.customer_middlename,so.customer_lastname,so.shipping_amount,so.base_grand_total ,soa.vat_id,soa.street,soa.city,soa.address_type from sales_order so inner join sales_order_address soa on so.entity_id = soa.parent_id where so.entity_id = `+latest_orders[i].order_id;
//                         db_mage.query(query, (err, list_order, fields) => {
//                             if (err) console.log(err);
//                             for(var x=0;x<list_order.length;x++){
//                                 if(x==0){
//                                     if(list_order[x].address_type == 'shipping'){
//                                         var Saddress=list_order[x].street+" "+list_order[x].city;
//                                     }else{
//                                         var city=list_order[x].city;
//                                         var Baddress=list_order[x].street;
//                                     }
//                                 }else if(x==1){
//                                     if(list_order[x].address_type == 'shipping'){
//                                         var Saddress=list_order[x].street+" "+list_order[x].city;
//                                     }else{
//                                         var Baddress=list_order[x].street;
//                                         var city =list_order[x].city;
//                                     }
//                                     //recored new order
//                                     var query = `INSERT INTO orders VALUES(NULL,'`+list_order[x].entity_id+`' ,'`+Saddress+`' ,'`+Baddress+`' ,'`+city+`' ,'`+list_order[x].customer_firstname+` `+list_order[x].customer_middlename+` `+list_order[x].customer_lastname+`', '`+list_order[x].vat_id+`', '`+list_order[x].shipping_amount+`', '`+nextDay+`', '`+now+`', 'Pending', ' ','Unfulfilled',`+list_order[x].base_grand_total+`);`;
//                                     db.query(query,(err, insert, fields) => {
//                                         if (err) console.log(err);
//                                     });
//                                     //recored order payment
//                                     var query = `INSERT INTO order_payments VALUES(NULL,'`+list_order[x].entity_id+`' ,'0','' ,'','NULL' ,'Pending');`;
//                                     db.query(query,(err, insert, fields) => {
//                                         if (err) console.log(err);
//                                     });
//                                 }
//                             }
//                         });
//                         //get order items
//                         var query =`select sku,qty_ordered, order_id,price from sales_order_item where order_id = `+latest_orders[i].order_id;
//                         db_mage.query(query, (err, lineorder, fields) => {
//                             if (err) console.log(err);
//                             for(var y=0;y<lineorder.length;y++){
//                                 //save list of ordered items
//                                 var query = `INSERT INTO order_items VALUES(NULL,'`+lineorder[y].order_id+`' ,'`+lineorder[y].sku+`' ,'`+lineorder[y].price+`' , '`+lineorder[y].qty_ordered+`');`;
//                                 db.query(query,(err, insert, fields) => {
//                                     if (err) console.log(err);
//                                 });
//                                 var res = lineorder[y].sku.split("-");
//                                 var res = res[1].split(" ");
//                                 if(res[1] == 'g'){
//                                 var UOM = (res[0]*lineorder[y].qty_ordered)/1000;
//                                 }else if(res[1] == 'kg'){
//                                 var UOM = lineorder[y].qty_ordered;
//                                 }else{
//                                 var UOM = res[0];
//                                 }
//                                 for(var z=0;z<prod_list.length;z++){
//                                     if(lineorder[y].sku==prod_list[z].SKU){;
//                                         //update total ordered items
//                                         var total=prod_list[z].pending_qty + lineorder[y].qty_ordered;
//                                         var query ="UPDATE `stocks` SET `pending_qty` = '"+total+"', order_id = "+lineorder[y].order_id+" WHERE `stock_id` = "+prod_list[z].stock_id+";";
//                                         db.query(query,(err, query, fields) => {
//                                             if (err) console.log(err);
//                                         });             
//                                     }else{
//                                     }
//                                 }
//                             }
//                         });
//                     } 
//                 });
//             });
//         });
//     });
// });