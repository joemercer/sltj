Stream = Backbone.Model.extend({

	initialize: function(){
		var self = this;
		this.lastFM = API.LastFM;

		// Here are some properties we'll need access to.
		this.songs = new Songs([]);
		// ??? Why can't I pass this in as an option?
		this.songs.stream = self;

		this.nowPlaying = 1;
		this.fixed = 10;

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
		// Session.set('stream', collection.toJSON() );
		Session.set('stream', this.toJSON() );
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

	}

});