//2406 Assignment 3
//Student Name: Roy Xia
//Student Number: 101009419
//Date of Completion: 11/12/16
//Citation: Static Server from COMP2406

// load necessary modules
var http = require('http');
var fs = require('fs');
var mime = require('mime-types');
var url = require('url');
var users = {}; //global users
var code=200;
//var gamerequire = require ('gameClient');
var gameBoard = require ('./public_html/makeBoard');

const ROOT = "./public_html";

// create http server
var server = http.createServer(handleRequest); 
server.listen(2406);
console.log('Server listening on port 2406');

function handleRequest(req, res) {
	
	//process the request
	console.log(req.method+" request for: "+req.url);
	
	//variables
	var urlObj = url.parse(req.url,true);
	var filename = ROOT+urlObj.pathname;
    var pathName = urlObj.pathname;
	
	if(pathName === '/memory/intro') //memory intro path
	{
	var newgameBoard = {mygame: gameBoard.makeBoard(4)};
	newgameBoard.level=4; //level 4x4
	users[urlObj.query.username]=newgameBoard; //newgameBoard
	respond (200, JSON.stringify({mygame: newgameBoard.level})); //respond with the level
	
	console.log(newgameBoard.mygame[0]);//testing
	console.log(newgameBoard.mygame[1]);
	console.log(newgameBoard.mygame[2]);
	console.log(newgameBoard.mygame[3]);
	}
	
	else if (pathName === '/memory/card') //memory card path
	{
		var player=users[urlObj.query.username];
		var cardnumber = player.mygame[urlObj.query.row][urlObj.query.col]; //cardnumber of row col
		users[urlObj.query.username]=player;
		respond (200, JSON.stringify(cardnumber)); //return cardnumber
	}
	else {
		//the callback sequence for static serving...
		fs.stat(filename,function(err, stats){
			if(err){   //try and open the file and handle the error, handle the error
				respondErr(err);
			}else{
				if(stats.isDirectory())	filename+="/index.html";
			
				fs.readFile(filename,"utf8",function(err, data){
					if(err)respondErr(err);
					else respond(200,data);
				});
			}
		});			
	}
	//locally defined helper function
	//serves 404 files 
	function serve404(){
		fs.readFile(ROOT+"/404.html","utf8",function(err,data){ //async
			if(err)respond(500,err.message);
			else respond(404,data);
		});
	}
		
	//locally defined helper function
	//responds in error, and outputs to the console
	function respondErr(err){
		console.log("Handling error: ",err);
		if(err.code==="ENOENT"){
			serve404();
		}else{
			respond(500,err.message);
		}
	}
		
	//locally defined helper function
	//sends off the response message
	function respond(code, data){
		// content header
		res.writeHead(code, {'content-type': mime.lookup(filename)|| 'text/html'});
		// write message and signal communication is complete
		res.end(data);
	}	
	
};//end handle request