var express 	= require('express');
var fs 			= require('fs');
var request 	= require('request');
var cheerio 	= require('cheerio');
var app 		= express();

app.get('/scrape', function(req, res){
	// The URL we will scrape from - in our example Anchorman 2.
	url = 'http://www.imdb.com/title/tt1229340/';

	// The structure of our request call
	// The first parameter is our URL
	// The callback function takes 3 parameters, an error, response status code, and the html
	request(url, function(error, response, html){
		// Check to make sure no errors occurred when making the request
		if(!error){
			// Utilize the cheerio library on the returned html which will essentially give us jQuery functionality
			var $ = cheerio.load(html);

			// Define the variables we're going to capture
			var title, release, rating;
			var json = { title: "", release: "", rating: "" };

			// Use the unique 'header' class for title and release
			$('.header').filter(function(){
				// Store data that's filtered into variable
				var data = $(this);

				// Title is stored within the first child element of the header tag
				title = data.children().first().text();

				// Release year is stored within the last child element of the header tag
				release = data.children().last().text();

				// Store in json object
				json.title = title;
				json.release = release;
			});

			// Use unique 'star-box-giga-star' class for rating
			$('.star-box-giga-star').filter(function(){
				var data = $(this);
				rating = data.text();
				json.rating = rating;
			});
		}

		// Use 'fs' library to write to the system
		// Pass 3 parameters into writeFile function
		// output.json - created filename name
		// JSON.stringify(json, null, 4) - data to write, in a neat format with stringify
		// callback function - check status of function
		fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
			console.log('File successfully written! - Check your project folder directory for the output.json file');
		});

		// Send message to browser that this application doesn't have a UI
		res.send('Check your console!');
	});
});

app.listen('8081');
console.log("Scraping on port 8081");
exports = module.exports = app;