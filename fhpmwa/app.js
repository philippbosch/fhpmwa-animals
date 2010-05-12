$.jQTouch();

$(document).ready(function() {
    // Geoposition vom Browser abfragen (wird unterstützt von Mobile Safari, Firefox 3.6, Google Chrome beta)
    navigator.geolocation.getCurrentPosition(function(position) {
        // Diese Funktion wird aufgerufen, sobald der Browser die Geoposition ermittelt hat (kann ein paar Sekunden dauern). Als Parameter wird ein Objekt mit Längen- und Breitengrad übergeben.
        // Die twitter-API mittels der Geopositionsdaten nach Tweets im Umkreis von 2km um die aktuelle Position befragen.
        $.getJSON('http://search.twitter.com/search.json?geocode=' + position.coords.latitude + ',' + position.coords.longitude + ',2km&callback=?', function(data) {
            // Sobald die Daten von twitter abgerufen wurden, wird das Resultat Tweet für Tweet durchgegangen.
            $.each(data.results, function() {
                // Für jeden tweet wird an unser ul mit der ID "tweets" ein <li>-Element mit dem Text und Autor angehängt.
                $('#tweets').append('<li>' + this.text + '<div class="from">' + this.from_user + '</div></li>');
            });
        });
    });
});
