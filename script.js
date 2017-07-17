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
            + 'path VARCHAR(100),'
            + 'category VARCHAR(30),'
            + 'data VARCHAR(1000)'
            +  ')', function (err) {
                if (err) throw err;
        });
        connection.query('CREATE TABLE IF NOT EXISTS counter(count INT)');
        connection.query('CREATE TABLE IF NOT EXISTS dataset(data VARCHAR(500))');
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


// Update MySQL database
app.post('/users', function (req, res) {
    console.log(req.body);
    var app = req.body.app;
    var version = req.body.version;
    var host = req.body.host;
    var path =  req.body.path;
    var data = req.body.data;
    var dataset = req.body.data_set;
    var sql = "INSERT INTO labels SET app='"+ app + "', version='" + version + "', host='"+ host + "', path='" + path + "', data='"+data+"'";
    connection.query(sql, 
        function (err, result) {
            if (err) throw err;
        }
    );
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