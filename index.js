function nemaPresjekaVremena(pocetak, kraj, zauzeto_pocetak, zauzeto_kraj, prva){
    let sat_pocetak = parseInt(pocetak.slice(0,2));
    let sat_kraj = parseInt(kraj.slice(0,2));
    let min_pocetak = parseInt(pocetak.slice(3));
    let min_kraj = parseInt(kraj.slice(3));

    let sat_p = parseInt(zauzeto_pocetak.slice(0,2));
    let sat_k = parseInt(zauzeto_kraj.slice(0,2));
    let min_p = parseInt(zauzeto_pocetak.slice(3));
    let min_k = parseInt(zauzeto_kraj.slice(3));

    let minute_sa_forme_pocetak = sat_pocetak*60 + min_pocetak;
    let minute_sa_forme_kraj = sat_kraj*60 + min_kraj;
    let minute_sa_zauzeca_pocetak = sat_p*60 + min_p;
    let minute_sa_zauzeca_kraj = sat_k*60 + min_k;

    if(minute_sa_forme_pocetak>minute_sa_forme_kraj){
        return false;
    }
    if(prva) return true;

    if((minute_sa_forme_pocetak >= minute_sa_zauzeca_kraj && minute_sa_forme_kraj >= minute_sa_zauzeca_kraj) ||
    (minute_sa_forme_pocetak <= minute_sa_zauzeca_pocetak && minute_sa_forme_kraj <= minute_sa_zauzeca_pocetak)){
            return true;
    }
    else{
        return false;
    }
}

function jeLiDatumIstiSemestarIDan(datum,dan,semestar){
    let dd = parseInt(datum.slice(0,2));
    let mm = parseInt(datum.slice(3,5));
    let yyyy = parseInt(datum.slice(6));
    let d =  new Date(yyyy,mm-1,dd).getDay();
    if(d == 0) 
        d = 7;
    d = d - 1;
    if (yyyy == new Date().getFullYear() && d === parseInt(dan)){
        if(semestar === "ljetni" && mm >= 2 && mm <= 6){
            return true;
        }
        else if(semestar==="zimski" && ((mm >= 10 && mm <= 12) || mm === 1)){
            return true;
        }
    }
    return false;
}



const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
const fs = require('fs');

const db = require('./db.js')

db.sequelize.sync({force:true}).then(function(){
    inicializacija().then(function(){
        app.emit("sveSpremno");
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
    });
});

function inicializacija(){
    var osobljeListaPromisea=[];
    var salaListaPromisea=[];
    var terminListaPromisea = [];
    var rezervacijaListaPromisea = [];
    return new Promise(function(resolve,reject){
        osobljeListaPromisea.push(db.osoblje.create({ime:'Neko', prezime:'Nekic', uloga:'profesor'}));
        osobljeListaPromisea.push(db.osoblje.create({ime:'Drugi', prezime:'Neko', uloga:'asistent'}));
        osobljeListaPromisea.push(db.osoblje.create({ime:'Test', prezime:'Test', uloga:'asistent'}));
        Promise.all(osobljeListaPromisea).then(function(osoblje){
            var osoba1=osoblje.filter(function(a){return a.ime==='Neko'})[0];
            var osoba2=osoblje.filter(function(a){return a.ime==='Drugi'})[0];
            var osoba3=osoblje.filter(function(a){return a.ime==='Test'})[0];
            salaListaPromisea.push(db.sala.create({naziv:'1-11',zaduzenaOsoba:osoba1.id}));
            salaListaPromisea.push(db.sala.create({naziv:'1-15',zaduzenaOsoba:osoba2.id}));
            Promise.all(salaListaPromisea).then(function(sale){
                var sala1=sale.filter(function(a){return a.naziv==='1-11'})[0];
                var sala2=osoblje.filter(function(a){return a.naziv==='1-15'})[0];
                terminListaPromisea.push(db.termin.create({redovni:false,dan:null,datum:'01.01.2020', semestar:null,pocetak:'12:00',kraj:'13:00'}));
                terminListaPromisea.push(db.termin.create({redovni:true,dan:0,datum:null, semestar:'zimski',pocetak:'13:00',kraj:'14:00'}));
                Promise.all(terminListaPromisea).then(function(termini){
                    var termin1=termini.filter(function(a){return a.redovni===false})[0];
                    var termin2=termini.filter(function(a){return a.redovni===true})[0];
                    rezervacijaListaPromisea.push(db.rezervacija.create({termin:termin1.id,sala:sala1.id,osoba:osoba1.id}));
                    rezervacijaListaPromisea.push(db.rezervacija.create({termin:termin2.id,sala:sala1.id,osoba:osoba3.id}));
                    Promise.all(rezervacijaListaPromisea).then(function(b){
                        resolve(true);
                    }).catch(function(err){console.log("Rezervacija greska "+err);});
                }).catch(function(err){console.log("Termin greska "+err);});
            }).catch(function(err){console.log("Sala greska "+err);});   
        }).catch(function(err){console.log("Osoblje greska "+err);});   
    });
}


