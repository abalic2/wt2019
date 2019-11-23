let Kalendar = (function(){
    let nazivi_mjeseca = ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"];
    let periodicneIzmjene = [];
    let vanredneIzmjene = [];

    function jeLiSpadaUSemetar(mjesec, semestar){
        if(semestar === "zimski" &&  ((mjesec >= 9 && mjesec <= 11) || mjesec === 0))
            return true;

        if(semestar === "ljetni" &&  ((mjesec >= 1 && mjesec <= 5)))
            return true;

        return false;
    }

    function dajBrojDanaMjeseca(mjesec){
        return new Date(new Date().getFullYear(), mjesec + 1, 0).getDate();
    }

    function dajPrviDan(mjesec){
        let d = new Date(new Date().getFullYear(), mjesec, 1).getDay();
        if(d == 0) d = 7;
        return d;
    }

    function jeLiIspravanDatum(datum){
        let ispravno = datum.match(/^([0-2][0-9]|(3)[0-1])(\.)(((0)[0-9])|((1)[0-2]))(\.)\d{4}$/);
        return ispravno;
    }

    function jeLiIspravnoVrijeme(vrijeme){
        let ispravno = vrijeme.match(/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/);
        return ispravno;
    }

    function jeLiValidanDan(dan){
        return dan>=0 && dan<=6;
    }

    function jeLiValidanSemestar(semestar){
        return semestar ==="zimski" || semestar ==="ljetni";
    }

    function jeLiIspravanMjesec(mjesec){
        return mjesec>=0 && mjesec<=11;
    }

    function jeLiValidnoPeriodicno(periodicna){
        return (jeLiValidanDan(periodicna.dan) && jeLiValidanSemestar(periodicna.semestar) && 
            jeLiIspravnoVrijeme(periodicna.pocetak) && jeLiIspravnoVrijeme(periodicna.kraj));
    }

    function jeLiValidnoVanredno(vanredna){
        return jeLiIspravanDatum(vanredna.datum) && jeLiIspravnoVrijeme(vanredna.pocetak) && jeLiIspravnoVrijeme(vanredna.kraj);
    }
    

    function imaLiPresjekaVremena(pocetak, kraj, zauzeto_pocetak, zauzeto_kraj){
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

        if((minute_sa_forme_pocetak >= minute_sa_zauzeca_kraj && minute_sa_forme_kraj >= minute_sa_zauzeca_kraj) ||
        (minute_sa_forme_pocetak <= minute_sa_zauzeca_pocetak && minute_sa_forme_kraj <= minute_sa_zauzeca_pocetak)){
                return false;
        }
        return true;
    }

    function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj){ 
        if(!jeLiIspravanMjesec(mjesec)){
            return;
        }

        let dani = kalendarRef.getElementsByClassName("dan");

        //vracanje sve na zeleno
        let sveZauzete  = kalendarRef.getElementsByClassName("zauzeta");
        for(let i = sveZauzete.length-1; i >=0; i--){
                let a = sveZauzete[i];
                a.classList.remove("zauzeta");
                a.classList.add("slobodna");
        }
                
        if(!(jeLiIspravnoVrijeme(pocetak) && jeLiIspravnoVrijeme(kraj))){
            return;
        }

        //za periodicne
        for(let i = 0 ; i < periodicneIzmjene.length; i++){
            let zauzeto = periodicneIzmjene[i];
            if(zauzeto.naziv === sala  && jeLiSpadaUSemetar(mjesec, zauzeto.semestar)){
                if(imaLiPresjekaVremena(pocetak,kraj,zauzeto.pocetak,zauzeto.kraj)) {
                    for(let j = (zauzeto.dan + ( 8 - dajPrviDan(mjesec)))%7; j < dani.length;  j += 7){
                        if(dani[j].getElementsByClassName("slobodna").length != 0){
                            let boja  = dani[j].getElementsByClassName("slobodna")[0];
                            boja.classList.remove("slobodna");
                            boja.classList.add("zauzeta");
                        }
                    }
                }
            }
        }

        //za vanredne
        for(let i = 0 ; i < vanredneIzmjene.length; i++){
            let zauzeto = vanredneIzmjene[i];
            let dd = parseInt(zauzeto.datum.slice(0,2));
            let mm = parseInt(zauzeto.datum.slice(3,5));
            let yyyy = parseInt(zauzeto.datum.slice(6));
            if((mjesec+1) === mm && yyyy == new Date().getFullYear()){
                if(imaLiPresjekaVremena(pocetak,kraj,zauzeto.pocetak,zauzeto.kraj)) {
                    if(dani[dd-1].getElementsByClassName("slobodna").length != 0){
                        let boja  = dani[dd-1].getElementsByClassName("slobodna")[0];
                        boja.classList.remove("slobodna");
                        boja.classList.add("zauzeta");
                    }
                   
                }
            }
        }

    }

    function ucitajPodatkeImpl(periodicna, vanredna){
        periodicneIzmjene.length = 0;
        vanredneIzmjene.length = 0;

        if(periodicna != null){
            for(let i = 0; i < periodicna.length; i++){
                if(jeLiValidnoPeriodicno(periodicna[i])){
                    let objekat = Object.create(periodicna[i]);
                    periodicneIzmjene.push(objekat);
                }   
            }
        }

        if(vanredna != null){
            for(let i = 0; i < vanredna.length; i++){
                if(jeLiValidnoVanredno(vanredna[i])){
                    let objekat = Object.create(vanredna[i]);
                    vanredneIzmjene.push(objekat);
                }
            }
        }

    }

    function iscrtajKalendarImpl(kalendarRef, mjesec){
        //mijenjane naziva mjeseca 
        if(jeLiIspravanMjesec(mjesec)){
            if (typeof kalendarRef.getElementsByClassName("sviDani")[0] === 'undefined'){
                let labela = document.createElement("label");        
                labela.innerText = nazivi_mjeseca[mjesec];     
                labela.classList.add("labelaMjesec"); 
                kalendarRef.appendChild(labela);  

                let sviDani = document.createElement("div");  
                sviDani.classList.add("sviDani");      
                kalendarRef.appendChild(sviDani); 
            }
            else{
                kalendarRef.getElementsByClassName("labelaMjesec")[0].innerHTML = nazivi_mjeseca[mjesec];
                kalendarRef.getElementsByClassName("sviDani")[0].innerHTML = "";
            }
             

            let brojDana = dajBrojDanaMjeseca(mjesec);
            let sviDani = kalendarRef.getElementsByClassName("sviDani")[0];
            for(let i = 0 ; i < brojDana; i++){
                let jedanDan = " <div class=\"dan\"> <div class=\"broj\">" + (i+1) + "</div> <div class=\"slobodna\"></div> </div>";
                sviDani.innerHTML += jedanDan;
            }

            //namjestanje da pocinje od odgovorajuceg dana 
            let prviDan = dajPrviDan(mjesec);
            kalendarRef.getElementsByClassName("dan")[0].style['grid-column-start']= prviDan;
        }
    }
    return {
        obojiZauzeca: obojiZauzecaImpl,
        ucitajPodatke: ucitajPodatkeImpl,
        iscrtajKalendar: iscrtajKalendarImpl
    }
}());


