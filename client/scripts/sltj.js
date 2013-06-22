////////// Helpers for in-place editing //////////

// Returns an event map that handles the "escape" and "return" keys and
// "blur" events on a text input (given by selector) and interprets them
// as "ok" or "cancel".
var okCancelEvents = function (selector, callbacks) {
  var ok = callbacks.ok || function () {};
  var cancel = callbacks.cancel || function () {};

  var events = {};
  events['keyup '+selector+', keydown '+selector] =
    function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);

      } else if (evt.type === "keyup" && evt.which === 13) {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };

  return events;
};



// // Database of songs
// Songs = new Meteor.Collection("songs");

if (Meteor.isClient) {



  // ----- Begin Youtube Player Functionality Definition ------
  var container = 'youtubePlayer';

  var player; // is a reference to the youtube player on the screen that gets assigned after onPlayerReady
  var MyYoutubeObject = {
    load: function(container, videoId) {
      if (typeof(YT) === 'undefined' || typeof(YT.Player) === 'undefined') {
        window.onYouTubeIframeAPIReady = function() {
          MyYoutubeObject._create(container, videoId);
        };

        $.getScript('//www.youtube.com/iframe_api');
      } else {
        MyYoutubeObject._create(container, videoId);
      }
    },

    _create: function(container, videoId) {
      new YT.Player(container, {
        videoId: videoId,
        //width: 356,
        //height: 200,
        events: {
          'onReady': MyYoutubeObject.onPlayerReady,
          'onStateChange': MyYoutubeObject.onPlayerStateChange
        },
        playerVars: {
          //autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showInfo: 0,
          showSearch: 0,
          egm: 0,
          border: 0
        }
      });
    },

    onPlayerReady: function(e) {
      player = e.target;
      player.playVideo();
    },
    onPlayerStateChange: function(e) {
      console.log('onPlayerStateChange', e);

      // Player in state 'stopped'
      if (e.data === 0) {
        _next();
      }
    }

  };

  // ------End Youtube Functionality Definition-------

  var _next = function() {
    console.log('next');
  }



  // Initialize some starting data.

  // This will store the results of a search.
  Session.set('results', [{name: "I'm Yours", artist: "Jason Mraz"}]);

  // This will store the stream.
  Session.set('stream', [{name: "I'm Yours", artist: "Jason Mraz"}]);

  // Attach events to keydown, keyup, and blur on "New list" input box.
  Template.header.events(okCancelEvents('#search',
    {
      ok: function (text, e) {

        // Search based on text
        $.getJSON( composeLastFMTrackSearch(text), function(data) {
          
          console.log('search', data.results.trackmatches.track);

          // !!! JACK This is the variable that has data for the autocomplete.
          // Access it using Session.get('results');
          // NOTE: It only updates when the user presses enter (for sanity purposes). We can change that later.
          Session.set('results', data.results.trackmatches.track);

          var seed = data.results.trackmatches.track[0];

          // Create stream.
          $.getJSON( composeLastFMTrackGetSimilar(seed.name, seed.artist, 29), function(data) {
            console.log('stream', data.similartracks.track);

            // First song is seed song.
            var stream = [seed];

            // Next songs from LastFM
            $(data.similartracks.track).each(function(index, elt){

              stream.push({
                name : elt.name,
                artist : elt.artist.name
              });
            });

            $(stream).each(function(index, elt){

              console.log('json url', elt.name, elt.artist, composeYoutubeVideoSearch(elt.name, elt.artist.name));

              $.getJSON( composeYoutubeVideoSearch(elt.name, elt.artist), function(gData) {
                elt.youtubeId = gData.feed.entry[0].media$group.yt$videoid.$t;

                // Re-render the stream after getting each youtubeId (probly not necessary).
                Session.set('stream', stream);
              });
            });

            // Assign a click to the play button.
            $('#play').click( function(e) {
              if (!player) {
                MyYoutubeObject.load(container, stream[0].youtubeId);
                $('.youtubeContainer').addClass('youtubeContainer-active');
              }
              else {
                player.loadVideoById(stream[0].youtubeId);
              }

              var playIndex = 0;
              _next = function() {
                if (!player) {
                  return;
                }
                playIndex++;
                player.loadVideoById(stream[playIndex].youtubeId);
              }

              // Handle some skipping action.
              $('#controls').append('<button id="skip" tabindex="3">Skip</button>');
              $('#skip').click( function(e) {
                _next();
              });

            });

            // Re-render stream.
            Session.set('stream', stream);
          });

        });

        e.target.value = '';
      },
      cancel: function (e) {
        console.log('cancel');
      }
    }));


  Template.songs.songs = function () {
    // return Songs.find( {} );
    return Session.get('stream');
  };

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    console.log("This is a server!! And we wrote this from Meteor.isServer");
  });
}


// Compose API queries

// LastFM
var composeLastFMTrackSearch = function(searchTerm) {
  var query ='';
    var base = 'http://ws.audioscrobbler.com/2.0/?method=track.search';
    var apiKey = '7a1e356a7279fca06252bc4e5cebccb2';

    query = query + base;
    query = query + '&track=';
    query = query + searchTerm;
    query = query + '&api_key=';
    query = query + apiKey;
    query = query + '&format=json';

    return query;
};

var composeLastFMTrackGetSimilar = function(title, artist, limit) {
  var query ='';
    var base = 'http://ws.audioscrobbler.com/2.0/?method=track.getsimilar';
    var apiKey = '7a1e356a7279fca06252bc4e5cebccb2';

    query = query + base;
    query = query + '&artist=';
    query = query + artist;
    query = query + '&track=';
    query = query + title;
    query = query + '&limit=';
    query = query + limit;
    query = query + '&api_key=';
    query = query + apiKey;
    query = query + '&format=json';

    return query;
};

// Youtube
var composeYoutubeVideoSearch = function(title, artist) {
  var query ='';
  var base = 'https://gdata.youtube.com/feeds/api/videos?q=';

  query = query + base;
  query = query + title + ' ';
  query = query + artist;
  query = query + '&max-results=2';
  query = query + '&v=2&alt=json';
  //query = query + '&v=2&alt=json-in-script&callback=JSON_CALLBACK';

  return query;
};
