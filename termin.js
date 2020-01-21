const Sequelize = require("sequelize");
const sequelize = require("./db.js");
 
module.exports = function (sequelize, DataTypes) {
    const Termin = sequelize.define('termin', {
       redovni: Sequelize.BOOLEAN,
       dan: Sequelize.INTEGER,
       datum: Sequelize.STRING,
       semestar: Sequelize.STRING,
       pocetak: Sequelize.TIME,
       kraj: Sequelize.TIME
    },
    {
        tableName : 'termin'
    }
   );
   return Termin;
}