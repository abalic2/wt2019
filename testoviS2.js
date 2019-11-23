let assert = chai.assert;
describe('Kalendar', function() {
 describe('iscrtajKalendar()', function() {
   it('treba prikazati 30 dana za april', function() {
     Kalendar.iscrtajKalendar(document.getElementById("kalendar"),3);
     let dani = document.getElementsByClassName("dan");
     assert.equal(dani.length, 30,"Broj dana treba biti 30");
   });

   it('treba prikazati 31 dana za decembar', function() {
    Kalendar.iscrtajKalendar(document.getElementById("kalendar"),11);
    let dani = document.getElementsByClassName("dan");
    assert.equal(dani.length, 31,"Broj dana treba biti 31");
  });

  it('treba prikazati da je prvi dan u petak za novembar 2019.', function() {
    Kalendar.iscrtajKalendar(document.getElementById("kalendar"),10);
    let petak = document.getElementsByClassName("dan")[0].getBoundingClientRect();
    let subota = document.getElementsByClassName("dan")[1].getBoundingClientRect();
    let nedjelja = document.getElementsByClassName("dan")[2].getBoundingClientRect();
    let ponedjeljak = document.getElementsByClassName("dan")[3].getBoundingClientRect();
    //petak subota i nedjelja su u istom redu
    let uslov = petak.y === subota.y && subota.y === nedjelja.y;
    //ponedjeljak je lijevo ispod u odnosu na petak
    uslov = uslov && ponedjeljak.y > petak.y && ponedjeljak.x < petak.x;
    assert.equal(uslov, true, "Uslovi pozicija trebaju biti tacni");
  });

  it('treba prikazati da je 30. dan u subotu za novembar 2019.', function() {
    Kalendar.iscrtajKalendar(document.getElementById("kalendar"),10);
    let petak = document.getElementsByClassName("dan")[28].getBoundingClientRect();
    let subota = document.getElementsByClassName("dan")[29].getBoundingClientRect();
    let nedjelja = document.getElementsByClassName("dan")[23].getBoundingClientRect();
    let ponedjeljak = document.getElementsByClassName("dan")[24].getBoundingClientRect();
    //ponedjeljak petak i subota su u istom redu
    let uslov = ponedjeljak.y === subota.y && subota.y === petak.y;
    //nedjelja je desno gore u odnosu na petak
    uslov = uslov && nedjelja.y < subota.y && nedjelja.x > subota.x;
    assert.equal(uslov, true, "Uslovi pozicija trebaju biti tacni");
  });

  it('treba prikazati da su dani za januar od 1. do 31. pocevsi od utorka', function() {
    Kalendar.iscrtajKalendar(document.getElementById("kalendar"),0);
    let dani = document.getElementsByClassName("dan");
    assert.equal(dani.length, 31,"Broj dana treba biti 31");
    assert.equal((dani[0].getElementsByClassName("broj")[0].innerHTML), 1, "Prvi dan treba biti 1");
    assert.equal((dani[dani.length - 1].getElementsByClassName("broj")[0].innerHTML), 31, "Zadnji dan treba biti 31");

    //prvi dan utorak
    let utorak = dani[0].getBoundingClientRect();
    let srijeda = dani[1].getBoundingClientRect();
    let nedjelja = dani[5].getBoundingClientRect(); 
    let ponedjeljak = dani[6].getBoundingClientRect(); //sedmica poslije
    //utorak srijeda i nedjelja u istom redu
    let uslov = utorak.y === srijeda.y && srijeda.y === nedjelja.y;
    //ponedjeljak je dole lijevo u odnosu na petak
    uslov = uslov && ponedjeljak.y > utorak.y && ponedjeljak.x < utorak.x;
    assert.equal(uslov, true, "Uslovi pozicija trebaju biti tacni");
  });


  it('treba prikazati da februar 2019. godine ima 28 dana', function() {
    Kalendar.iscrtajKalendar(document.getElementById("kalendar"),1);
    let dani = document.getElementsByClassName("dan");
    assert.equal(dani.length, 28,"Broj dana treba biti 28");
    assert.equal((dani[0].getElementsByClassName("broj")[0].innerHTML), 1, "Prvi dan treba biti 1");
    assert.equal((dani[dani.length - 1].getElementsByClassName("broj")[0].innerHTML), 28, "Zadnji dan treba biti 28");
  });

  it('treba prikazati da je zadnji dan decembra u utorak', function() {
    Kalendar.iscrtajKalendar(document.getElementById("kalendar"),11);
    let dani = document.getElementsByClassName("dan");
    let utorak = dani[30].getBoundingClientRect();
    let ponedjeljak = dani[29].getBoundingClientRect();
    let nedjelja = dani[28].getBoundingClientRect(); 
    //utorak srijeda i nedjelja u istom redu
    let uslov = utorak.y === ponedjeljak.y;
    //ponedjeljak je dole lijevo u odnosu na petak
    uslov = uslov && nedjelja.y < utorak.y && nedjelja.x > utorak.x;
    assert.equal(uslov, true, "Uslovi pozicija trebaju biti tacni");
  });
   
 });

 describe('obojiZauzece()', function() {
  it('treba da ne oboji nista jer nije pozvana ucitaj podatke', function() {
    Kalendar.iscrtajKalendar(document.getElementById("kalendar"),11);

    Kalendar.obojiZauzeca(document.getElementById("kalendar"),11, "0-01", "12:00", "14:00");
    let slobodne = document.getElementsByClassName("slobodna");
    let zauzete = document.getElementsByClassName("zauzeta");
    assert.equal(slobodne.length, 31,"Broj dana koji su slobodni treba biti jednak broju dana u mjesecu");
    assert.equal(zauzete.length, 0, "Broj zauzetih sala treba biti nula");
  });

  it('treba zauzeti termin normalno iako je dvaput naveden', function() {
    Kalendar.iscrtajKalendar(document.getElementById("kalendar"),10);

    let periodicne = [
      {
        dan: 2,
        semestar: "zimski",
        pocetak: "14:00",
        kraj: "16:30",
        naziv: "0-02",
        predavac: "nebitno"
      }
    ];

    let vanredne = [
      {
        datum: "13.11.2019",
        pocetak: "14:00",
        kraj: "16:00",
        naziv: "0-02",
        predavac: "vensada"
      }
    ];
    Kalendar.ucitajPodatke(periodicne, vanredne);
    Kalendar.obojiZauzeca(document.getElementById("kalendar"),10, "0-02", "12:00", "17:00");
    let dan = document.getElementsByClassName("dan")[12];
    let uslov = dan.getElementsByClassName("zauzeta").length === 1 && dan.getElementsByClassName("slobodna").length === 0;
    assert.equal(uslov, true, "Uslov treba biti tacan");
  });

  it('ne treba obojiti utorke u novembru', function() {
    Kalendar.iscrtajKalendar(document.getElementById("kalendar"),10);

    let periodicne = [
      {
        dan: 1,
        semestar: "ljetni",
        pocetak: "14:00",
        kraj: "16:30",
        naziv: "0-02",
        predavac: "nebitno"
      }
    ];

    let vanredne = [];

    Kalendar.ucitajPodatke(periodicne, vanredne);
    Kalendar.obojiZauzeca(document.getElementById("kalendar"),10, "0-02", "12:00", "17:00");
    let dani = document.getElementsByClassName("zauzeta");
    assert.equal(dani.length, 0, "Treba biti nula zauzetih sala");
  });

  it('ne treba obojiti 10.11.2019 jer je zauzece u decembru', function() {
    Kalendar.iscrtajKalendar(document.getElementById("kalendar"),10);

    let periodicne = [
    ];

    let vanredne = [
      {
        datum: "10.12.2019",
        pocetak: "14:00",
        kraj: "16:00",
        naziv: "0-02",
        predavac: "vensada"
      }
    ];
    Kalendar.ucitajPodatke(periodicne, vanredne);
    Kalendar.obojiZauzeca(document.getElementById("kalendar"),10, "0-02", "12:00", "17:00");
    let zauzeti = document.getElementsByClassName("zauzeta");
    assert.equal(zauzeti.length,0, "Ne treba biti zauzetih dana");
  });

  it('treba obojiti sve dane', function() {
    Kalendar.iscrtajKalendar(document.getElementById("kalendar"),2);

    let periodicne = [
      {
        dan: 0,
        semestar: "ljetni",
        pocetak: "14:00",
        kraj: "16:30",
        naziv: "0-02",
        predavac: "nebitno"
      },
      {
        dan: 1,
        semestar: "ljetni",
        pocetak: "14:00",
        kraj: "16:30",
        naziv: "0-02",
        predavac: "nebitno"
      },
      {
        dan: 2,
        semestar: "ljetni",
        pocetak: "14:00",
        kraj: "16:30",
        naziv: "0-02",
        predavac: "nebitno"
      },
      {
        dan: 3,
        semestar: "ljetni",
        pocetak: "14:00",
        kraj: "16:30",
        naziv: "0-02",
        predavac: "nebitno"
      },
      {
        dan: 4,
        semestar: "ljetni",
        pocetak: "14:00",
        kraj: "16:30",
        naziv: "0-02",
        predavac: "nebitno"
      },
      {
        dan: 5,
        semestar: "ljetni",
        pocetak: "14:00",
        kraj: "16:30",
        naziv: "0-02",
        predavac: "nebitno"
      },
      {
        dan: 6,
        semestar: "ljetni",
        pocetak: "14:00",
        kraj: "16:30",
        naziv: "0-02",
        predavac: "nebitno"
      }
    ];

    let vanredne = [];

    Kalendar.ucitajPodatke(periodicne, vanredne);
    Kalendar.obojiZauzeca(document.getElementById("kalendar"),2, "0-02", "12:00", "14:05");
    let dani = document.getElementsByClassName("slobodna");
    assert.equal(dani.length, 0, "Treba biti nula zauzetih sala");
    let zauzeti = document.getElementsByClassName("zauzeta");
    assert.equal(zauzeti.length, 31, "Treba biti 31 zauzet dan");
  });

  it('treba normalno obojit 10.12', function() {
    Kalendar.iscrtajKalendar(document.getElementById("kalendar"),11);

    let periodicne = [
    ];

    let vanredne = [
      {
        datum: "10.12.2019",
        pocetak: "14:00",
        kraj: "16:00",
        naziv: "0-02",
        predavac: "vensada"
      }
    ];
    Kalendar.ucitajPodatke(periodicne, vanredne);
    Kalendar.obojiZauzeca(document.getElementById("kalendar"),11, "0-02", "12:00", "17:00");
    let zauzeti = document.getElementsByClassName("zauzeta").length;
    Kalendar.obojiZauzeca(document.getElementById("kalendar"),11, "0-02", "12:00", "17:00");
    let zauzeti2 = document.getElementsByClassName("zauzeta").length;
    assert.equal(zauzeti, zauzeti2, "Isti broj zauzeca");
  });

  it('treba zadrzati samo drugi rezultat bojenja', function() {
    Kalendar.iscrtajKalendar(document.getElementById("kalendar"),10);

    let periodicne = [
      {
        dan: 1,
        semestar: "zimski",
        pocetak: "14:00",
        kraj: "16:30",
        naziv: "0-02",
        predavac: "nebitno"
      }
    ];

    let vanredne = [
      {
        datum: "13.11.2019",
        pocetak: "14:00",
        kraj: "16:00",
        naziv: "0-02",
        predavac: "vensada"
      }
    ];
    Kalendar.ucitajPodatke(periodicne, []);
    Kalendar.obojiZauzeca(document.getElementById("kalendar"),10, "0-02", "12:00", "17:00");
    let zauzeti1 = document.getElementsByClassName("zauzeta").length;
    Kalendar.ucitajPodatke([], vanredne);
    Kalendar.obojiZauzeca(document.getElementById("kalendar"),10, "0-02", "12:00", "17:00");
    let zauzeti2 = document.getElementsByClassName("zauzeta").length;
    assert.equal(zauzeti1 != zauzeti2,true, "Nije isti broj zauzetih dana");
    
  });

  it('treba da sve bude slobodno kad se posalju prazne liste', function() {
    Kalendar.iscrtajKalendar(document.getElementById("kalendar"),10);

    let periodicne = [
    ];

    let vanredne = [
    ];
    Kalendar.ucitajPodatke(periodicne, vanredne);

    Kalendar.obojiZauzeca(document.getElementById("kalendar"),10, "0-02", "12:00", "17:00");
    let zauzeti1 = document.getElementsByClassName("zauzeta").length;
    assert.equal(zauzeti1, 0,  "Svi dani slobodni");
    
  });

  it('ne treba obojiti 10.12. jer je u drugoj godini', function() {
    Kalendar.iscrtajKalendar(document.getElementById("kalendar"),11);

    let periodicne = [
    ];

    let vanredne = [
      {
        datum: "10.12.2020",
        pocetak: "14:00",
        kraj: "16:00",
        naziv: "0-02",
        predavac: "vensada"
      }
    ];
    Kalendar.ucitajPodatke(periodicne, vanredne);
    Kalendar.obojiZauzeca(document.getElementById("kalendar"),11, "0-02", "12:00", "17:00");
    let zauzeti = document.getElementsByClassName("zauzeta").length;
    assert.equal(zauzeti, 0, "Nema zauzeca");
  });


 
  
});


});



 