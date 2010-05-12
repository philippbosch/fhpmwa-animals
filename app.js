var jQT = $.jQTouch();

var dbShortName = 'Animals';
var dbVersion = '1.0';
var dbDisplayName = 'Animals';
var dbMaxSize = 65536;
var db = openDatabase(dbShortName, dbVersion, dbDisplayName, dbMaxSize);
db.transaction(function(transaction) {
    transaction.executeSql(
        'CREATE TABLE IF NOT EXISTS sighting (' +
        '    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
        '    animal VARCHAR(100) NOT NULL,' +
        '    color VARCHAR(20),' +
        '    datetime DATETIME NOT NULL,' +
        '    latitude DECIMAL(12,7) NOT NULL,' +
        '    longitude DECIMAL(12,7) NOT NULL' +
        ');'
    );
});

$(document).ready(function() {
    $('#button-add').click(function() {
        jQT.goTo('#add', 'flip');
    });
    
    $('#add').bind('pageAnimationStart', function(event, info) {
        if (info.direction == 'in') {
            navigator.geolocation.getCurrentPosition(function(position) {
                $('#latitude').val(position.coords.latitude);
                $('#longitude').val(position.coords.longitude);
            });
        }
    });
    
    $('#add-submit').click(function(event) {
        event.preventDefault();
        if ($('#animal').val()) {
            db.transaction(function(transaction) {
                transaction.executeSql(
                    'INSERT INTO sighting ' +
                    '   (animal, color, datetime, latitude, longitude) ' +
                    'VALUES ' +
                    '   (?,?,DATETIME("now"),?,?)'
                , [$('#animal').val(), $('#color').val(), $('#latitude').val(), $('#longitude').val()], function(transaction, result) {
                    updateSightings();
                    jQT.goBack();
                }, function(transaction, error) {
                    alert('Oops. Error was "' + error.message + '" (Code: ' + error.code + ')');
                    return true;
                });
            });
        }
    });
    
    updateSightings();
});

function updateSightings() {
    $('#sightings li').remove();
    $('#sightings').append('<li>Loading sightings …</li>');
    db.transaction(function(transaction) {
        transaction.executeSql('SELECT * FROM sighting ORDER BY datetime DESC;', null, function(transaction, result) {
            $('#sightings li').remove();
            if (result.rows.length > 0) {
                for (var i=0; i<result.rows.length; i++) {
                    var row = result.rows.item(i);
                    $('#sightings').append('<li class="arrow"><a href="http://maps.google.com/maps?q=' + encodeURI(row.animal) + '%40' + row.latitude + ',' + row.longitude + '">' + row.animal + ' (' + row.color + ')<div class="datetime">' + row.datetime + '</div></a></li>');
                }
            } else {
                $('#sightings').append('<li>No sightings yet.</li>');
            }
        });
    });
    
}