let proba = {
    dan: 6,
    semestar: "zimski",
    pocetak: "12:00",
    kraj: "14:00",
    naziv: "0-01",
    predavac: "bitno"
}
  
let proba2 = {
    dan: 0,
    semestar: "ljetni",
    pocetak: "12:00",
    kraj: "14:00",
    naziv: "0-02",
    predavac: "nrbitno"
}

let vanredno = {
    datum: "02.03.2019",
    pocetak: "10:00",
    kraj: "12:00",
    naziv: "0-02",
    predavac: "vensada"
}

let niz = [];
niz[0] = proba;
niz[1] = proba2;

let v = [];
v[0] = vanredno;

let trenutniMjesec = new Date().getMonth(); 
    
Kalendar.ucitajPodatke(niz,v);
Kalendar.iscrtajKalendar(document.getElementById("kalendar"), trenutniMjesec);

function posaljiIzForme(){
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
        posaljiIzForme();
    }
 }, false);

let dugmeSljedeci = document.getElementById("sljedeci");
dugmeSljedeci.addEventListener( "click", function( ev ) {
    if(trenutniMjesec <= 10 ){
        trenutniMjesec++;
        Kalendar.iscrtajKalendar(document.getElementById("kalendar"), trenutniMjesec);
        posaljiIzForme();
    }
 }, false);

