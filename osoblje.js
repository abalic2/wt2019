const Sequelize = require("sequelize");
const sequelize = require("./db.js");
 
module.exports = function (sequelize, DataTypes) {
    const Osoblje = sequelize.define('osoblje', {
       ime: Sequelize.STRING,
       prezime: Sequelize.STRING,
       uloga:  Sequelize.STRING
    },
    {
        tableName : 'osoblje'
    }
   );
   return Osoblje;
}