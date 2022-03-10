var mysql2 = require('mysql2');
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname+'/config/config.json')[env];

var pool = mysql2.createPool(config)
pool.getConnection((err, connection) => {
    if (err) {
        if(err.code){
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }else{
        console.error('Unexpected error')

    }
    }
    if (connection)    pool.releaseConnection(connection);

    return
})
module.exports = pool;