// 1. clean up commented out code
// 2. streamView should call render() on stream
//    -> needs to call render() when stream properties change
//    -> when songs is added to
//    -> when a songs model changes.
// 3. headerModel needs to exist with a reference to the stream model
// 4. stream "state" is a good idea but should be directly based on the youtubePlayer
// 5. creation of youtubePlayer should be modularized
// 6. need a better method instead of setting song.fixed and variable in each .push().




// ////////// Helpers for in-place editing //////////

// // Returns an event map that handles the "escape" and "return" keys and
// // "blur" events on a text input (given by selector) and interprets them
// // as "ok" or "cancel".
// var okCancelEvents = function (selector, callbacks) {
//   var ok = callbacks.ok || function () {};
//   var cancel = callbacks.cancel || function () {};

//   var events = {};
//   events['keyup '+selector+', keydown '+selector] =
//     function (evt) {
//       if (evt.type === "keydown" && evt.which === 27) {
//         // escape = cancel
//         cancel.call(this, evt);

//       } else if (evt.type === "keyup" && evt.which === 13) {
//         // blur/return/enter = ok/submit if non-empty
//         var value = String(evt.target.value || "");
//         if (value)
//           ok.call(this, value, evt);
//         else
//           cancel.call(this, evt);
//       }
//     };

//   return events;
// };



// // Database of songs
// Songs = new Meteor.Collection("songs");

if (Meteor.isClient) {


  // initialize a stream model.
  var stream = new Stream();

  // To be run once the DOM is ready.
  Meteor.startup(function(){

    // Initialize a header view.
    var headerView = new HeaderView({
      el: '#header',
      stream: stream
    });

    // Initialize a stream view.
    var streamView = new StreamView({
      el: '#stream',
      model: stream
    });

    console.log('test');

    var test = Template.song({
      name: 'whose your',
      artist: 'daddy'
    });

  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    console.log("This is a server!! And we wrote this from Meteor.isServer");
  });
}
