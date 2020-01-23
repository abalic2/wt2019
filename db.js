const Sequelize = require("sequelize");
const sequelize = new Sequelize("DBWT19", "root", "root", {
   host: "localhost",
   dialect: "mysql",
   logging:false
});

let db= {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.rezervacija = sequelize.import(__dirname+"/rezervacija.js");
db.termin = sequelize.import(__dirname+"/termin.js");
db.sala = sequelize.import(__dirname+"/sala.js");
db.osoblje = sequelize.import(__dirname+"/osoblje.js");





db.osoblje.hasMany(db.rezervacija, {as: 'rezervacijeOdOsobe', foreignKey: 'osoba'});
db.rezervacija.belongsTo(db.osoblje, {as: 'osobaZaRezervaciju', foreignKey: 'osoba'});
db.termin.hasOne(db.rezervacija, {as:'rezervacijaTermina', foreignKey: 'termin'});
db.rezervacija.belongsTo(db.termin,{as:'terminRezervacije', foreignKey:'termin'});
db.rezervacija.belongsTo(db.sala,{as:'salaRezervacije', foreignKey:'sala'});
db.sala.hasMany(db.rezervacija, {as: 'rezervacijeOdSala', foreignKey: 'sala'});
db.osoblje.hasOne(db.sala, {as:'salaOsobe', foreignKey: 'zaduzenaOsoba'});
db.sala.belongsTo(db.osoblje,{as:'osobaSale', foreignKey:'zaduzenaOsoba'});

module.exports=db;
