HeaderView = Backbone.View.extend({

	events: {
		'click #search': 'search',
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

	skip: function(){

	}

});