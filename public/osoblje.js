window.onload = function(e){ 
    Pozivi.ucitajPodatkeOOsoblju();
}

setInterval(function () {
    Pozivi.ucitajPodatkeOOsoblju();
  }, 30000);