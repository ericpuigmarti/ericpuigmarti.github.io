
/*-----------------------------------------------------------------------------------*/
/*	09. SHOPIFY - NOW PLAYING
/*-----------------------------------------------------------------------------------*/

$(document).ready(function() {
  var url = "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=ericpuigmarti&api_key=b88a785049d6bd2a7c92fb9948c72b1b&format=json";
	$.getJSON(url, function(data) {
    var artist = data.recenttracks.track[0].artist["#text"];
    var song = data.recenttracks.track[0]["name"];
    var cover = data.recenttracks.track[0].image[3]["#text"];
    
    $('.track').html("\
      <h3>"+song+"</h3><br />by\
      "+artist+"\
    ");
	 //alert(data.recenttracks.track[1].artist["#text"]);
  });
});

