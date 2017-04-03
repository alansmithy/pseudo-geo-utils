var fs = require('fs');
var d3 = require('d3-dsv');

const input = "input/places.csv";

fs.readFile(input, "utf8", function(error, data) {

	//use d3 to parse the csv objects
	var rows = d3.csvParse(data)

	rows.forEach(function(d){
		/*Haversine forumla
		note this technique does not use geodetic variations, so error could be up to 0.3-0.5%
		*/
		//circumference of earth, metres
		const R = 6371e3;

		//convert degrees to radians
		var lat1Rad = toRadians(d.lat1);
		var lat2Rad = toRadians(d.lat2);
		var diffLatRad = toRadians(d.lat2-d.lat1);
		var diffLonRad = toRadians(d.lon2-d.lon1);

		//great circle distance
		var a = Math.sin(diffLatRad/2) * Math.sin(diffLatRad/2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(diffLonRad/2) * Math.sin(diffLonRad/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var dist = R * c;//distance in metres

		//return km
		d.distKM = dist/1000;
	})

	var csvOutput = d3.csvFormat(rows);
	fs.writeFile("output/distances.csv",csvOutput);

  	//helper function
  	function toRadians (angle) {
  		return angle * (Math.PI / 180);
	}

});


