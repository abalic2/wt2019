const app = require("../index");
var assert = require('chai').assert;
/*const chai = require("chai");
const chaiHttp = require("chai-http");*/
var request = require("supertest")(app);

before(function (done) {
    app.on("sveSpremno", function(){
        done();
    });
});

/*const { expect } = chai;
chai.use(chaiHttp);*/
describe("Testiranje GET/osoblje", () => {
    it("Provjera broja osoblja koja su vracena", done => {
        request
            .get("/osoblje")
            .expect(200)
            .end(function(err, res){
                assert.equal(res.body.length,3);
                done();
              });
    });
    it("Provjera svih ubacenih osoblja", done => {
        request
            .get("/osoblje")
            .expect(200)
            .end(function(err, res){
                let imam = [];
                imam.push(res.body[0].ime + ' ' + res.body[0].prezime);
                imam.push(res.body[1].ime + ' ' + res.body[1].prezime); 
                imam.push(res.body[2].ime + ' ' + res.body[2].prezime);
                assert.equal(imam.includes('Neko Nekic'),true);
                assert.equal(imam.includes('Drugi Neko'),true);
                assert.equal(imam.includes('Test Test'),true);
                done();
              });
    });
});

describe("Testiranje dohvatanja svih zauzeća", () => {
    it("Provjera pocetnih zauzeca u bazi", done => {
        request
            .get("/zauzeca")
            .expect(200)
            .end(function(err, res){
                zauzeca = JSON.parse(res.text);
                assert.equal(zauzeca.periodicna.length,1);
                assert.equal(zauzeca.vanredna.length,1);
                assert.equal(JSON.stringify(zauzeca.periodicna[0]).includes('"semestar":"zimski","pocetak":"13:00","kraj":"14:00"'),true);
                assert.equal(JSON.stringify(zauzeca.vanredna[0]).includes('"datum":"01.01.2020","pocetak":"12:00","kraj":"13:00"'),true);
                done();
              });
    });
    it("Provjera azuriranja zauzeca nakon dodavanja vanrednog", done => {
        let vanredno = {datum : "02.01.2020",pocetak: "11:00",kraj: "15:00",naziv: "1-11",predavac: "Neko Nekic"};
        request
            .post("/dodajvanrednozauzece")
            .send(vanredno)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res){ 
                novaZauzeca = JSON.parse(res.text);
                assert.notEqual(novaZauzeca,zauzeca);
                assert.equal(novaZauzeca.periodicna.length,1);
                assert.equal(novaZauzeca.vanredna.length,2);
                assert.equal(JSON.stringify(novaZauzeca.vanredna[1]).includes('"datum":"02.01.2020","pocetak":"11:00","kraj":"15:00"'),true);
                done();
            });
    });
    it("Provjera azuriranja zauzeca nakon dodavanja periodicnog", done => {
        let periodicno = {zauzece:{dan: "1", semestar: "zimski", pocetak: "11:00", kraj: "12:00", naziv: "1-15", predavac: "Test Test"}, informacije:{datum:"07.01.2020"}};
        request
            .post("/dodajperiodicnozauzece")
            .send(periodicno)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res){ 
                novaZauzeca2 = JSON.parse(res.text);
                assert.notEqual(novaZauzeca2,novaZauzeca);
                assert.equal(novaZauzeca2.periodicna.length,2);
                assert.equal(novaZauzeca2.vanredna.length,2);
                assert.equal(JSON.stringify(novaZauzeca2.periodicna[1]).includes('"dan":"1","semestar":"zimski","pocetak":"11:00","kraj":"12:00"'),true);
                done();
            });
    });
    
});

