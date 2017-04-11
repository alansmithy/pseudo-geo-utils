var fs = require('fs');
var d3 = require('d3-dsv');
var parseString = require('xml2js').parseString;

const input = "input/NED.kml";

//read in input kml
fs.readFile( input, function(err, data) {

	//parse into js
    parseString(data, function (err, result) {


    	//name of file
    	var name = result.kml.Document[0].name[0];

    	//locate the Placemarks
    	var markers = result.kml.Document[0].Folder[0].Placemark

    	var output = [];

    	//for each marker, extract geo information
    	markers.forEach(function(d){

    		var record = {};

    		var locality = d.name[0];
    		var coords = d.Point[0].coordinates[0].split(",");

			record.name=locality;//name

			record.lat=coords[1];//longitude

			//need a regular expression to filter out the latitude
			var matched = coords[0].match(/(-*[0-9]+.{1}[0-9]+)/)[0]
			record.long=matched
			output.push(record)

    	})

    	//convert the output to csv
    	var csvOutput = d3.csvFormat(output);

    	//write th file
		fs.writeFile("output/"+name+".csv",csvOutput);

    })
 });

	

	





