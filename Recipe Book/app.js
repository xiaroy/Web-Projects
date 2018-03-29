//2406 Assignment 2
//Student Name: Roy Xia
//Student Number: 101009419
//Date of Completion: 31/10/16
//Citation: StaticServer code from COMP2406 Tutorial

// load modules
//Citation: StaticServer code from COMP2406 Tutorial
var http = require('http');
var fs = require('fs');
var mime = require('mime-types');
var url = require('url');
const ROOT = "./public_html";

// create http server
//Citation: StaticServer code from COMP2406 Tutorial
var server = http.createServer(handleRequest);
server.listen(2406);
console.log('Server listening on port 2406 k');

// handler for incoming requests
//Citation: StaticServer code from COMP2406 Tutorial
function handleRequest(req, res) 
{
	//process the request
	console.log("Request for: "+req.url);
	
	var filename = ROOT + req.url; //given server vars
	var code=200;
	var data = "";

	var recipesDir = ROOT + "/recipes/"; //directories
	var errorDir = ROOT + "/404.html";
	var mainDir = ROOT + "/index.html";
	
	var pathName = url.parse(req.url,true).pathname;
	if(req.method==="POST") //check for post
	{
			var postBody="";
			req.on('data',function(chunk)
			{			
				postBody+=chunk; 
			});
			req.on('end',function()
			{
				fs.writeFile("./public_html" + pathName,postBody) //write with format
			});
	}
	
	if(pathName === '/recipes/') //if looking for recipes folder 
	{
		fs.readdir(recipesDir, (err, files) => 
		{
			var recipesJSON ={};//new recipes array
			recipesJSON.fileList = files;//make filelist	
			res.end(JSON.stringify(recipesJSON));//end and stringify recipes
		})
	}
	else if (req.url==='/') // homepage localhost/2406/
	{
		console.log("done");
		data = getFileContents(mainDir);
		res.writeHead(code, {'content-type':mime.lookup(mainDir)|| 'text/html'});
		res.end(data);
	}
	
	else if (pathName.indexOf('.json') >= 0) { //requesting pathName with .json
		console.log("requested " + filename);
		data = getFileContents(filename);
		res.end(data);
	}
	
	else if (fs.existsSync(filename)===true) //entering url
	{
		data = getFileContents(filename);
		res.writeHead(code, {'content-type':mime.lookup(filename)|| 'text/html'});
		res.end(data);
	}
	
	else //error message check
	{
	code=404; //set 404
	data =getFileContents(errorDir);
	res.writeHead(code, {'content-type':mime.lookup(errorDir)|| 'text/html'});
	res.end(data);
	}
};

//read a file and returns its contents
//Citation: StaticServer code from COMP2406 Tutorial
function getFileContents(filename){
	
	var contents;
	
	//handle good requests
	console.log("Getting file");
	contents = fs.readFileSync(filename);
	console.log("typeof: "+typeof(contents));
	return contents;
}