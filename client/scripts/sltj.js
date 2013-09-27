// 1. clean up commented out code
// 2. streamView should call render() on stream
//    -> needs to call render() when stream properties change
//    -> when songs is added to
//    -> when a songs model changes.
// 3. headerModel needs to exist with a reference to the stream model
// 4. stream "state" is a good idea but should be directly based on the youtubePlayer
// 5. creation of youtubePlayer should be modularized
// 6. need a better method instead of setting song.fixed and variable in each .push().

// if (Meteor.isClient) {

//   // initialize a stream model.
//   var stream = new Stream();

//   // To be run once the DOM is ready.
//   Meteor.startup(function(){

//     // Initialize a header view.
//     var headerView = new HeaderView({
//       el: '#header',
//       stream: stream
//     });

//     // Initialize a stream view.
//     var streamView = new StreamView({
//       el: '#stream',
//       model: stream
//     });

//     console.log('test');

//     var test = Template.song({
//       name: 'whose your',
//       artist: 'daddy'
//     });

//   });

// }











// What session variables do I need?
Session.set('playIndex', 1);
Session.set('playerVisible', false);

// Stream

// Define Minimongo collections.
Q = new Meteor.Collection(null);

Q.initPlayer = function(){
  YoutubePlayer.onReady = function(playerReference){
    console.log('onreadycallback called');
    // $('#youtubeContainer').addClass('youtubeContainer-active');
    Q.load();

    // If we wanted a local reference to the YoutubePlayer
    // then this is how we'd get it.
    //_(player).extend(playerReference);

    Q.player = YoutubePlayer;
  };
  YoutubePlayer.onStateChange = function(status){
    Session.set('playerStatus', status);
  };

  YoutubePlayer.onStateEnded = function(playerReference){
    Q.load();
  };
  YoutubePlayer.create('youtubePlayer');
}

Q.load = function(){
  if (!this.player){
    $('#youtubeContainer').addClass('youtubeContainer-active');
    this.initPlayer();
    return;
  }
  var playIndex = Session.get('playIndex');
  var track = Q.findOne({index: playIndex});
  if (track){
    this.player.play(track.youtubeId)
    console.log('increment play index');
    Session.set('playIndex', playIndex + 1)
  }
};
Q.play = function(){
  if (!this.player){
    return;
  }
  this.player.play();
};
Q.pause = function(){
  if (!this.player){
    return;
  }
  this.player.pause();
};


// perhaps have a different 'history' collection
// and as things are played in the stream 
// they move from the stream to the history

Template.stream.songs = function () {
  return Q.find({}, {sort: {index: 1}});
};

Template.song.events({
  'click': function(e, track){
    console.log('song clicked');

    Q.find({}, {sort: {index: 1}, limit: track.data.index}).forEach(function(track){
      Q.update(track, {
        name: track.name,
        artist: track.artist,
        youtubeId: track.youtubeId,
        index: track.index,
        state: 'fixed'
      });
      //track.state = 'fixed';
    });
    Q.find({}, {sort: {index: 1}, skip: track.data.index}).forEach(function(track){
      Q.update(track, {
        name: track.name,
        artist: track.artist,
        youtubeId: track.youtubeId,
        index: track.index,
        state: 'variable'
      });
    });
  }
})

console.log('sltj.js');

// ??? Should this be a session variable?
var index = 0;
Q.queue = function(track){
  track.index = index;
  index = index + 1;

  $.getJSON( API.YouTube.search(track.name, track.artist), function(searchResults) {
    track.youtubeId = searchResults.feed.entry[0].media$group.yt$videoid.$t;

    Q.insert(track);
  });
}

Q.add = function(searchTerm){

  // Query LastFM to match the search term.
  var searchQuery = API.LastFM.track.search(searchTerm);
  $.getJSON(searchQuery, function(searchResults){
    if (!searchResults.results.trackmatches.track){
      return;
    }
    var match = searchResults.results.trackmatches.track[0];

    // Use match as a seed for more songs.
    var similarQuery = API.LastFM.track.getSimilar(match.name, match.artist, 24);
    $.getJSON(similarQuery, function(similarResults){

      Q.queue({
        name: match.name,
        artist: match.artist,
        state: 'fixed'
      });

      var similar = similarResults.similartracks.track;
      $.each(similar, function(index, track){
        Q.queue({
          name: track.name,
          artist: track.artist.name,
          state: 'variable'
        });
      });

    });

  });

}



// Header

Template.header.events({
  'click #search': function (e) {
    index = index - Q.find({state: 'variable'}).count();
    Q.remove({state: 'variable'});
    Q.add( $('#query').val() );
    $('#query').val('');

  },
  'click #play': function (e) {
    console.log('play clicked');
    var playerStatus = Session.get('playerStatus');
    if (playerStatus === 'playing'){
      Q.pause();
    }
    else if(playerStatus === 'paused'){
      Q.play();
    }
    else{
      Q.load();
    }
  },
  'click #pause': function (e) {
    console.log('pause clicked');
    Q.pause();
  },
  'click #skip': function (e) {
    console.log('skip clicked');
    Q.load();
  }
});

Meteor.startup(function () {
  $('#query').val("I'm Yours").focus();
});
