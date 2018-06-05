require("dotenv").config();
var request = require("request");
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);
// console.log(client);
// console.log(spotify);
function omdbReq(){
    var movieTitleArr = [];
    for(var i = 3; i<process.argv.length; i++){
        if(process.argv[i]){
            movieTitleArr.push(process.argv[i].trim());
        }
    }
    var movieName = movieTitleArr.join("+");
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl,function(error,response,body){
        if(!error && response.statusCode === 200){
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year Released: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country Produced: " + JSON.parse(body).Country);
            console.log("Language of Movie: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    })
}

function twitterReq(){
    var params = {screen_name: 'nix1228_91'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    //   console.log(tweets[1]);
    if(tweets.length<20){
        for(var i = 0; i<tweets.length; i++){
            console.log("============================================================================");
            console.log("Tweet: " + tweets[i].text);
            //format time???
            console.log("Created at: " + tweets[i].created_at);
        }
    }else{
        for(var i = 0; i<20;i++){
            console.log(tweets[i].text);
            console.log(tweets[i].created_at);
        }
    }
  }
});
}

switch(process.argv[2]){
    case "movie-this":
    omdbReq();
    break;
    case "my-tweets":
    twitterReq();
    break;
    case "spotify-this-song":
    break;
    case "do-what-it-says":
    break;
    default:
    console.log("Please enter one of the commands below: ");
    console.log("  my tweets \n ", "spotify-this-song <song name here> \n ", "movie-this <movie name here> \n ", "do-what-it-says ");
}