function uzimanjeZauzeca(){
    let sve = "";
    return new Promise(function(resolve,reject){
            db.termin.findAll().then(function(termini){
                let periodicna  = "";
                let vanredna = "";
                let prvaP = true;
                let prvaV = true;
                if(termini.length == 0){
                    let sve = '{"periodicna": [' + periodicna + '],"vanredna": ['+ vanredna + ']}';
                    resolve(sve);
                }
                for(let i = 0; i< termini.length; i++){
                    let termin = termini[i];
                    db.rezervacija.findOne({where:{termin:termin.id}}).then(function(rezervacija){
                        db.sala.findOne({where:{id:rezervacija.sala}}).then(function(sala){
                            db.osoblje.findOne({where:{id:rezervacija.osoba}}).then(function(osoba){
                                if(termin.redovni == true){ //periodicna je
                                    if(!prvaP) periodicna = periodicna + ',';
                                    prvaP = false;
                                    periodicna = periodicna + '{"dan":"' + termin.dan + '","semestar":"' + termin.semestar + '","pocetak":"'+termin.pocetak.slice(0,5) + '","kraj":"' + termin.kraj.slice(0,5) + '","naziv":"' + sala.naziv + '","predavac":"' + osoba.ime + ' ' + osoba.prezime + '"}';
                                }
                                else{
                                    if(!prvaV) vanredna = vanredna + ',';
                                    prvaV = false;
                                    vanredna = vanredna + '{"datum":"' + termin.datum +  '","pocetak":"'+termin.pocetak.slice(0,5) + '","kraj":"' + termin.kraj.slice(0,5) + '","naziv":"' + sala.naziv + '","predavac":"' + osoba.ime + ' ' + osoba.prezime + '"}';
                                }
                                if(i == termini.length -1 ){
                                    let sve = '{"periodicna": [' + periodicna + '],"vanredna": ['+ vanredna + ']}';
                                    resolve(sve);
                                }
                            })
                        })
                    })
                }
                
            });
    });
}

function slanjePoruke(indeksZauzetog, smetaPeriodicna, periodicna, vanredna, tnaziv, tdatum,tpocetak,tkraj){
    return new Promise(function(resolve,reject){
            if(smetaPeriodicna){
                db.sala.findOne({where:{naziv:tnaziv}}).then(function(sala){
                    db.rezervacija.findAll({where:{sala:sala.id}}).then(function(rezervacije){
                        for(let i = 0; i< rezervacije.length; i++){
                            db.termin.findAll({where:{id:rezervacije[i].termin,dan:parseInt(periodicna[indeksZauzetog].dan), semestar:periodicna[indeksZauzetog].semestar, pocetak:periodicna[indeksZauzetog].pocetak,kraj:periodicna[indeksZauzetog].kraj}}).then(function(termin){
                                if(termin.length === 1){
                                    db.osoblje.findOne({where:{id:rezervacije[i].osoba}}).then(function(osoba){
                                        resolve("Nije moguće rezervisati salu " + tnaziv +" za navedeni datum " + tdatum+ " i termin od " + tpocetak+" do " + tkraj+"! Salu je zauzela osoba " + osoba.ime + ' ' + osoba.prezime + ' koja je ' + osoba.uloga);
                                    })
                                }
                            })
                        }
                    })
                })
            }
            else{
                db.sala.findOne({where:{naziv:tnaziv}}).then(function(sala){
                    db.rezervacija.findAll({where:{sala:sala.id}}).then(function(rezervacije){
                        for(let i = 0; i< rezervacije.length; i++){
                            db.termin.findAll({where:{id:rezervacije[i].termin,datum:vanredna[indeksZauzetog].datum, pocetak:vanredna[indeksZauzetog].pocetak,kraj:vanredna[indeksZauzetog].kraj}}).then(function(termin){
                                if(termin.length === 1){
                                    db.osoblje.findOne({where:{id:rezervacije[i].osoba}}).then(function(osoba){
                                        resolve("Nije moguće rezervisati salu " + tnaziv +" za navedeni datum " + tdatum+ " i termin od " + tpocetak+" do " + tkraj+"! Salu je zauzela osoba " + osoba.ime + ' ' + osoba.prezime + ' koja je ' + osoba.uloga);
                                    })
                                }                                
                            })
                        }
                    })
                })
            }
    });
}

