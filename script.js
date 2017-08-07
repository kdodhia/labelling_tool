var express = require('express')
var app = express()
var mysql = require('mysql');


// Application initialization
var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'myuser',
        password : 'pintobinkev'
    });


// Database setup
connection.query('CREATE DATABASE IF NOT EXISTS test', function (err) {
    if (err) throw err;
    connection.query('USE test', function (err) {
        if (err) throw err;
        connection.query('CREATE TABLE IF NOT EXISTS labels('
            + 'id INT NOT NULL AUTO_INCREMENT,'
            + 'PRIMARY KEY(id),'
            + 'app VARCHAR(100),'
            + 'version VARCHAR(10),'
            + 'host VARCHAR(100),'
            + 'path VARCHAR(500),'
            + 'category VARCHAR(30),'
            + 'data_prev_unknown VARCHAR(1000),'
            + 'data_prev_classifed VARCHAR(5000)'
            +  ')', function (err) {
                if (err) throw err;
        });
        connection.query('CREATE TABLE IF NOT EXISTS counter(count INT)');
        connection.query('CREATE TABLE IF NOT EXISTS rules(value VARCHAR(200), classifier VARCHAR(200))');
        connection.query('CREATE TABLE IF NOT EXISTS change_log(field VARCHAR(200), previous VARCHAR(200), new VARCHAR(200))');
    });
});

// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');
// Add this line below
app.use(bodyParser.urlencoded({ extended: false })) 

app.use(bodyParser.json());

app.use(express.static('www'));



app.get("/counter", function(req, res) {
    connection.query('USE test', function (err) {
        if (err) throw err;
        connection.query("SELECT * FROM counter", function(err, rows){
            if(err) {
                throw err;
            } else {
                var count_ = rows[0].count;
                var obj = {
                    counter: count_
                };
                res.send(obj);
            }
        });
    });
});

app.get("/changes", function(req, res) {
    connection.query('USE test', function (err) {
        if (err) throw err;
        connection.query("SELECT * FROM change_log", function(err, rows){
            if(err) {
                throw err;
            } else {
                var obj = {
                    change_log: rows
                };
                res.send(obj);
            }
        });
    });
});

app.get("/rules", function(req, res) {
    connection.query('USE test', function (err) {
        if (err) throw err;
        connection.query("SELECT * FROM rules", function(err, rows){
            if(err) {
                throw err;
            } else {
                var obj = {
                    rules: rows
                };
                res.send(obj);
            }
        });
    });
});


// Update MySQL database
app.post('/users', function (req, res) {
    console.log(req.body);
    var bool = req.body.skip;
    if (bool == 0){
        var app = req.body.app;
        var version = req.body.version;
        var host = req.body.host;
        var path =  req.body.path;
        var data_unknown = req.body.data_unknown;
        var data_new_rules = req.body.data_new_rules;
        var data_change_log = req.body.data_change_log;
        var data_classified = req.body.data_classified;
        var sql = "INSERT INTO labels SET app='"+ app + "', version='" + version + "', host='"+ host + "', path='" + path + "', data_prev_unknown='"+data_unknown+ "', data_prev_classifed='"+data_classified+"'";
        connection.query(sql, 
            function (err, result) {
                if (err) throw err;
            }
        );
        for (key in data_new_rules) {
            var sql = "INSERT INTO rules SET value='"+ key + "', classifier='" + data_new_rules[key] + "'";
            connection.query(sql, 
                function (err, result) {
                    if (err) throw err;
                }
            );
        }
        for (key in data_change_log) {
            var sql = "INSERT INTO change_log SET field='"+ key + "', new='" + data_change_log[key] + "'";
            connection.query(sql, 
                function (err, result) {
                    if (err) throw err;
                }
            );
        }
    }
    var sql1 = 'UPDATE counter SET count = count + 1' 
    connection.query(sql1, 
        function (err, result) {
            if (err) throw err;
        }
    );
    res.send("success")
});

var server = app.listen(9000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Express app listening at http://%s:%s', host, port)

})