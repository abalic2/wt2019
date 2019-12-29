let Pozivi = (function(){

    function parsirajZauzeca(){
        periodicna =  zauzeca.periodicna;
        vanredna = zauzeca.vanredna;
        Kalendar.ucitajPodatke(periodicna,vanredna);
    }

    function ucitajZauzecaImpl(){ 
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){
            zauzeca = JSON.parse(ajax.responseText);
            parsirajZauzeca();
        }
        if (ajax.readyState == 4 && ajax.status == 404)
            console.log( "Greska: nepoznat URL");
        }
        ajax.open("GET", "/zauzeca", true);
        ajax.send();

    }

    function rezervisiVanredniTerminImpl(dan, mjesec, sala, pocetak, kraj){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){
            zauzeca = JSON.parse(ajax.response);
            parsirajZauzeca();
            Kalendar.obojiZauzeca(document.getElementById("kalendar"),mjesec-1,sala,pocetak,kraj);
        }
        if (ajax.readyState == 4 && ajax.status == 300){
            let sve  = JSON.parse(ajax.response);
            alert(sve.poruka);
            zauzeca = sve.svaZauzeca;
            parsirajZauzeca();
            Kalendar.obojiZauzeca(document.getElementById("kalendar"),mjesec-1,sala,pocetak,kraj);

        }
        if (ajax.readyState == 4 && ajax.status == 404)
            console.log( "Greska: nepoznat URL");
        }
        ajax.open("POST", "/dodajvanrednozauzece", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        let novi = "";
        mjesec = mjesec + 1;
        dan = dan + 1;
        if(dan<10)
            dan = "0" + dan;
        if(mjesec<10)
            mjesec = "0" + mjesec;
        let datum = dan + "." + mjesec + "." + new Date().getFullYear();
        novi = '{"datum": "' + datum + '","pocetak": "'+ pocetak + '","kraj": "'+ kraj+'","naziv": "'+ sala +'","predavac": "nebitno"}';
        ajax.send(novi);
    }

    function rezervisiPeriodicniTerminImpl(dan, mjesec, sala, pocetak, kraj){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){
            zauzeca = JSON.parse(ajax.response);
            parsirajZauzeca();
            Kalendar.obojiZauzeca(document.getElementById("kalendar"),mjesec-1,sala,pocetak,kraj);
        }
        if (ajax.readyState == 4 && ajax.status == 300){
            let sve  = JSON.parse(ajax.response);
            alert(sve.poruka);
            zauzeca = sve.svaZauzeca;
            parsirajZauzeca();
            Kalendar.obojiZauzeca(document.getElementById("kalendar"),mjesec-1,sala,pocetak,kraj);
        }
        if (ajax.readyState == 4 && ajax.status == 404)
            console.log( "Greska: nepoznat URL");
        }
        ajax.open("POST", "/dodajperiodicnozauzece", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        let semestar = "ljetni";
        if((mjesec >= 9 && mjesec <= 11) || mjesec === 0)
            semestar = "zimski";
        mjesec = mjesec + 1;
        dan = dan + 1;
        if(dan<10)
            dan = "0" + dan;
        if(mjesec<10)
            mjesec = "0" + mjesec;
        let datum = dan + "." + mjesec + "." + new Date().getFullYear();
        
        let d =  new Date(new Date().getFullYear(), mjesec-1, dan).getDay();
        if(d == 0) 
            d = 7;
        d = d - 1;
        let novi = '{"zauzece":{"dan":"'+d+'","semestar":"'+ semestar + '","pocetak": "'+ pocetak + '","kraj": "'+ kraj+'","naziv": "'+ sala +'","predavac": "nebitno"}, "informacije" : { "datum" : "'+ datum+'"}}';
        ajax.send(novi);
    }

    function ucitajTriSlikeImpl(ucitaneSlike,ucitaneSlikeBase,brojacSLike){
        
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){
            let noveUcitane = JSON.parse(ajax.response);
            brojDodanihSlika = parseInt(noveUcitane.velicina);
            brojacSlike = brojacSLike + brojDodanihSlika;
            if(noveUcitane.kraj === "true")
                krajUcitavanja = true;
           
            if(brojDodanihSlika>0){
                document.getElementsByClassName("sadrzaj")[0].innerHTML = "";
                ucitaneSlike.push(noveUcitane.prvaIme);
                ucitaneSlikeBase.push(noveUcitane.prva);
                let dijelovi = noveUcitane.prvaIme.split(".");
                let ekstenzija = dijelovi[dijelovi.length-1];
                document.getElementsByClassName("sadrzaj")[0].innerHTML += '<img src="data:image/'+ekstenzija+';base64,'+noveUcitane.prva+'">';
            }
            if(brojDodanihSlika>1){
                ucitaneSlike.push(noveUcitane.drugaIme);
                ucitaneSlikeBase.push(noveUcitane.druga);
                let dijelovi = noveUcitane.prvaIme.split(".");
                let ekstenzija = dijelovi[dijelovi.length-1];
                document.getElementsByClassName("sadrzaj")[0].innerHTML += '<img src="data:image/'+ekstenzija+';base64,'+noveUcitane.druga+'">';

            }
            if(brojDodanihSlika>2){
                ucitaneSlike.push(noveUcitane.trecaIme);
                ucitaneSlikeBase.push(noveUcitane.treca);
                let dijelovi = noveUcitane.prvaIme.split(".");
                let ekstenzija = dijelovi[dijelovi.length-1];
                document.getElementsByClassName("sadrzaj")[0].innerHTML += '<img src="data:image/'+ekstenzija+';base64,'+noveUcitane.treca+'">';

            }
            console.log(krajUcitavanja);
            console.log("brojac je na " + brojacSlike+", broj ucitanih slika je " + ucitaneSlikeBase.length);
            
        }
        if (ajax.readyState == 4 && ajax.status == 404)
            console.log( "Greska: nepoznat URL");
        }
        ajax.open("POST", "/ucitavanjeslika", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(ucitaneSlike));

    }

    return {
        ucitajZauzeca: ucitajZauzecaImpl,
        rezervisiVanredniTermin: rezervisiVanredniTerminImpl,
        rezervisiPeriodicniTermin: rezervisiPeriodicniTerminImpl,
        ucitajTriSlike: ucitajTriSlikeImpl,
    }
}());


