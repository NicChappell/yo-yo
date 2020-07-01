// require and configure dotenv
require('dotenv').config();

module.exports = {
  development: {
    username: 'root',
    password: 'password',
    database: 'yoyo',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: process.env.JAWSDB_USERNAME,
    password: process.env.JAWSDB_PASSWORD,
    database: process.env.JAWSDB_DATABASE,
    host: process.env.JAWSDB_HOST,
    dialect: 'mysql'
  }
}
