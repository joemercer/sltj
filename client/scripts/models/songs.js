Songs = Backbone.Collection.extend({
	model: Song,

	initialize: function(){
	},

	push: function(song, options){

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


		Backbone.Collection.prototype.push.apply(this, arguments);
	}

});