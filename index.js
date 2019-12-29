const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');

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

app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/zauzeca',function(req,res){
        res.sendFile(__dirname+"/zauzeca.json");
});

app.get('/',function(req,res){
    res.sendFile(__dirname+"/public/pocetna.html");
});

app.post('/dodajvanrednozauzece',function(req,res){
    let tijelo = req.body;
    fs.readFile(__dirname+"/zauzeca.json" ,'utf8', function(err, contents) {
        if(err) throw err;
        zauzeca = JSON.parse(contents);
        periodicna = zauzeca.periodicna;
        vanredna = zauzeca.vanredna;
        let dodavanje = true;

        //provjera je li pocetak manji od kraja
        if(!nemaPresjekaVremena(tijelo['pocetak'], tijelo['kraj'], tijelo['pocetak'], tijelo['kraj'], true))
            dodavanje = false;
       
        if(dodavanje){ 
            //provjera varednih 
            for (let i = 0; i < vanredna.length; i++){
                let zauzeto = vanredna[i];
                if(zauzeto.naziv === tijelo['naziv']  && zauzeto.datum == tijelo['datum']){
                    if(!nemaPresjekaVremena(tijelo['pocetak'], tijelo['kraj'], zauzeto.pocetak, zauzeto.kraj,false)){
                        dodavanje = false;
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
                        break;
                    }
                }
            }
        }
        
        
        if(dodavanje){
            vanredna[vanredna.length] = tijelo;
            let n = '{"periodicna":' + JSON.stringify(periodicna) + ', "vanredna":' + JSON.stringify(vanredna) + '}';
            let novo = JSON.parse(n);
            fs.writeFile(__dirname+"/zauzeca.json", JSON.stringify(novo,null,4), (err) => {
                if (err) throw err;
                res.send(novo);
            });
        }
        else{
            res.status(300);
            res.json({poruka:"Nije moguće rezervisati salu " + tijelo['naziv'] +" za navedeni datum " + tijelo['datum'] + " i termin od " + tijelo['pocetak'] +" do " + tijelo['kraj']+"!", svaZauzeca:zauzeca});
        }
    });
});


app.post('/dodajperiodicnozauzece',function(req,res){
    let cijelo = req.body;
    fs.readFile(__dirname+"/zauzeca.json" ,'utf8', function(err, contents) {
        if(err) throw err;
        zauzeca = JSON.parse(contents);
        periodicna = zauzeca.periodicna;
        vanredna = zauzeca.vanredna;
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
                        break;
                    }
                }
            }
        }
              
    
        if(dodavanje) {
            periodicna[periodicna.length] = tijelo;
            let n = '{"periodicna":' + JSON.stringify(periodicna) + ', "vanredna":' + JSON.stringify(vanredna) + '}';
            let novo = JSON.parse(n);
            fs.writeFile(__dirname+"/zauzeca.json", JSON.stringify(novo,null,4), (err) => {
                if (err) throw err;
                res.send(novo);
            });
        }
        else{
            res.status(300);
            res.json({poruka:"Nije moguće rezervisati salu " + tijelo['naziv'] +" za navedeni datum " + datumZaPoruku['datum'] + " i termin od " + tijelo['pocetak'] +" do " + tijelo['kraj']+"!",svaZauzeca:zauzeca});
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