var ajax = require('ajax');

// Import the UI elements
var UI = require('ui');

// Show splash
var splashCard = new UI.Card({
  title: "Please Wait",
  body: "Downloading..."
});
splashCard.show();

var lastfmURL = 'http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=lowellbander&api_key=410af592466bfb635d96c11f77053117&format=json';

// Download data
ajax({url: lastfmURL, type: 'json'},
 function(json) {
   console.log('here\'s the response!');
   
   var lastfmTrack = json['recenttracks']['track'][0];
   var trackName = lastfmTrack['name'];
   var trackArtist = lastfmTrack['artist']['#text'];
   var trackAlbum = lastfmTrack['album']['#text'];
   //console.log(lastfmTrack);

  // Use data to show a weather forecast Card
  var resultsCard = new UI.Card({
    title: trackName,
    body: trackArtist + ', ' + trackAlbum
  });

  // Show results, remove splash card
  resultsCard.show();
  splashCard.hide();
  },
  function(error) {
    console.log('Ajax failed: ' + error);
  }
);

