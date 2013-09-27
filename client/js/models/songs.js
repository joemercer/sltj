Songs = Backbone.Collection.extend({
	model: Song,

	initialize: function(){
	},

	push: function(song, options){
		var self = this;

		var fixed = this.length < this.stream.fixed;
		if (fixed){
			song.fixed = 'fixed';
		}
		else {
			song.fixed = 'variable';
		}

		var nowPlaying = this.length === this.stream.nowPlaying;
		if (nowPlaying){
			song.nowPlaying = 'nowPlaying';
		}

		// $.getJSON( this.youTube.search(song.name, song.artist), function(data) {
		// 	song.youtubeId = data.feed.entry[0].media$group.yt$videoid.$t;

		// 	self.stream.render();

		// 	// Backbone.Collection.prototype.push.apply(this, arguments);
		// });


		Backbone.Collection.prototype.push.apply(this, arguments);
	}

});