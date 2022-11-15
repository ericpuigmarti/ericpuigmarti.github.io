
/*-----------------------------------------------------------------------------------*/
/*	09. SPOTIFY - NOW PLAYING
/*-----------------------------------------------------------------------------------*/

var ListenWithMe = (function() {
        
  // Add your own config here
  var LASTFM_API_KEY = "f2de03f1d47d1604f59e38cf4fe32695";
  var LASTFM_USERNAME = "ericpuigmarti";
  var USER_NAME = "Eric"

  // Elements
  var $playerWrapper = document.getElementById('spotify-player-wrapper');
  var $trackIntro = document.getElementsByClassName('track-info--intro')[0]
  var $trackTitle = document.getElementsByClassName('track-info--title')[0]
  var $trackArtist = document.getElementsByClassName('track-info--artist')[0]

  var currentSong = {};
  var REFRESH_INTERVAL = 10000;
  var refreshTimer = null;

  return {
    init: init
  }

  function init() {
    getCurrentTrack().then(function(data) {
      console.log(data)
      try {
              currentSong.nowPlaying = data['@attr'].nowplaying;        
      } catch(err) {
        console.log(err);
      }

      currentSong.artist = data.artist['#text'];
      currentSong.track = data.name;
      updateTitle();
      updateInfo();

      return getTrackURI();
    }).then(function(data) {
      console.log(data)
      $playerWrapper.innerHTML = buildSpotifyPlayer(data.uri);
    })

    if(!refreshTimer) {
      refreshTimer = setInterval(refresh, REFRESH_INTERVAL)
    }
  }

  function refresh() {
    console.log("ping");
    getCurrentTrack().then(function(data) {
      if(currentSong.track !== data.name && currentSong.track !== data.artist['#text']) {
        // kinda lazy
        init();
      }
    })
  }

  // Make a call to Last FM to get your latest played tracks;
  function getCurrentTrack() { 
    var url = "//ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=" + LASTFM_USERNAME + "&api_key=" + LASTFM_API_KEY + "&format=json";

    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = function() {
        if (req.status == 200) {
          var data = JSON.parse(req.response);
          try {
            resolve(data.recenttracks.track[0]);
          } catch(err) {
            reject(err);
          }
        }
        else {
          reject(Error(req.statusText));
        }
      };
      req.onerror = function() {
        reject(Error("Network Error"));
      };
      req.send();
    })
  }

  // Make a call to Spotify to search for the track and return the info
  function getTrackURI() {
    var url = "//api.spotify.com/v1/search?q=track:" + encodeURIComponent(currentSong.track) + "%20artist:" + encodeURIComponent(currentSong.artist) + "&type=track"

    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = function() {
        if (req.status == 200) {
          var data = JSON.parse(req.responseText);
          try {
            resolve(data.tracks.items[0]);
          } catch(err) {
            reject(err);
          }
        }
        else {
          reject(Error(req.statusText));
        }
      };
      req.onerror = function() {
        reject(Error("Network Error"));
      };
      req.send();
    })
  }

  // Returns an iframe with the track's URI
  function buildSpotifyPlayer(trackUri) {
    if(!trackUri) return;
    return '<iframe src="https://embed.spotify.com/?uri=' + trackUri + '" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>';
  }

  function updateTitle() {
    document.title = currentSong.track + " -- " + currentSong.artist;
  }

  function updateInfo() {
    var introMsg = USER_NAME + " last listened to...";
    if(currentSong.nowPlaying) {
      introMsg = USER_NAME + " is currently listening to...";
    }
    $trackIntro.innerHTML = introMsg;
    $trackTitle.innerHTML = currentSong.track;
    $trackArtist.innerHTML = currentSong.artist;
  }

})();

ListenWithMe.init();
