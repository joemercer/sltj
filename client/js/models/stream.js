Stream = Backbone.Model.extend({

	initialize: function(){
		var self = this;
		this.lastFM = API.LastFM;

		// Here are some properties we'll need access to.
		this.songs = new Songs([]);
		// ??? Why can't I pass this in as an option?
		this.songs.stream = self;
		this.songs.youTube = API.YouTube;

		this.nowPlaying = 0;
		this.fixed = 10;

		// playing, paused, stopped, closed
		this.playStatus = 'closed';

		// ??? Not sure why this has to be here.
		// It seems like it can't go in the Meteor.startup block.
		Template.stream.songs = function () {
	  	return Session.get('stream');
	  };

	  // Here are some events to listen for.
		this.songs.on('add', this.render);
		this.songs.on('change', this.render);
	},

	render: function(model, collection, options){
		var self = this;

		// Session.set('stream', collection.toJSON() );
		console.log('render', self.toJSON());
		Session.set('stream', self.toJSON() );
	},

	// !!! rewrite.
	// This should just be stream.push('searchTerm');
	push: function(model, options){
		var self = this;

		// If push is passed a query property...
		if (model.query){

			// Query LastFM to match the search term.
			var query = self.lastFM.track.search(model.query);
			$.getJSON(query, function(matches){
				if (!matches.results.trackmatches.track){
					return;
				}
				var match = matches.results.trackmatches.track[0];

				// Use match as a seed for more songs.
				var query2 = self.lastFM.track.getSimilar(match.name, match.artist, 24);
				$.getJSON(query2, function(data2){

					self.songs.push({
						name: match.name,
						artist: match.artist
					});

					var similar = data2.similartracks.track;
					$.each(similar, function(index, track){
						self.songs.push({
							name: track.name,
							artist: track.artist.name
						});
					});

				});

			});
		}

	},

	_initYoutube: function(){
		var self = this;

		if (!this.player){
			// Create player
			window.onYouTubePlayerReady = function(playerId){
				if (playerId == 'player'){
					self.player = document.getElementById('player');

					self.player.addEventListener('onStateChange', 'YouTube.onStateChange');

					self.playStatus = 'stopped';

					self.play();

					// // Play first video.
					// console.log('first song');
					// var startId = self.songs.at(self.nowPlaying).get('youtubeId');

					// self.play(startId);

					// // self.play('BH0KyPYi7EI');
				}
			};
			window.YouTube = {
				onStateChange: function(e){
					console.log('state change', e);

					// -1 => unstarted
					// 0 => ended
					// 1 => playing
					// 2=> paused
					// 3 => buffering
					// 5 => video cued

					// Stopped
					if (e === 0){
						self.playStatus = 'stopped';
						self.play();
					}
					// Paused
					else if (e === 2){

					}



				}
			};

			$.getScript('http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js', function(script){
				console.log('swfobject1', swfobject);

				// 425 and 356 are overriden.
				var params = { allowScriptAccess: "always" };
		    var atts = { id: "player" };
		    swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=player&version=3",
		                       "youtubePlayer", "425", "356", "8", null, null, params, atts);

			});

			// How about some reactive awesomeness.
			$('#youtubeContainer').addClass('youtubeContainer-active');

		}

	},

	play: function(){
		console.log('stream play');
		var self = this;

		if (!this.player){
			this._initYoutube();
			return;
		}


		if (self.playStatus == 'stopped'){
			var currentId = self.songs.at(self.nowPlaying).get('youtubeId');
			if (currentId){
				self.player.loadVideoById(currentId);
				self.nowPlaying++;
				self.playStatus = 'playing';
			}

		}
		else if (self.playStatus == 'paused'){
			self.player.playVideo();
			self.playStatus = 'playing';
		}
		else if (self.playStatus == 'playing'){
			self.player.pauseVideo();
			self.playStatus = 'paused';
		}

	},
	pause: function(){
		console.log('pause');
		this.player.pauseVideo();
		this.playStatus = 'paused';
	},
	skip: function(){
		console.log('skip');
		var self = this;

		if (self.playStatus == 'stopped'){

		}
		else if (self.playStatus == 'paused'){
			var currentId = self.songs.at(self.nowPlaying).get('youtubeId');
			if (currentId){
				self.player.loadVideoById(currentId);
				self.player.pauseVideo();
				self.playStatus = 'paused';
			}
		}
		else if (self.playStatus == 'playing'){
			var currentId = self.songs.at(self.nowPlaying).get('youtubeId');
			if (currentId){
				self.player.loadVideoById(currentId);
				self.playStatus = 'playing';
			}

		}

		self.nowPlaying++;
	}

});