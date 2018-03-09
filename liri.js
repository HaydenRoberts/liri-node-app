require("dotenv").config();
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var keys = require('./keys.js');
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var command = process.argv[2];
var nodeArgs = process.argv;
var movieName = "";
var songName = "";

// Grabbing movie name and song name even when it is multiple words
for(i=3; i<nodeArgs.length; i++) {
    movieName = movieName + "+" + nodeArgs[i];
    songName = songName + " " + nodeArgs[i];
}

// Trim movie and song name after going through for loop
var movieTrim = movieName.trim();
var songTrim = songName.trim();

// Checking which command the user chose
switch(command){
    case "my-tweets":
    client.get('statuses/user_timeline', {count: '20'}, function(error, tweets, data) {
        fs.appendFile("log.txt", "my-tweets", function(err) {
            if (err) {
                return console.log(err);
              }
        });
        for(i=0; i<tweets.length; i++) {
        console.log("Tweet: " + tweets[i].text);
        console.log("Created: " + tweets[i].user.created_at);
        fs.appendFile("log.txt", "\nTweet: " + tweets[i].text + "\nCreated: " + tweets[i].user.created_at + "\n", function(err) {
            if (err) {
              return console.log(err);
            }
          });
        }
        fs.appendFile("log.txt", "-------------------------\n", function(err) {
            if (err) {
                return console.log(err);
              }
        });
    });
    break;

    case "spotify-this-song":
    if (songTrim === "") {
        songTrim = 'The Sign Ace Of Base';
    }
    spotify.search({type: 'track', query: songTrim, limit: '1'}, function(err, data){
        if (err) {
            return console.log('Error occurred: ' + err);
          }
          console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
          console.log("Song Name: " + data.tracks.items[0].name);
          console.log("Preview: " + data.tracks.items[0].preview_url);
          console.log("Album: " + data.tracks.items[0].album.name);
          fs.appendFile("log.txt", "spotify-this-song" + "\nArtist: " + data.tracks.items[0].album.artists[0].name + "\nSong Name: " + data.tracks.items[0].name + "\nPreview: " + data.tracks.items[0].preview_url + "\nAlbum: " + data.tracks.items[0].album.name + "\n" + "-------------------------\n", function(err) {
            if (err) {
              return console.log(err);
            }
          });
    });
    break;

    case "movie-this":
    if (movieTrim === "") {
        movieTrim = 'Mr.+Nobody';
    }
    var rottenTomatoes = 'Not Available';
    var queryUrl = "http://www.omdbapi.com/?apikey=d0f11a69&t=" + movieTrim;
    request(queryUrl, function(error, response, data){
            if (!error && response.statusCode === 200){
                console.log("Title: " + JSON.parse(data).Title);
                console.log("Year: " + JSON.parse(data).Year);
                console.log("IMDB Rating: " + JSON.parse(data).imdbRating);
                if (JSON.parse(data).Ratings[1] !== undefined) {
                    console.log("Rotten Tomatoes: " + JSON.parse(data).Ratings[1].Value);
                    rottenTomatoes = JSON.parse(data).Ratings[1].Value;
                }
                console.log("Country: " + JSON.parse(data).Country);
                console.log("Language: " + JSON.parse(data).Language);
                console.log("Plot: " + JSON.parse(data).Plot);
                console.log("Actors: " + JSON.parse(data).Actors);
                
            }
            fs.appendFile("log.txt", "movie-this" + "\nTitle: " + JSON.parse(data).Title + "\nYear: " + JSON.parse(data).Year + "\nIMDB Rating: " + JSON.parse(data).imdbRating + "Rotten Tomatoes: " + rottenTomatoes + "\nCountry: " + JSON.parse(data).Country + "\nLanguage: " + JSON.parse(data).Language + "\nPlot: " + JSON.parse(data).Plot + "\nActors: " + JSON.parse(data).Actors + "\n" + "-------------------------\n", function(err) {
                if (err) {
                  return console.log(err);
                }
              });
        });
    break;

    case "do-what-it-says":
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
          }
          var dataSplit = data.split(", ");
          var setSong = dataSplit[1];
          spotify.search({type: 'track', query: setSong, limit: '1'}, function(err, data){
            if (err) {
                return console.log('Error occurred: ' + err);
              }
              console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
              console.log("Song Name: " + data.tracks.items[0].name);
              console.log("Preview: " + data.tracks.items[0].preview_url);
              console.log("Album: " + data.tracks.items[0].album.name);
              fs.appendFile("log.txt", "spotify-this-song" + "\nArtist: " + data.tracks.items[0].album.artists[0].name + "\nSong Name: " + data.tracks.items[0].name + "\nPreview: " + data.tracks.items[0].preview_url + "\nAlbum: " + data.tracks.items[0].album.name + "\n" + "-------------------------\n", function(err) {
                if (err) {
                  return console.log(err);
                }
              });
        });
    })
    break;
}

