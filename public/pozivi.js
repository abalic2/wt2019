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

    function rezervisiVanredniTerminImpl(dan, mjesec, sala, pocetak, kraj, osoba){
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
        novi = '{"datum": "' + datum + '","pocetak": "'+ pocetak + '","kraj": "'+ kraj+'","naziv": "'+ sala +'","predavac": "' + osoba +'"}';
        ajax.send(novi);
    }

    function rezervisiPeriodicniTerminImpl(dan, mjesec, sala, pocetak, kraj, osoba){
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
        let novi = '{"zauzece":{"dan":"'+d+'","semestar":"'+ semestar + '","pocetak": "'+ pocetak + '","kraj": "'+ kraj+'","naziv": "'+ sala +'","predavac": "'+osoba+'"}, "informacije" : { "datum" : "'+ datum+'"}}';
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

    function ucitajOsobljeImpl(){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){
            let osoblje = JSON.parse(ajax.response);
            let opcije = "";
            for(let i = 0; i< osoblje.length; i++){
                opcije = opcije + '<option value="' + osoblje[i].ime + ' ' + osoblje[i].prezime+ '">' + osoblje[i].ime + ' ' + osoblje[i].prezime+'</option>';
            }
            document.getElementById("osoblje").innerHTML = opcije;
        }
        if (ajax.readyState == 4 && ajax.status == 404)
            console.log( "Greska: nepoznat URL");
        }
        ajax.open("GET", "/osoblje", true);
        ajax.send();
    }

    function ucitajSaleImpl(){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){
            let sale = JSON.parse(ajax.response);
            let opcije = "";
            for(let i = 0; i< sale.length; i++){
                opcije = opcije + '<option value="' + sale[i].naziv + '">' + sale[i].naziv + '</option>';
            }
            document.getElementById("sala").innerHTML = opcije;
        }
        if (ajax.readyState == 4 && ajax.status == 404)
            console.log( "Greska: nepoznat URL");
        }
        ajax.open("GET", "/sale", true);
        ajax.send();
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

    function jeLiUpadaVrijeme(pocetak, kraj, vrijeme){
        let sat_pocetak = parseInt(pocetak.slice(0,2));
        let sat_kraj = parseInt(kraj.slice(0,2));
        let min_pocetak = parseInt(pocetak.slice(3));
        let min_kraj = parseInt(kraj.slice(3));

        let sat_vrijeme = parseInt(vrijeme.slice(0,2));
        let min_vrijeme = parseInt(vrijeme.slice(3));

        let minute_pocetak = sat_pocetak*60 + min_pocetak;
        let minute_kraj = sat_kraj*60 + min_kraj;
        let minute_vrijeme = sat_vrijeme*60 + min_vrijeme;

        if(minute_pocetak <= minute_vrijeme && minute_vrijeme < minute_kraj){
            return true;
        }
        return false;
    }

    function ucitajPodatkeOOsobljuImpl(){
        let sale = [];
        let y = new Date().getFullYear();
        let m = new Date().getMonth()+1;
        let d = new Date().getDate();
        if(m<10) m = '0'+m;
        if(d<10) d = '0' + d;
        let datum = d+'.'+m+'.'+y;
        let vrijeme = new Date().toLocaleTimeString().slice(0,5);
        console.log(datum, vrijeme);
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200){
            let osoblje = JSON.parse(ajax.response);
            ajax.onreadystatechange = function() {
                if (ajax.readyState == 4 && ajax.status == 200){
                    let zauzeca = JSON.parse(ajax.response);
                    let periodicna =  zauzeca.periodicna;
                    let vanredna = zauzeca.vanredna;
                    for(let i = 0; i < osoblje.length; i++){
                        let imaSalu = false;
                        let s = "";
                        //osoba moze rezervisati vise sala na svoje ime, onda se prikazuju sve rezervisane sale
                        for(let j = 0; j < periodicna.length; j++){
                            if(periodicna[j].predavac === osoblje[i].ime + ' ' + osoblje[i].prezime){
                                if(jeLiDatumIstiSemestarIDan(datum, periodicna[j].dan, periodicna[j].semestar)){
                                    if(jeLiUpadaVrijeme(periodicna[j].pocetak, periodicna[j].kraj, vrijeme)){
                                        s = s + periodicna[j].naziv + ', ';
                                        imaSalu = true;
                                    }
                                }
                            }
                        }
                        for(let j = 0; j < vanredna.length; j++){
                            console.log(vanredna[j].datum);
                            if(vanredna[j].predavac === osoblje[i].ime + ' ' + osoblje[i].prezime){
                                if(datum === vanredna[j].datum){
                                    if(jeLiUpadaVrijeme(vanredna[j].pocetak, vanredna[j].kraj, vrijeme)){
                                        s = s + vanredna[j].naziv + ', ';
                                        imaSalu = true;
                                    }
                                }
                            }
                        }
                        if(!imaSalu){
                            sale.push("u kancelariji");
                        }
                        else{
                            s = s.slice(0,s.length-2);
                            sale.push(s);
                        }
                    }
                    tabela = '<table>' + "<tr>" + "<th>Ime i prezime</th> <th>Uloga</th> <th>Trenutna sala</th>" + "</tr>";
                    for(let i = 0; i < osoblje.length; i++){
                        tabela = tabela + "<tr>";
                        tabela = tabela + "<td>" + osoblje[i].ime + ' ' + osoblje[i].prezime + "</td>";
                        tabela = tabela + "<td>" + osoblje[i].uloga + "</td>";
                        tabela = tabela + "<td>" + sale[i] + "</td>";
                        tabela = tabela + "</tr>";
                    }
                    tabela = tabela + "</table>";
                    document.getElementsByClassName("sadrzaj")[0].innerHTML = tabela;
                }
                if (ajax.readyState == 4 && ajax.status == 404)
                    console.log("Greska: nepoznat URL");
                }
                ajax.open("GET", "/zauzeca", true);
                ajax.send();

        }
        if (ajax.readyState == 4 && ajax.status == 404)
            console.log("Greska: nepoznat URL");
        }
        ajax.open("GET", "/osoblje", true);
        ajax.send();

    }

    return {
        ucitajZauzeca: ucitajZauzecaImpl,
        rezervisiVanredniTermin: rezervisiVanredniTerminImpl,
        rezervisiPeriodicniTermin: rezervisiPeriodicniTerminImpl,
        ucitajTriSlike: ucitajTriSlikeImpl,
        ucitajPodatkeOOsoblju: ucitajPodatkeOOsobljuImpl,
        ucitajOsoblje: ucitajOsobljeImpl,
        ucitajSale: ucitajSaleImpl,
    }
}());


