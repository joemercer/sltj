HeaderView = Backbone.View.extend({

	events: {
		'click #search': 'search',
		'click #play': 'play',
		'click #pause': 'pause',
		'click #skip': 'skip'
	},

	initialize: function(){
		console.log(this);

		this.stream = this.options.stream;

		this.query = this.$el.find('#query');
		this.query.val("I'm Yours");
	},

	search: function(){
		this.stream.push({query: this.query.val()});
		this.query.val('');
	},

	play: function(){
		var self = this;
		console.log('play clicked');

		this.stream.play();

		// // If we haven't already loaded the player.
		// if (!this.youtubeView){

		// 	$('#youtubeContainer').addClass('youtubeContainer-active');

		// 	// Initialize a youtubeView.
	 //    this.youtubeView = new YoutubeView({
	 //      el: 'youtubePlayer'
	 //      // container: 'youtubePlayer'
	 //    });

		// }
		// else{
		// 	this.youtubeView.pause();
		// }



	},

	pause: function(){
		this.stream.pause();
	},

	skip: function(){
		this.stream.skip();
	}

});