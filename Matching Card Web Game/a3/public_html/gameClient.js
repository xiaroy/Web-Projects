//2406 Assignment 3
//Student Name: Roy Xia
//Student Number: 101009419
//Date of Completion: 11/12/16
//Citation: Tutorial 3

var user; //user variable prompt for name


//prompt user for name and send
$(document).ready(function(){
		user = prompt ("What is your name?");	
		if(prompt = null){
			prompt=fedefault;
		}
		$.ajax
		({
			method:"GET",
			url:"/memory/intro",
			data: {'username':user},
			success: displayGame,
			dataType:'json'
		});
		
});


//Name: displayGame
		//function: make gameboard
		//inputs:gameboard data
		//output: gameboard
function displayGame(data)
{
	$("#gameboard").empty();
	for (var i=0; i<data.mygame; i++)
	{
		var row = $("<tr></tr>");
			for (var j=0;j<data.mygame;j++)
			{
				var div=$("<div class='tile' data-row='"+i+"' data-col='"+j+"'></div>");
				div.click(chooseTile);
				row.append(div);
			}
		$("#gameboard").append(row);
	}
}

//Name: chooseTile
		//function: function to choose a tile
		//inputs: tile
		//output: row and col position
function chooseTile()
{
	var selected =$(this);
	$.ajax
	({
		method:"GET",
		url:"memory/card",
		data: {'username': user, 'row':selected.data("row"), 'col':selected.data("col")},
		success: function(data){tile(data, selected);},
		dataType:'json'
	});
}

//variables for matching
var win=false;
var attempts=0;
var lastValue=undefined;
var numOfCards=0;
var lastcard=undefined;
var pairs=0;


//Name: tile
		//function: determine if things match
		//inputs: row and col
function tile(data, tile)
{
	if (lastcard===undefined) //first tile
	{
		lastcard=tile;
		numOfCards++;
		attempts++;
		lastValue=data;
		tile.attr("class", 'tileFlipped');
		tile.append("<span>" +data+ "</span>");
	}
	
	else if (lastcard!=undefined && numOfCards<2) //second tile
	{
		tile.attr("class",'tileFlipped');
		tile.append("<span>"+data+"</span>");
		numOfCards++;
		
		if (numOfCards=2&&lastValue===data){ //if match
			attempts++;
			pairs=pairs+1;
		}
		
		else if (numberOfCards=2&&lastValue!==data) //if doesnt match
		{
			attempts++;
			setTimeout (function(){
			tile.attr("class",'tile');
			tile.html("");
			},200);
		lastcard.attr("class",'tile');
		lastcard.html("");
		}
		
		console.log(attempts);
		console.log(pairs);
		numOfCards=0;
		lastValue=undefined;
		lastcard=undefined;
	}
	
	if (pairs===8) //win
	{
		attempts=attempts/2;//attempts bug fix
		alert("You win the game you took : " +attempts+ " attempts to win the game"); //alert
	}
}

/*R2.6) The click handler for cards should oversee the matching and victory behaviours of the game as follows. A card will be clicked and the handler function should respond according to a number of conditions:
The card is currently face up → do nothing
The card is face down and no other cards are active → reveal the card
The card is face down and one other card is active → reveal the card and match it to the other active card
If there's a match, leave both cards face up (but neither are 'active').
If all cards are matched, then end the game (see R2.7).
If there's no match, flip both cards back down (ideally after a short pause so the user can see).
The card is face down and two other cards are active → do nothing
*/