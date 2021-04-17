//csv_stream.js
var fs = require('fs');
var rstream = fs.createReadStream('../Data/responses.csv');
var wstream = fs.createWriteStream('mysqlToDB.sql');


var CSV2SQL = require('csv2sql-lite');
var csv2sql = CSV2SQL({
    tableName: 'Eco_dg_tmp',
    dbName: 'EcoDB',
    separator: ',',
    lineSeparator: ','
});

rstream.pipe(csv2sql).pipe(wstream);