describe("Testiranje kreiranja nove rezervacije ", () => { //osnovni ispravni slucajevi su vec uradjeni u prosla dva testa
    it("Provjera pokusaja azuriranja zauzeca vanrednim preko drugog vanrednog s kojim ima preklapanje", done => {
        let vanredno = {datum : "02.01.2020",pocetak: "13:00",kraj: "15:00",naziv: "1-11",predavac: "Test Test"};
        request
            .post("/dodajvanrednozauzece")
            .send(vanredno)
            .set('Accept', 'application/json')
            .expect(300) //kod kad se desi greska
            .end(function(err, res){ 
                let odgovor = JSON.parse(res.text);
                let poruka = odgovor.poruka;
                assert.equal(poruka.includes("Nije moguće rezervisati salu 1-11 za navedeni datum 02.01.2020 i termin od 13:00 do 15:00!"),true);
                assert.equal(poruka.includes("Neko Nekic"),true);
                novaZauzeca3 = odgovor.svaZauzeca;
                assert.equal(JSON.stringify(novaZauzeca2),JSON.stringify(novaZauzeca3));
                done();
            });
    });

    it("Provjera pokusaja azuriranja zauzeca periodicnim preko drugog vanrednog s kojim ima preklapanje", done => {
        let periodicno = {zauzece:{dan: "2", semestar: "zimski", pocetak: "11:00", kraj: "15:00", naziv: "1-11", predavac: "Drugi Neko"}, informacije:{datum:"08.01.2020"}};
        request
            .post("/dodajperiodicnozauzece")
            .send(periodicno)
            .set('Accept', 'application/json')
            .expect(300) //kod kad se desi greska
            .end(function(err, res){ 
                let odgovor = JSON.parse(res.text);
                let poruka = odgovor.poruka;
                assert.equal(poruka.includes("Nije moguće rezervisati salu 1-11 za navedeni datum 08.01.2020 i termin od 11:00 do 15:00!"),true);
                assert.equal(poruka.includes("Neko Nekic"),true);
                novaZauzeca4 = odgovor.svaZauzeca;
                assert.equal(JSON.stringify(novaZauzeca2),JSON.stringify(novaZauzeca4));
                done();
            });
    });
    it("Provjera dodavanje istog periodicnog zauzeca za drugi semestar", done => {
        let periodicno = {zauzece:{dan: "1", semestar: "ljetni", pocetak: "11:00", kraj: "12:00", naziv: "1-15", predavac: "Test Test"}, informacije:{datum:"07.01.2020"}};
        request
            .post("/dodajperiodicnozauzece")
            .send(periodicno)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res){ 
                novaZauzeca5 = JSON.parse(res.text);
                assert.notEqual(novaZauzeca5,novaZauzeca4);
                assert.equal(novaZauzeca5.periodicna.length,3);
                assert.equal(novaZauzeca5.vanredna.length,2);
                assert.equal(JSON.stringify(novaZauzeca5.periodicna[2]).includes('"semestar":"ljetni"'),true);
                done();
            });
    });

    it("Provjera dodavanja istog vanrednog zauzeca za drugu salu", done => {
        let vanredno = {datum : "02.01.2020",pocetak: "11:00",kraj: "15:00",naziv: "1-15",predavac: "Neko Nekic"};
        request
            .post("/dodajvanrednozauzece")
            .send(vanredno)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res){ 
                novaZauzeca6 = JSON.parse(res.text);
                assert.notEqual(novaZauzeca5,novaZauzeca6);
                assert.equal(novaZauzeca6.periodicna.length,3);
                assert.equal(novaZauzeca6.vanredna.length,3);
                assert.equal(JSON.stringify(novaZauzeca6.vanredna[2]).includes('"naziv":"1-15"'),true);
                done();
            });
    });
    
});

describe("Testiranje dohvatanja svih sala", () => {
    it("Provjera broja sala koje su vracene", done => {
        request
            .get("/sale")
            .expect(200)
            .end(function(err, res){
                assert.equal(res.body.length,2);
                done();
              });
    });
    it("Provjera svih ubacenih sala", done => {
        request
            .get("/sale")
            .expect(200)
            .end(function(err, res){
                let imam = [];
                imam.push(res.body[0].naziv);
                imam.push(res.body[1].naziv); 
                assert.equal(imam.includes('1-11'),true);
                assert.equal(imam.includes('1-15'),true);
                done();
              });
    });
});