function dodavanjeRezervacije(tdatum,tpocetak,tkraj,tnaziv,tpredavac,tredovni,tdan,tsemestar){
    return new Promise(function(resolve,reject){
        db.termin.create(
            {
                redovni : tredovni,
                dan: tdan,
                datum : tdatum,
                semestar: tsemestar,
                pocetak : tpocetak,
                kraj: tkraj
            }
        ).then(function(termin){
            db.sala.findOne({where:{naziv:tnaziv}}).then(function(sala){
                db.osoblje.findOne({where:{ime:tpredavac.split(' ')[0], prezime:tpredavac.split(' ')[1]}}).then(function(osoba){
                    db.rezervacija.create(
                        {
                            termin : termin.id,
                            sala: sala.id,
                            osoba: osoba.id
                        }
                    ).then(function(rezervacija){
                        resolve();
                    })
                })
            })
                
        });
    });
}


var neuspjeh = function (poruka) {
    console.log("Došlo je do greške: " + poruka);
}

app.get('/zauzeca',function(req,res){
    uzimanjeZauzeca().then(function (x) {
        res.send(x);
     }, neuspjeh);
});


app.get('/osoblje',function(req,res){
    db.osoblje.findAll().then(function(result){
        res.send(result);
    });
});

app.get('/sale',function(req,res){
    db.sala.findAll().then(function(result){
        res.send(result);
    });
});

app.get('/',function(req,res){
    res.sendFile(__dirname+"/public/pocetna.html");
});

app.post('/dodajvanrednozauzece',function(req,res){
    let tijelo = req.body;
    
    let indeksZauzetog = 0;
    let smetaPeriodicna = false;
    uzimanjeZauzeca().then(function (sve) {
        let zauzeca = JSON.parse(sve);
        let periodicna = zauzeca.periodicna;
        let vanredna = zauzeca.vanredna;
        let dodavanje = true;
        //provjera je li pocetak manji od kraja
        if(!nemaPresjekaVremena(tijelo['pocetak'], tijelo['kraj'], tijelo['pocetak'], tijelo['kraj'], true))
            dodavanje = false;
    
        if(dodavanje){ 
            //provjera vanrednih 
            for (let i = 0; i < vanredna.length; i++){
                let zauzeto = vanredna[i];
                if(zauzeto.naziv === tijelo['naziv'] && zauzeto.datum == tijelo['datum']){
                    if(!nemaPresjekaVremena(tijelo['pocetak'], tijelo['kraj'], zauzeto.pocetak, zauzeto.kraj,false)){
                        dodavanje = false;
                        smetaPeriodicna = false;
                        indeksZauzetog = i;
                        break;
                    }
                }
            }
        }
        //provjera periodicnih
        if(dodavanje){
            for (let i = 0; i < periodicna.length; i++){
                let zauzeto = periodicna[i];
                if(zauzeto.naziv === tijelo['naziv']  && jeLiDatumIstiSemestarIDan(tijelo['datum'], zauzeto.dan, zauzeto.semestar)){
                    if(!nemaPresjekaVremena(tijelo['pocetak'], tijelo['kraj'], zauzeto.pocetak, zauzeto.kraj, false)){
                        dodavanje = false;
                        smetaPeriodicna = true;
                        indeksZauzetog = i;
                        break;
                    }
                }
            }
        }
        if(dodavanje){
            dodavanjeRezervacije(tijelo['datum'],tijelo['pocetak'],tijelo['kraj'],tijelo['naziv'],tijelo['predavac'],false,null,null).then(function () {
                uzimanjeZauzeca().then(function (sve) {
                    res.send(sve);
                },neuspjeh);

            },neuspjeh);
        }
        else{
            res.status(300);
            slanjePoruke(indeksZauzetog, smetaPeriodicna, periodicna, vanredna, tijelo['naziv'], tijelo['datum'],tijelo['pocetak'],tijelo['kraj']).then(function (tekst) {
                res.json({poruka:tekst,svaZauzeca:zauzeca});

            },neuspjeh);
        }
    
    
    
    }, neuspjeh);
});

