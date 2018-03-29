//Student Name: Roy Xia
//Student Number: 101009419
//Assignment: 5
//Citation: COMP2406 provided code, My assignent 2 for pug section
//Date of completion: 2016-12-09

//var reqs
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require ('body-parser');
var express = require('express');
var app = express();
var pug = require('pug');

//set app pug given
app.set('views','./views');
app.set('view engine','pug');

//case for /
app.get("/",function(req,res){ 
	res.render('index.pug');
});

//case for recipes
app.get("/recipes",function(req,res){
	MongoClient.connect("mongodb://localhost:27017/recipeDB",function(err,db){
	console.log("chcek to see if server goes inside recipe");
		var recipeList=[];
		
		if(err) console.log("check-recipe Error connecting to the DB");
		
		else{
			
			console.log("test 1 connected to database");
			
			var collection = db.collection("recipes").find();
			collection.each(function(err, document){
			if (document===null)
			{
				res.send({names:recipeList});
				db.close();
			}
			else
				recipeList.push(document.name);
			});
		}	
	});
});

//case for reciples name
app.get("/recipe/:name",function(req,res){
	MongoClient.connect("mongodb://localhost:27017/recipeDB",function(err,db){
		if(err)
		{
			console.log("check-recipename Error connecting to the DB");
		}
		else
		{
			console.log("test 2 connected to database");
			var collection = db.collection("recipes").findOne({name:req.params.name},function(err,result){
			if (err)
				res.sendStatus(404);
			else
				res.send(result);
			});
		}	
	});
});

//post part
app.use('/recipe', bodyParser.urlencoded({extended:true}));
app.post('/recipe',function(req,res){
	
	if(req.body.name===""){
		res.sendStatus(400);
		console.log("no problems");
	}
	else{
		MongoClient.connect("mongodb://localhost:27017/recipeDB",function(err,db){
			console.log("Following is being submitted:");
			console.log(req.body);
			var collection=db.collection("recipes");
			collection.update({name:req.body.name},req.body,{upsert:true}, function(err,result){
				if (err)
					res.sendStatus(500);
				else
					res.sendStatus(200);
			});
		});
	}
});

app.use(express.static("./public"));
app.listen(2406,function(){console.log("Server up");});