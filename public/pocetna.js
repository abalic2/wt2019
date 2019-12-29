let ucitaneSlike = [];
let ucitaneSlikeBase = [];
var krajUcitavanja = false;
let brojacSlike = 0;

window.onload = function(e){ 
    //svaki put ide od pocetka 
    ucitaneSlike = [];
    ucitaneSlikeBase = [];
    brojacSlike = 0;
    krajUcitavanja = false;
    Pozivi.ucitajTriSlike(ucitaneSlike,ucitaneSlikeBase,brojacSlike);
}

let dugmePrethodni = document.getElementById("prethodni");
dugmePrethodni.addEventListener( "click", function( ev ) {
    if(brojacSlike > 3){
        if(brojacSlike%3==0){
            brojacSlike = brojacSlike - 3;
        }
        else if(brojacSlike%3==1){
            brojacSlike = brojacSlike - 1;
        }
        else{
            brojacSlike = brojacSlike - 2;
        }
        let dijelovi = ucitaneSlike[brojacSlike-3].split(".");
        let ekstenzija1 = dijelovi[dijelovi.length-1];
        dijelovi = ucitaneSlike[brojacSlike-2].split(".");
        let ekstenzija2 = dijelovi[dijelovi.length-2];
        dijelovi = ucitaneSlike[brojacSlike-1].split(".");
        let ekstenzija3 = dijelovi[dijelovi.length-1];
        document.getElementsByClassName("sadrzaj")[0].innerHTML = '<img src="data:image/'+ekstenzija1+';base64,'+ucitaneSlikeBase[brojacSlike-3]+'"><img src="data:image/'+ekstenzija2+';base64,'+ucitaneSlikeBase[brojacSlike-2]+'"><img src="data:image/'+ekstenzija3+';base64,'+ucitaneSlikeBase[brojacSlike-1]+'">'; 
    }
    console.log("brojac je na " + brojacSlike+", broj ucitanih slika je " + ucitaneSlikeBase.length);

 }, false);

let dugmeSljedeci = document.getElementById("sljedeci");
dugmeSljedeci.addEventListener( "click", function( ev ) {
    //ako su prikazane sve ucitane
    if(brojacSlike==ucitaneSlike.length){
        if(!krajUcitavanja){
            Pozivi.ucitajTriSlike(ucitaneSlike,ucitaneSlikeBase,brojacSlike);
        }
    }
    else{
        document.getElementsByClassName("sadrzaj")[0].innerHTML = "";
        for (let i = 0 ; i < 3; i++){
            if((brojacSlike + 1) <= ucitaneSlike.length){
                brojacSlike = brojacSlike + 1;                
                let dijelovi = ucitaneSlike[brojacSlike-1].split(".");
                let ekstenzija = dijelovi[dijelovi.length-1];
                document.getElementsByClassName("sadrzaj")[0].innerHTML += '<img src="data:image/'+ekstenzija+';base64,'+ucitaneSlikeBase[brojacSlike-1]+'">'
            }
            else{
                break;
            }
        }
        console.log("brojac je na " + brojacSlike+", broj ucitanih slika je " + ucitaneSlikeBase.length);
    }
 }, false);