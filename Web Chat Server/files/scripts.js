<script>
		
		$(document).ready(function()
		{
			
			var userName =("default name");
			userName=prompt("What's your name?")||"User";
			
			var socket = io(); //connect to the server that sent this page
			socket.on('connect', function(){
				socket.emit("intro", userName);
			});
			
			$('#inputText').keypress(function(ev){
					if(ev.which===13){
						//send message
						socket.emit("message",$(this).val());
						ev.preventDefault(); //if any
						$("#chatLog").append((new Date()).toLocaleTimeString()+", "+userName+": "+$(this).val()+"\n")
						$(this).val(""); //empty the input
					}
			});
			
			var dbHandler = function() 
			{
					var privMsg = prompt("msg");
					var senduser=$(this).html();				
					socket.emit("private",{"userName":senduser, "message":privMsg});
					console.log("db handler");
					console.log("send user:" + senduser);
			};
					
			socket.on("message",function(data){
				$("#chatLog").append(data+"\n");
				$('#chatLog')[0].scrollTop=$('#chatLog')[0].scrollHeight; //scroll to the bottom
			});
			
			socket.on("userList", function(data)
			{
				console.log(data.clients);
				$("#userList").empty();
				for(var i=0; i<data.clients.length;i++)
				{
				$("#userList").append("<li>"+data.clients[i]+"</li>");
				$("#userList li:nth-child(" + i + ")").dblclick(dbHandler);
				//line previous
				}
				$("#userList li:nth-child(" + i + ")").dblclick(dbHandler);
			});
			
			socket.on("private", function(data)
			{
				var privMsg2 = prompt(data.userName+ ":" + data.message);				
				if(privMsg2!=null)
				{
				socket.emit("private",{"userName":userName, "message":privMsg2});
				}
			});
		});			
		
	</script>