var ajax = require('ajax');
var UI = require('ui');

var lastfmURL = 'http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=lowellbander&api_key=410af592466bfb635d96c11f77053117&format=json';

UI.Card.prototype.update = function(title, body) {
    this.title(title);
    this.body(body);
};

var log = function (message) { console.log(message); };

var mainCard = new UI.Card({
    title: "loading ...",
    body: ""
});

var update = function () {
    log('starting update');
    mainCard.update('loading ...', '');
    
    // Download data
    var data = {url: lastfmURL, type: 'json'};
    ajax(data, function(json) {
        log('update successful');

        var lastfmTrack = json.recenttracks.track[0];
        var trackName = lastfmTrack.name;
        var trackArtist = lastfmTrack.artist['#text'];
        var trackAlbum = lastfmTrack.album['#text'];

        mainCard.update(trackName, trackArtist + ', ' + trackAlbum);

    }, function(error) {
        log('Ajax failed: ' + error);
    });
};

update();

mainCard.show();

mainCard.on('click', update);
