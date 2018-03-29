//2406 Assignment 4
//Student Name: Roy Xia
//Student Number: 101009419
//Date of Completion: 11/23/16
//Citation: Static Server from COMP2406

/*SocketIO based chat room. Extended to not echo messages
to the client that sent them.*/

var http = require('http').createServer(handler);
var io = require('socket.io')(http);
var fs = require('fs');
var clients=[];
var url = require('url');
var ROOT = "./files";
var data = "";
var mime = require('mime-types');

http.listen(2406);

console.log("Chat server listening on port 2406");


function handler(req,res)
{
	
	var filename = ROOT + url.parse(req.url,true).pathname;
	var pathName =pathname = url.parse(req.url, true).pathname;
	
	//fs.readFile("./files/chatRoom_final.html", function(err,data){
			
	console.log(req.method+" request for: "+req.url);


	fs.stat(filename,function(err, stats)
	{
		if(filename === './files/')
		{
			fs.readFile("./files/chatRoom_final.html", function(err,data)
			{
				if(err)
				{
					res.writeHead(500);
					return res.end("Error loading chatRoom.html");
				}
				else
				{
					res.writeHead(200);
					res.end(data);
				}
			});
		}
		
		else if(err)
		{
            respondErr(err)
        }
		
		else if(stats.isDirectory())
		{
            fs.readdir(filename,function(err, files){
                if(err)respondErr(err);
                else respond(200,files.join("<br/>"));
            });
        }
		
		else
		{
            fs.readFile(filename,"utf8",function(err, data){
                if(err)respondErr(err);
                else respond(200,data);
            });
        }
    });            
	
	function serve404()
	{
        res.writeHead(500);
		return res.end("Error loading chatRoom.html");
    }

    function respondErr(err){
        console.log("Handling error: ",err);
        if(err.code==="ENOENT"){
            serve404();
        }else{
            respond(500,err.message);
        }
    }
    
    function respond(code, data){
        res.writeHead(code, {'content-type': mime.lookup(filename)|| 'text/html'});
        res.end(data);
    }    
};


io.on("connection", function(socket)
{
	console.log("Got a connection");//connection
	socket.on("intro",function(data){
		socket.username = data;
		clients.push(socket);
		socket.broadcast.emit("message", timestamp()+": "+socket.username+" has entered the chatroom.");
		socket.emit("message","Welcome, "+socket.username+".");
	io.emit("userList", {clients:getUserList()});
		
	});
		
	socket.on("message", function(data){//message
		console.log("got message: "+data);
		socket.broadcast.emit("message",timestamp()+", "+socket.username+": "+data);
	});
	
	
	/*socket.on("private", function(data){
		console.log("private done");
		for (var j=0;j<clients.length;j++){
			if (clients[j].userName===data.userName){
				io.emit("private", {"userName":socket.username,"message":data.message});
			}	
		}	
	});*/
	
	socket.on("private", function(data){//private msg
		for (var i=0;i<clients.length;i++){
			if (clients[i].username===data.userName){
				clients[i].emit("private", {"userName":socket.username,"message":data.message});
			}	
		}	
	});
	
	socket.on("blockUser", function(data){ //block user
		
	});
	
	socket.on("blockUserPrivate", function(data){ //block user private msg
		
	});


	socket.on("disconnect", function(){ //disconnect
		console.log(socket.username+" disconnected");
		
		clients = clients.filter(function(ele){  
			return ele!==socket;
			
		
		});
		io.emit("message", timestamp()+": "+socket.username+" disconnected.");
		io.emit("userList", {clients:getUserList()});
	});
	
});

function timestamp(){
	return new Date().toLocaleTimeString();
}

function getUserList(){
    var ret = [];
    for(var i=0;i<clients.length;i++){
        ret.push(clients[i].username);
    }
    return ret;
}

