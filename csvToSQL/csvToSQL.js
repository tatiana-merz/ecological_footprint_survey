//csv_stream.js
var fs = require('fs');
var rstream = fs.createReadStream('../Data/responses.csv');
var wstream = fs.createWriteStream('Responses.sql');


var CSV2SQL = require('csv2sql-lite');
var csv2sql = CSV2SQL({
    tableName: 'database',
    dbName: 'Responses',
    separator: ',',
    lineSeparator: '\n'
});

rstream.pipe(csv2sql).pipe(wstream);
