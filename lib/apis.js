API = {
	LastFM: {
	  track: {
	    search: function(token){
	      var query ='';
			  var base = 'http://ws.audioscrobbler.com/2.0/?method=track.search';
			  var apiKey = '7a1e356a7279fca06252bc4e5cebccb2';

			  query = query + base;
			  query = query + '&track=';
			  query = query + token;
			  query = query + '&api_key=';
			  query = query + apiKey;
			  query = query + '&format=json';

			  return query;
	    },
	    getSimilar: function(name, artist, limit){
	      var query ='';
			  var base = 'http://ws.audioscrobbler.com/2.0/?method=track.getsimilar';
			  var apiKey = '7a1e356a7279fca06252bc4e5cebccb2';

			  query = query + base;
			  query = query + '&artist=';
			  query = query + artist;
			  query = query + '&track=';
			  query = query + name;
			  query = query + '&limit=';
			  query = query + limit;
			  query = query + '&api_key=';
			  query = query + apiKey;
			  query = query + '&format=json';

			  return query;
	    }
	  }
	},
	YouTube: {
		search: function(title, artist){
			var query ='';
		  var base = 'https://gdata.youtube.com/feeds/api/videos?q=';

		  query = query + base;
		  query = query + title + ' ';
		  query = query + artist;
		  query = query + '&max-results=2';
		  query = query + '&v=2&alt=json';
		  //query = query + '&v=2&alt=json-in-script&callback=JSON_CALLBACK';

		  return query;
		}
	}
}