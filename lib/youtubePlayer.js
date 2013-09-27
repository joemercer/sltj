// youtube player can be loaded or not loaded
// youtube player can be hidden or not hidden
// stream can have a 'next' entry or not have a 'next' entry




// start

//ok, this is stupid
// I will load the player when it needs to be used, not before
// when it loads I will play
// basically let's just copy the actual YoutubePlayer api
// and put a wrapper around it.
// like a literal 1 to 1 wrapper.

// then we'll give our stream a play
// and a pause
// and Q._initPlayer


// YoutubePlayer.load('id', pauseOnLoad);
// YoutubePlayer.play()
// YoutubePlayer.pause()



YoutubePlayer = {

  // Define the following (if you want):
  // .onReady()
  // .onStateChange()
  // .onStateEnded()

  load: function(youtubeId){
    if (!this.reference){
      console.log('ERROR: No reference to YoutubePlayer');
      return;
    }
    if (!youtubeId){
      return;
    }
    this.reference.loadVideoById(youtubeId);
    this.play();
  },
  play: function(){
    if (!this.reference){
      console.log('ERROR: No reference to YoutubePlayer');
      return;
    }
    this.reference.playVideo();
  },
  pause: function(){
    if (!this.reference){
      console.log('ERROR: No reference to YoutubePlayer');
      return;
    }
    this.reference.pauseVideo();
  },

  
  // Let's create a YoutubePlayer.
  // We'll store it in the player reference.
  create: function(idOfDivToReplace){

    console.log('youtubePlayer create');

    // This is called when the YoutubePlayer has loaded.
    // If a playerapi parameter is included in the creation
    // of the YoutubePlayer then it will be included as a
    // parameter of this function.
    // This function has to be defined at the global scope
    // (not really sure why).
    window.onYouTubePlayerReady = function(playerId){
      console.trace();

      // Ensure that this is the player we wanted to create.
      if (playerId == 'player'){

        // Give the player a reference to keep track of it.
        var player = document.getElementById('player');

        // // How about some reactive awesomeness.
        // // !!! This needs to come earlier to prevent jumpiness.
        // $('#youtubeContainer').addClass('youtubeContainer-active');

        // Assign some events to the player.
        // onStateChange will be called when the state of the
        // player changes.
        player.addEventListener('onStateChange', 'YouTubeEventHandlers.onStateChange');

        // Let's save a reference to the player.
        YoutubePlayer.reference = player;

        // Call the onReadyCallback and pass in the player reference
        // as a parameter.
        if (YoutubePlayer.onReady){
          YoutubePlayer.onReady(YoutubePlayer.reference);
        }

      }
    };

    // Define the event handlers for our YoutubePlayer.
    // Yes, they do need to be defined at this scope.
    window.YouTubeEventHandlers = {
      onStateChange: function(e){
        console.log('state change', e);

        // -1 => unstarted
        // 0 => ended
        // 1 => playing
        // 2=> paused
        // 3 => buffering
        // 5 => video cued
        var plainStatus;
        if (e === -1){
          plainStatus = 'unstarted';
        }
        else if (e === 0){
          plainStatus = 'ended';
        }
        else if (e === 1){
          plainStatus = 'playing';
        }
        else if (e === 2){
          plainStatus = 'paused';
        }
        else if (e === 3){
          plainStatus = 'buffering';
        }
        else if (e === 5){
          plainStatus = 'cued';
        }

        YoutubePlayer.currentState = plainStatus;

        if (YoutubePlayer.onStateChange){
          YoutubePlayer.onStateChange(plainStatus);
        }

        // Ended
        if (e === 0){
          if (YoutubePlayer.onStateEnded){
            YoutubePlayer.onStateEnded(YoutubePlayer.reference);
          }
        }

      }
    };

    // Now let's actually make the YoutubePlayer.
    // This script gives us an object to do that.
    $.getScript('http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js', function(script){
      console.log('swfobject1', swfobject);

      // Now for real let's make the YoutubePlayer.
      // Check out the url to see the arguments.
      // Note that 1 and 1 for width and height
      // are overriden by our reactive awesomeness.
      // The allowScriptAccess stops some annoying
      // console errors.
      // The id is used above in the callback when the
      // player is created.
      // We also want to enable the JavaScript API.
      // Obviously.
      var params = { allowScriptAccess: "always" };
      var atts = { id: "player" };
      swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=player&version=3",
                         idOfDivToReplace, "50", "50", "8", null, null, params, atts);

      // <param name="allowFullScreen" value="true">

    });

  }

};