var express = require('express');
var router = express.Router();
var authMiddleware = require('../../auth/middlewares/auth');
var db = require('../../../lib/database')();
var moment = require("moment");
var Sync = require('sync');
var n =  new Date();
var y = n.getFullYear();
var m = n.getMonth() + 1;
var d = n.getDate();
var hr = n.getHours();
var min = n.getMinutes();
var sec = n.getSeconds();
if(m<10){
    m="0"+m;
}
if(d<10){
    d="0"+d;
}
var now = y +"-"+ m +"-"+ d; 
var yr = y + 1;

console.log(now);
router.get('/',(req, res) => {
    var query =`SELECT * FROM orders join order_payments on orders.order_id=order_payments.order_id`
    db.query(query, (err, all, fields) => {
        if (err) console.log(err);
        var query =`SELECT * FROM orders join order_payments on orders.order_id=order_payments.order_id where orders.created_at =`+now;
        db.query(query, (err, new_order, fields) => {
            if (err) console.log(err);
            var query =`SELECT * FROM orders join order_payments on orders.order_id=order_payments.order_id where orders.delivery_status = "Pending" and orders.date = "`+now+`";`;
            db.query(query, (err, delivery, fields) => {
                if (err) console.log(err);
                var query =`SELECT * FROM orders join order_payments on orders.order_id=order_payments.order_id where orders.delivery_status = "Delivered" and order_payments.payment_status = "Pending"`;
                db.query(query, (err, delivered, fields) => {
                    if (err) console.log(err);
                    var query =`SELECT * FROM orders join order_payments on orders.order_id=order_payments.order_id where orders.order_status = "Fulfilled"  and order_payments.payment_status = "Paid"`;
                    db.query(query, (err, done, fields) => {
                        if (err) console.log(err);
                        res.render('office/orders/views/orders',
                        {
                            all:all,
                            new_order:new_order,
                            delivery:delivery,
                            delivered:delivered,
                            done:done
                        });
                    });
                });
            });
        });
    });
});

// AJAX - GET ORDER DETAILS (VIEW)
router.post('/get_order_details',(req,res) => {
    console.log(`${req.body.id}`);
    var query = `select * from orders join order_payments on orders.order_id = order_payments.order_id WHERE orders.order_id = ${req.body.id}`
    db.query(query,(err, results, fields) => {
        if (err) console.log(err);
        var resultss = results[0];
        console.log(resultss)
        return res.send({order_details:resultss});
    });
});
// AJAX - GET ITEM DETAILS (VIEW)
router.post('/get_order_items',(req,res) => {
    console.log(`${req.body.id}`);
    var query = `select * from order_items join products on order_items.sku = products.SKU WHERE ordered_id = ${req.body.id}`
    db.query(query,(err, results, fields) => {
        if (err) console.log(err);
        console.log(results);
        return res.send({order_items:results});
    });
});
// AJAX - GET ITEM STOCKS (VIEW)
router.post('/get_item_stocks',(req,res) => {
    console.log(`${req.body.sku}`);
    console.log(`${req.body.id}`);
    var query = `select order_items.id,order_items.ordered_id,order_items.sku,order_items.price,products.NAME,order_items.qty_ordered,stocks.qty,stocks.pending_qty from order_items join products on order_items.sku = products.SKU join stocks on products.prod_id=stocks.prod_id where order_items.sku= '${req.body.sku}' and order_items.ordered_id= ${req.body.id}`
    db.query(query,(err, results, fields) => {
        if (err) console.log(err);
        // console.log(results);
        return res.send({items_qty:results});
    });
});
// AJAX - GET ITEM STOCKS (VIEW)
router.post('/deliverProducts',(req,res) => {
    Sync(function(){
        console.log(`DELIVERY`);
        var order_id=`${req.body.order_id}`;
        var item_count=`${req.body.item_count}`;
        var item_qty=req.body.item_quantity;
        var imageupload=req.body.imageupload;
        var item_id=req.body.item_id;
        var reasonfield=req.body.reasonfield;
        console.log(item_id);
        console.log(item_qty);
        console.log(imageupload);
        console.log(reasonfield);
        for(var i=0;i<item_count;i++){
            // console.log(item_id[i]);
            // console.log(item_qty[i]);
            // console.log(imageupload[i]);
            // console.log(reasonfield[i]);
            var id=item_id[i];
            var qty=item_qty[i];
            var image=imageupload[i];
            var reason=reasonfield[i];
            // result = get_prod_details(item_id[i]);
            get_prod_details(item_id[i], function(result){
               stuff_i_want = result;
               console.log(stuff_i_want);
           
               //rest of your code goes in here
            });
                // if (err) console.log(err);
                // console.log(results);
                // var rem_pen = results[0].pending_qty - item_qty[i];
                // var rem = results[0].qty - item_qty[i];
            console.log(result);
            console.log(id);
            console.log(qty);
            console.log(image);
            console.log(reason);
                // var query = `INSERT INTO stock_movement VALUES(NULL,'`+results[0].prod_id+`' ,'`+order_id+`' ,`+item_qty[i]+`,'delivered','`+now+`');`;
                // db.query(query,(err, insert, fields) => {
                //     // if (err) console.log(err);
                // });
                // var query =`UPDATE 'stocks' SET 'pending_qty' = `+rem_pen+`, 'qty' = `+rem+` , order_id = `+order_id+` WHERE 'stock_id' = `+results[0].stock_id+`;`;
                // db.query(query,(err, query, fields) => {
                //     if (err) console.log(err);
                // });  
                // var query =`UPDATE order_items SET 'qty_delivered' = `+item_qty[i]+`, 'file_link' = "`+imageupload[i]+`", 'qty_reason' = "`+reasonfield[i]+`"  WHERE 'ordered_id' = `+order_id+`;`;
                // db.query(query,(err, query, fields) => {
                //     if (err) console.log(err); 
                // });
        
        }    
        // var query =`UPDATE 'orders' SET 'delivery_status' = 'Delivered' WHERE 'order_id' = `+order_id+`;`;
        // db.query(query,(err, query, fields) => {
        //     if (err) console.log(err);
        // });
        // var query = `select order_items.id,order_items.ordered_id,order_items.sku,order_items.price,products.NAME,order_items.qty_ordered,stocks.qty,stocks.pending_qty from order_items join products on order_items.sku = products.SKU join stocks on products.prod_id=stocks.prod_id where order_items.sku= '${req.body.sku}' and order_items.ordered_id= ${req.body.id}`
        // db.query(query,(err, results, fields) => {
        //     if (err) console.log(err);
        //     // console.log(results);
        //     return res.send({items_qty:results});
        // });
            // res.redirect('/office/projects');
        });
});
function get_prod_details(item_id,callback){

    var query = `select * from products join stocks on products.prod_id = stocks.prod_id where products.prod_id = '`+item_id+`';`;
    db.query(query,(err, results, fields) => {
        // if (err) console.log(err);
        console.log(results);
        return callback(results);
    });
}
module.exports = router;
