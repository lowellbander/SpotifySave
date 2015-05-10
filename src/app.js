var ajax = require('ajax');
var UI = require('ui');
var Settings = require('settings');

UI.Card.prototype.update = function(title, body) {
    this.title(title);
    this.body(body);
};

var log = function (message) { console.log(message); };

var authURL = 'http://ssauth.herokuapp.com';
var access_token;
var user_id;
var current_track_id;

Pebble.addEventListener("showConfiguration", function() {
    log('opening configuration');
    Pebble.openURL(authURL);
});

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

var statusCard = new UI.Card({
    title: "Success"
});

mainCard.show();

var getSpotifyTrackID = function (track) {
    var url = 'https://api.spotify.com/v1/search?type=track&q=';
    url += encodeURIComponent(track.name + ' ' + track.artist + ' ' + track.album);
    log(url);
    ajax({url: url, type: 'json'}, function (response) {
        log(JSON.stringify(response));
        current_track_id = response.tracks.items[0].id;
    });
};

var getSpotifyUserID = function (token/*, callback*/) {
    ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: { Authorization: 'Bearer ' + token}
         }, function (response) {
             //log('id response: ' + response);
             user_id = JSON.parse(response).id;
             log('got user_id: ' + user_id);
             //callback();
         });
};

var update = function () {
    
    if (typeof access_token == 'undefined') {
        mainCard.update('Please login', 'Open \'Settings\' for this app in Pebble.');
        return;
    } 
    
    log('starting update');
    mainCard.update('loading ...', '');
    mainCard.body('sending lastfm request');
    var url = 'http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=lowellbander&api_key=410af592466bfb635d96c11f77053117&format=json';

    // Download data
    var data = {url: url, type: 'json'};
    ajax(data, function(json) {
        //log('update successful');
        //mainCard.body('received data from lastm');
        var track = currentTrackInfoFromJson(json);
        mainCard.update(track.name, track.artist + ', ' + track.album);
        
        //var trackID = getSpotifyTrackID(track);
        getSpotifyTrackID(track);
        getSpotifyUserID(access_token);
        
    }, function(error) {
        log('Ajax failed: ' + error);
    });
};

// Set a configurable with just the close callback
Settings.config( { url: authURL },
    function(e) {
        
        access_token = e.options.access_token;
        //log('access_token: ' + access_token);
        update();
        // Show the raw response if parsing failed
        if (e.failed) {
            log('response parsing failed');
            console.log(e.response);
        }
    }
);

var saveCurrentTrack = function () {
    //1228596540 is id for DEV playlist
    log('attempting to save current track to playlist');
    if (typeof user_id != 'undefined') {
        
        var url = 'https://api.spotify.com/v1/users/' + user_id + '/playlists/59Pu3MtlBC6FzbDJ9ZhaXL/tracks?uris=spotify:track:' + current_track_id;
        log(url);
        ajax({
            url: url,
            headers: { Authorization: 'Bearer ' + access_token},
            method: 'post'
            }, function (response) {
                log(response);
                if ('snapshot_id' in JSON.parse(response)) {
                    statusCard.title('Saved!');
                }
                else {
                    statusCard.title('Failed to save the current track.');
                }
                statusCard.show();
                // wait then hide
            }, function (response) {
                log('failed to save');
                log(response);
            }
        );
    } else log('no current user_id');
};

update();

mainCard.on('click', 'up', update);
mainCard.on('click', 'down', update);
mainCard.on('click', 'select', saveCurrentTrack);

//statusCard.on('click', 'back', mainCard.show);
//mainCard.on('click', getSpotifyUserID);
