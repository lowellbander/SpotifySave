var ajax = require('ajax');
var UI = require('ui');

UI.Card.prototype.update = function(title, body) {
    this.title(title);
    this.body(body);
};

var log = function (message) { console.log(message); };

var currentTrackInfoFromJson = function (json) {
    var track = json.recenttracks.track[0];
    return {
        name : track.name,
        artist : track.artist['#text'],
        album : track.album['#text']
    };
};

var mainCard = new UI.Card({
    title: "loading ...",
    body: ""
});

var update = function () {
    log('starting update');
    mainCard.update('loading ...', '');
    
    var lastfmURL = 'http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=lowellbander&api_key=410af592466bfb635d96c11f77053117&format=json';

    // Download data
    var data = {url: lastfmURL, type: 'json'};
    ajax(data, function(json) {
        log('update successful');
        var track = currentTrackInfoFromJson(json);
        mainCard.update(track.name, track.artist + ', ' + track.album);
    }, function(error) {
        log('Ajax failed: ' + error);
    });
};

var getSpotifyTrackID = function () {
    var spotifySearchURL = 'https://api.spotify.com/v1/search?type=track&q='

    
};

update();

mainCard.show();

mainCard.on('click', update);
