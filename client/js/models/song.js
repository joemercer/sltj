// Each time stream.nowPlaying, or stream.fixed changes we need to check each song to see if it changes.
// If it does change, then we change the properties and that will cause a rerender (I think unfortunately of everything).

// song.state = {variable, fixed, playing}. 

// create the SongView here (?)
// song view knows how to listen for clicks on songs
// then knows how to respond by notifying this model correctly


Song = Backbone.Model.extend({

	initialize: function(){
		var self = this;

		console.log('init song', self);

		var name = self.get('name');
		var artist = self.get('artist');

		$.getJSON( self.collection.youTube.search(name, artist), function(data) {
			self.set({
				youtubeId: data.feed.entry[0].media$group.yt$videoid.$t
			});

		});

	}

});