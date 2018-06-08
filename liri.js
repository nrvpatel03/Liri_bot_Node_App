require("dotenv").config();
var request = require("request");
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require("fs");
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);
//request movie
function omdbReq(movieName){
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
//request tweets
function twitterReq(screen_name){
    var params = {screen_name: screen_name};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    
    if(tweets.length<20){
        for(var i = 0; i<tweets.length; i++){
            console.log("============================================================================");
            console.log("@" + screen_name);
            console.log("Tweet: " + tweets[i].text);
            //format time???
            console.log("Created at: " + tweets[i].created_at);
        }
    }else{
        for(var i = 0; i<20; i++){
            console.log("============================================================================");
            console.log("@" + screen_name);
            console.log("Tweet: " + tweets[i].text);
            console.log("Created at: " + tweets[i].created_at);
        }
    }
  }
});
}
//request song
function spotifyReq(songtitle){
    spotify.search({type: 'track',query: songtitle},function(err,data){
        if(err){
            return console.log(err);
        }
        //loop through items
        for(var i = 0; i<JSON.stringify(data.tracks.items.length,null,2); i++){
            var resultcount = i+1;
            console.log("\n=========================================");
            console.log("\n========= RESULT " + resultcount +" =================");
            console.log("SONG: " + JSON.stringify(data.tracks.items[i].name));
            console.log("ALBUM: " +JSON.stringify(data.tracks.items[i].album.name,null,2));
            for(var a = 0; a<JSON.stringify(data.tracks.items[i].artists.length,null,2); a++){
                console.log("ARTIST: " + JSON.stringify(data.tracks.items[i].artists[a].name,null,2));
            }
            console.log("PREVIEW LINK: " + JSON.stringify(data.tracks.items[i].external_urls.spotify,null,2));
        }
    })
}
//do what it says.
function doWhatItSays(){
    var command;
    var argument;
    var arr = [];
    fs.readFile("random.txt","utf8",function(error,data){
        if(error){
            return console.log(error);
        }
        arr = data.split(",");
        command = arr[0];
        argument = arr[1];
        switch(command){
            case "movie-this":
            if(!argument){
                argument = "Mr. Nobody";
            }
            omdbReq(argument);
            break;
            case "my-tweets":
            if(!argument){
                argument = "realDonaldTrump";
            }
            twitterReq(argument);
            break;
            case "spotify-this-song":
            if(!argument){
                argument = "The Sign";
            }
            spotifyReq(argument);
            break;
            default:
            console.log("Please enter one of the commands below in random-text: ");
            console.log("  my-tweets,<screen name here> \n ", "spotify-this-song,<song name here> \n ", "movie-this,<movie name here> \n ");
        }

    })
}

switch(process.argv[2]){
    //////////////////////////////////////////////////////////
    case "movie-this":
    //if there is no movie, default to Mr. Nobody
    var movieTitleArr = [];
    var movieName;
    if(!process.argv[3]){
        movieName = "Mr. Nobody";
    }else{
        for(var i = 3; i<process.argv.length; i++){
            if(process.argv[i]){
                movieTitleArr.push(process.argv[i].trim());
            }
        }
        movieName = movieTitleArr.join("+");
    }
    omdbReq(movieName);
    break;
    //////////////////////////////////////////////////////////////////////
    case "my-tweets":
    //If no screen name is specified, get DONALD TRUMP TWEETS
    var screen_name;
    if(!process.argv[3]){
        //defaults to donald trump tweets!
        screen_name = 'realDonaldTrump';
    }else{
        screen_name = process.argv[3];
    }
    twitterReq(screen_name);
    break;
    /////////////////////////////////////////////////////////////
    //default to the sign
    case "spotify-this-song":
    var songTitleArr = [];
    var songtitle;
    if(!process.argv[3]){
        songtitle = 'The Sign';
    }else{
        for(var i = 3; i<process.argv.length; i++){
            if(process.argv[i]){
                songTitleArr.push(process.argv[i]);
            }
        }
        songtitle = songTitleArr.join(" ");
    }
    spotifyReq(songtitle);
    break;
    ////////////////////////////////////////////////////////
    case "do-what-it-says":
    doWhatItSays();
    break;
    /////////////////////////////////////////////////////////////
    default:
    console.log("Please enter one of the commands below: ");
    console.log("  my-tweets <screen name here> \n ", "spotify-this-song <song name here> \n ", "movie-this <movie name here> \n ", "do-what-it-says ");
}