const Sequelize = require("sequelize");
const sequelize = require("./db.js");
 
module.exports = function (sequelize, DataTypes) {
    const Rezervacija = sequelize.define('rezervacija', {
       termin: {
           type: Sequelize.INTEGER,
           unique: true
       },
       sala: Sequelize.INTEGER,
       osoba: Sequelize.INTEGER
    },
    {
        tableName : 'rezervacija'
    }
   );
   return Rezervacija;
}