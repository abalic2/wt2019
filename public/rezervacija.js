

var periodicna = [];

var vanredna = [];

let trenutniMjesec = new Date().getMonth(); 
    
function posaljiIzForme(){
    console.log("bojim");
    let sala = document.querySelector("select").value;
    let pocetak = document.getElementById("p").value;
    let kraj = document.getElementById("k").value;
    if (pocetak.trim() && kraj.trim()){
        Kalendar.obojiZauzeca(document.getElementById("kalendar"),trenutniMjesec,sala,pocetak,kraj);
    }
}

let promjenaSale = document.querySelector("select");
promjenaSale.addEventListener( "change", function( ev ) {
   posaljiIzForme();
}, false);


let promjenaPocetka = document.getElementById("p");
promjenaPocetka.addEventListener( "input", function( ev ) {
    posaljiIzForme();
 }, false);

 let promjenaKraja = document.getElementById("k");
promjenaKraja.addEventListener( "input", function( ev ) {
    posaljiIzForme();
 }, false);

let dugmePrethodni = document.getElementById("prethodni");
dugmePrethodni.addEventListener( "click", function( ev ) {
    if(trenutniMjesec >= 1){
        trenutniMjesec--;
        Kalendar.iscrtajKalendar(document.getElementById("kalendar"), trenutniMjesec);
        dodajListenereNaTajMjesec();0
        posaljiIzForme();
    }
 }, false);

let dugmeSljedeci = document.getElementById("sljedeci");
dugmeSljedeci.addEventListener( "click", function( ev ) {
    if(trenutniMjesec <= 10 ){
        trenutniMjesec++;
        Kalendar.iscrtajKalendar(document.getElementById("kalendar"), trenutniMjesec);
        dodajListenereNaTajMjesec();
        posaljiIzForme();
    }
 }, false);

function dodajListenereNaTajMjesec(){
    let dani = document.getElementsByClassName("dan");
    for (let i = 0; i < dani.length; i++){
        dani[i].addEventListener( "click", function( ev ) {
            let pocetak = document.getElementById("p").value;
            let kraj = document.getElementById("k").value;
            //moraju bit unesena vremena
            if (pocetak.trim() && kraj.trim()){
                slobodna = dani[i].getElementsByClassName("slobodna");
                //ako je zeleno polje
                let periodicnost = document.getElementById("check").checked;
                if((periodicnost && (trenutniMjesec > 8 || trenutniMjesec < 6)) || !periodicnost){
                    if(slobodna.length !== 0){ 
                        var r=confirm("Želite li rezervisati ovaj termin?");
                        if (r==true) {
                            
                            //dan, mjesec, sala, pocetak, kraj
                            if(periodicnost){
                                Pozivi.rezervisiPeriodicniTermin(i,trenutniMjesec,document.querySelector("select").value, document.getElementById("p").value, document.getElementById("k").value);
                            }
                            else {
                                Pozivi.rezervisiVanredniTermin(i,trenutniMjesec,document.querySelector("select").value, document.getElementById("p").value, document.getElementById("k").value);
                            }
                        }
                    }
                }
            }
        }, false);
    }
}

 window.onload = function(e){ 
    Pozivi.ucitajZauzeca();
    Kalendar.iscrtajKalendar(document.getElementById("kalendar"), trenutniMjesec);
    dodajListenereNaTajMjesec();
}

