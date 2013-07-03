// SongView = Backbone.View.extend({
// 	initialize: function(){
// 		var self = this;

// 		// Render!
// 		self.render();

// 		// Reactive: re-render when the model changes.
// 		this.model.on('change', function(){
// 			self.render();
// 		});
// 	},

// 	render: function(){
// 		var self = this;

// 		// ??? Not entirely sure why this needs to be wrapped in a Meteor.render
// 		this.$el.html( Meteor.render(function(){
// 			return Template.song( self.model.toJSON() );
// 		}) );
// 		// i.e. this works also: this.$el.html( Template.song( self.model.toJSON() ) );

// 		return this;
// 	}

// });