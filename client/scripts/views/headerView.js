HeaderView = Backbone.View.extend({

	events: {
		'click #search': 'search'
	},

	initialize: function(){
		console.log(this);

		this.stream = this.options.stream;

		this.query = this.$el.find('#query');
	},

	search: function(){
		this.stream.push({query: this.query.val()});
		this.query.val('');
	}

});