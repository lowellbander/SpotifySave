var ajax = require('ajax');
var UI = require('ui');


var lastfmURL = 'http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=lowellbander&api_key=410af592466bfb635d96c11f77053117&format=json';

UI.Card.prototype.update = function(title, body) {
    this.title(title);
    this.body(body);
};

var splashCard = new UI.Card({
    title: "Please Wait",
    body: "Downloading..."
});

var resultsCard = new UI.Card({
    title: 'loading',
    body: 'loading'
});

var update = function () {
    console.log('starting update');
  resultsCard.update('loading', 'loading');
    
    // Download data
    var data = {url: lastfmURL, type: 'json'};
    ajax(data, function(json) {
        console.log('update successful');

        var lastfmTrack = json.recenttracks.track[0];
        var trackName = lastfmTrack.name;
        var trackArtist = lastfmTrack.artist['#text'];
        var trackAlbum = lastfmTrack.album['#text'];


        resultsCard.update(trackName, trackArtist + ', ' + trackAlbum);
        //resultsCard.title(trackName);
        //resultsCard.body(trackArtist + ', ' + trackAlbum);

        // Show results, remove splash card
        resultsCard.show();
        splashCard.hide();
    }, function(error) {
        console.log('Ajax failed: ' + error);
    });
};

splashCard.on('click', update);

resultsCard.on('click', update);


splashCard.show();

update();
