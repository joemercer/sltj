Stream = Backbone.Collection.extend({
	model: Song,

	initialize: function(){
		var self = this;
		this.lastFM = API.LastFM;

		// ??? Not sure why this has to be here.
		// It seems like it can't go in the Meteor.startup block.
		Template.stream.songs = function () {
	  	return Session.get('stream');
	  };

		this.on('add', this.render);
		this.on('change', this.render);
	},

	render: function(model, collection, options){
		// Session.set('stream', collection.toJSON() );
		Session.set('stream', this.toJSON() );
	},

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

					self.push(match);

					var similar = data2.similartracks.track;
					$.each(similar, function(index, track){
						self.push({
							name: track.name,
							artist: track.artist.name
						});
					});

				});

			});
		}
		else{
			// Call regular push to add songs to stream.
			Backbone.Collection.prototype.push.apply(this, arguments);
		}
	}

});