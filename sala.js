const Sequelize = require("sequelize");
const sequelize = require("./db.js");
 
module.exports = function (sequelize, DataTypes) {
    const Sala = sequelize.define('sala', {
       naziv: Sequelize.STRING,
       zaduzenaOsoba: Sequelize.INTEGER
    },
    {
        tableName : 'sala'
    }
   );
   return Sala;
}