app.post('/dodajperiodicnozauzece',function(req,res){
    let cijelo = req.body;
    let indeksZauzetog = 0;
    let smetaPeriodicna = false;
    uzimanjeZauzeca().then(function (sve) {
        let zauzeca = JSON.parse(sve);
        let periodicna = zauzeca.periodicna;
        let vanredna = zauzeca.vanredna;
        let dodavanje = true;
        let tijelo = cijelo['zauzece'];
        let datumZaPoruku = cijelo['informacije'];
    
        //provjera je li pocetak manji od kraja
        if(!nemaPresjekaVremena(tijelo['pocetak'], tijelo['kraj'], tijelo['pocetak'], tijelo['kraj'], true))
            dodavanje = false;
        
        if(dodavanje){
            for (let i = 0; i < periodicna.length; i++){
                let zauzeto = periodicna[i];
                if(tijelo['dan'] === zauzeto.dan && tijelo['semestar'] == zauzeto.semestar && tijelo['naziv'] ==zauzeto.naziv){
                    if(!nemaPresjekaVremena(tijelo['pocetak'], tijelo['kraj'], zauzeto.pocetak, zauzeto.kraj,false)){
                        dodavanje = false;
                        indeksZauzetog = i;
                        smetaPeriodicna = true;
                        break;
                    }
                }
            }
        }
        if(dodavanje){
            for (let i = 0; i < vanredna.length; i++){
                let zauzeto = vanredna[i];
                if(zauzeto.naziv === tijelo['naziv']  && jeLiDatumIstiSemestarIDan(zauzeto.datum, tijelo['dan'], tijelo['semestar'])){
                    if(!nemaPresjekaVremena(tijelo['pocetak'], tijelo['kraj'], zauzeto.pocetak, zauzeto.kraj,false)){
                        dodavanje = false;
                        indeksZauzetog = i;
                        smetaPeriodicna = false;
                        break;
                    }
                }
            }
        }
        if(dodavanje) {
            dodavanjeRezervacije(null,tijelo['pocetak'],tijelo['kraj'],tijelo['naziv'],tijelo['predavac'],true,parseInt(tijelo['dan']),tijelo['semestar'],).then(function () {
                uzimanjeZauzeca().then(function (sve) {
                    res.send(sve);
                },neuspjeh);

            },neuspjeh);
        }
        else{
            res.status(300);
            slanjePoruke(indeksZauzetog, smetaPeriodicna, periodicna, vanredna, tijelo['naziv'], datumZaPoruku['datum'],tijelo['pocetak'],tijelo['kraj']).then(function (tekst) {
                res.json({poruka:tekst,svaZauzeca:zauzeca});
            },neuspjeh);
        }
    });
});

app.post('/ucitavanjeslika',function(req,res){
    let tijelo = req.body;
    let nizSvih = [];
    let nove = [];
    fs.readdir(__dirname+"/slike", function (err, files) {
        if (err) throw err;
        if(files.length===0){
            let n = '{"velicina":"'+nove.length+'","kraj":"true"}';
            res.send(n);
        }
        for(let i = 0; i < files.length; i++) {
            let file = files[i];
            nizSvih.push(file);
            //ubacile su se sve
            if(nizSvih.length===files.length){
                for (let j = 0; j < nizSvih.length; j++){
                    let imaJeVec = false;
                    for(let k = 0; k < tijelo.length;k++){
                        if(nizSvih[j]===tijelo[k]){
                            imaJeVec = true;
                            break;
                        }
                    }
                    if(!imaJeVec && nove.length<3){
                        nove.push(nizSvih[j]);
                    }
                    if(nove.length===3){
                        break;
                    }
                }
                // u niz nove se nalaze imena 3 nove slike koje treba da se posalju
                let noveSlike = []; //ovdje ce biti slike 
                if(nove.length>0){
                    let kraj = nizSvih.length === (tijelo.length + nove.length);
                    fs.readFile(__dirname+"/slike/"+nove[0], { encoding: 'base64' }, function (err2,data){
                        if (err2) throw err2;
                        noveSlike[0] = data;
                        if(nove.length>1){
                            fs.readFile(__dirname+"/slike/"+nove[1], { encoding: 'base64' }, function (err3,data){
                                if (err3) throw err3;
                                noveSlike[1] = data;
                                if(nove.length>2){
                                    fs.readFile(__dirname+"/slike/"+nove[2], { encoding: 'base64' }, function (err4,data){
                                        if (err4) throw err4;
                                        noveSlike[2] = data;
                                        let n = '{"prva":"'+noveSlike[0]+'","druga":"'+noveSlike[1]+'","treca":"'+noveSlike[2]+'","prvaIme":"'+nove[0]+'","drugaIme":"'+nove[1]+'","trecaIme":"'+nove[2]+'","velicina":"'+nove.length+'","kraj":"'+kraj+'"}';
                                        res.send(n);
                                    });
                                }
                                else{
                                    let n = '{"prva":"'+noveSlike[0]+'","druga":"'+noveSlike[1]+'","prvaIme":"'+nove[0]+'","drugaIme":"'+nove[1]+'","velicina":"'+nove.length+'","kraj":"'+kraj+'"}';
                                        res.send(n);
                                }
                            });
                        }
                        else{
                            let n = '{"prva":"'+noveSlike[0]+'","prvaIme":"'+nove[0]+'","velicina":"'+nove.length+'","kraj":"'+kraj+'"}';
                            res.send(n);
                        }
                    });
                }
                else{
                    let n = '{"velicina":"'+nove.length+'","kraj":"true"}';
                    res.send(n);
                }
            }
        }
    });
});


app.listen(8080);

module.exports = app;