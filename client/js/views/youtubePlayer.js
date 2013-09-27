// YoutubeView = Backbone.View.extend({
// 	initialize: function(){
// 		var self = this;

// 		window.onYouTubePlayerReady = function(playerId){
// 			if (playerId == 'player'){
// 				self.player = document.getElementById('player');
// 				console.log('self.player', self.player);

// 				self.player.addEventListener('onStateChange', 'YouTube.onStateChange');


// 				player.loadVideoById('BH0KyPYi7EI');
// 				// player.loadVideoById('5eDQdYIqhbE');
// 				// player.pauseVideo();
// 			}
// 		};

// 		window.YouTube = {
// 			onStateChange: function(e){
// 				console.log('state change', e);

// 				// Stopped
// 				if (e === -1){

// 				}
// 				// Paused
// 				else if (e === 2){

// 				}



// 			}
// 		};

// 		// !!! Probably should load this script at a higher level so that multuple youtube videos can be created without reloading the script.
// 		$.getScript('http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js', function(script){
// 			console.log('swfobject1', swfobject);

// 			// 425 and 356 are overriden.
// 			var params = { allowScriptAccess: "always" };
// 	    var atts = { id: "player" };
// 	    swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=player&version=3",
// 	                       "youtubePlayer", "425", "356", "8", null, null, params, atts);

// 		});


// 	},

// 	load: function(videoId){
// 		player.loadVideoById(videoId);
// 	},

// 	play: function(){
// 		player.playVideo();
// 	},

// 	pause: function(){
// 		player.pauseVideo();
// 	},

// 	next: function(){

// 	}


// });