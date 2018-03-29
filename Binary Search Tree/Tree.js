//Roy Xia
//Purpose: To create and test a binary seach tree data structure that supports various tree function interactions

var Tree = function() //Tree function
{
    this.root = null; //setting this.root = null value

    this.isEmpty = function() //isEmpty function, if this.root is equal to null return true else return false
	{
		if (this.root === null)
		{
			console.log ("The function is empty - isEmpty function");
			return true;
		}
		else {
			console.log ("The function is not empty - isEmpty function");
			return false;
		}
    }

	this.isLeaf = function() { //isLeaf function, if both root nodes are null return true else return false
		
		if(this.root === null){
			console.log ("The function is empty therefore it is not a leaf - isLeaf function");
			return false;
			 
		}
		
		if ((this.root.left === null) && (this.root.right === null))
		{
			console.log ("The function is a leaf - isLeaf function");
			return true;
		}
		else 
		{
			console.log ("The function is not a leaf - isLeaf function");
			return false;
		}
	};

	this.insert = function(value)  //insert function with perameters value 
	{
		
		
			if (this.contains(value)) 
			{
			console.log ("- insert function");
			return;
			}
			if (this.root === null) //if this.root is equal to null then set this.root = null
			{
				this.root = makeNode(value);
				return;
			}
			else {
				var currentNode = this.root; //current node variable
				while (true)
				{
					if (value<currentNode.value) //if value is less than node go left
					{
						if (currentNode.left === null) //as left as you can found the spot
						{
							currentNode.left=makeNode(value);
							return;
						}
						else { //go left again
							currentNode=currentNode.left;
						}
					}
					
					if (value>currentNode.value) //if value is greater than node go right
					{
						if (currentNode.right === null) //as left as possible found the spot
						{
							currentNode.right=makeNode(value);
							return;
						}
						else { //go right again
							currentNode=currentNode.right;
						}
					}
				}
			}
	};

	this.remove = function(value) //remove function with perameters value 
	{
	if (this.root === null) //if no values return
		{
			return;
		}
		else {
			var currentNode = this.root; //current node variable
			while (true)
			{
				if (value<currentNode.value) //if value is less than the value go left
				{
					if ((currentNode.left != null) && (currentNode.left.value===value)) //not null and found
					{
						currentNode.left=null; //remove
						return;
					}
					else { //go left again
						currentNode=currentNode.left;
					}
				}
				
				if (value>currentNode.value) //if value is greater than the value go right
				{
					if ((currentNode.right != null) && (currentNode.right.value==value)) //if value is greater than the value go right
					{
						currentNode.right=null; //remove
						return;
					}
					else { //go right again
						currentNode=currentNode.right;
					}
				}
			}
		}
		
	};

	this.contains = function(value) // contains function
	{
		var found = false; //if found variable
		current = this.root;//current variable
		
		while (found === false && current) //while not found 
		{
			if (value < current.value) //less than go left
			{
				current = current.left;
			}
			else if (value > current.value) //greater than go right
			{
				current = current.right;
			}
			else //if equal to return found requals true
			{
				console.log ("The function contains the value.");
				found = true;
			}
		}
		
		if(found===false)
		{
			console.log ("The function does not contains the value.");
		}
		return found;
	};

	this.findLargest = function() //findlargest function
	{
		var startingnode = this.root; //starting node at root
		
		while (startingnode.right!=null) //while the greater value is not null keep going right
		{
			startingnode=startingnode.right;
		}
		console.log ("The largest value is " + startingnode.value + ".");
		return startingnode.value; //return right most value
	};

	this.findSmallest = function() //findsmallest function
	{
		
		var startingnode = this.root; //starting node at root
		
		while (startingnode.left!=null) //while the lesser value is not null go left
		{
			startingnode=startingnode.left;
		}
		console.log ("The smallest value is " + startingnode.value + ".");
		return startingnode.value; //return left most value
	};

	this.copy = function() //deep copy function
	{
		var newtree = new Tree(); //create a new tree
		
		if (this.isEmpty == true) // check is default tree is empty
		{
			console.log ("the default tree is empty");
			return newtree;
		}
		
		var Nodes=[this.root]; // setting Nodes array to this.root
		var ChildNode=[]; //additional array 
		
		first=false; 
		
		while ((ChildNode.length!=0)&&(first))
		{ //
		first = true;
		
			for (i=0; i < Nodes.length; i++)
			{ //pushing right and left child nodes
				if (Nodes[i].left!=null){
				ChildNode.push(Nodes[i].left);}
				if (Nodes[i].right!=null){
				ChildNode.push(Nodes[i].right);}
			}
			
			for (i=0; i<Nodes.length; i++)
			{
				newtree.insert(Nodes[i].value);
			}
		
			Nodes=ChildNode;
		}
		return newtree;
	};

	this.toString = function() //toString function
	{ 
	
		if(this.isEmpty()){ //if the tree is empty return empty string
			console.log ("- toString function");
			return "";
		}
		
		result= ""; //empty string
		result+= this.stringtraversal(this.root); //add elements traverse tree
		console.log ("The tree is not empty - toString function");
		return result;
	};

	this.treeMap = function(operation) 
	{
	if(this.isEmpty==true)
		{
		return;	
		}
		this.operationtraversal(this.root,operation);
	};
	
	this.stringtraversal = function(currentNode) //additional tostring function traversal that adds everything - traverse through tree
	{
		emptystring = ""; //empty string
		if (currentNode.left != null){
			emptystring+=this.stringtraversal(currentNode.left);
		}
		
		emptystring+=currentNode.value;
		emptystring+=",";
		
		if (currentNode.right != null){
			emptystring+=this.stringtraversal(currentNode.right);
		}
		return emptystring;
	}
	
	this.operationtraversal = function(currentNode, operation) //additional operation function that does the operation - traverse through tree
	{
		if (currentNode.left != null){ //do operation left while the left child isnt equal null
			this.operationtraversal(currentNode.left, operation);
		}
		
		currentNode.value=operation(currentNode.value); 
		
		if (currentNode.right != null){ //do operations right while the right child isnt equal null
			this.operationtraversal(currentNode.right, operation);
		}
		
	}
}

var makeNode = function(value) //makes a node
{
    var node = {};
    node.value = value;
    node.left = null;
    node.right = null;
	console.log ("A node has been made - makeNode function");
    return node;
};

var test = function(){
	var t = new Tree();
	t.isEmpty(); //should be empty
	console.log ("-----------------------1");
	t.toString(); // blank line
	console.log ("-----------------------2");
	console.log (t.toString());
	console.log ("-----------------------3");
	t.insert(5);  //add element to the tree
	console.log ("-----------------------4");
	t.isEmpty(); //false
	console.log ("-----------------------5");
	t.isLeaf();  //true because the root has no children (yet)
	console.log ("-----------------------6");
	t.toString(); //perform an in-order traversal of the tree to get notes
	console.log ("-----------------------7");
	console.log (t.toString());
	console.log ("-----------------------8");
	t.insert(7); //adds 7 to the right subtree of 5
	console.log ("-----------------------9");
	t.toString();
	console.log (t.toString());
	t.insert(3);
	console.log ("-----------------------10");
	t.toString(); 
	console.log (t.toString());
	t.insert(3); //ignore duplicates
	t.toString();
	console.log ("-----------------------11");
	console.log (t.toString());
	t.contains(3);//true
	console.log ("-----------------------12");
	t.contains(4);//false
	t.insert(4);
	t.insert(2);
	t.insert(8);
	t.insert(1);
	t.insert(6);
	t.insert(5);
	console.log ("-----------------------13");
	t.toString();
	console.log (t.toString());
	console.log ("-----------------------14");
	t.findSmallest()
	console.log ("-----------------------15");
	t.findLargest()
	console.log ("-----------------------16");
	t.remove(3); //removes the subtree that's rooted at 2
	t.toString();
	console.log (t.toString());
	console.log ("-----------------------17");
	var t2=t.copy();
	console.log ("-----------------------18");
	t2.toString();
	console.log (t2.toString());
	console.log ("-----------------------19");
	var square = function(x)
	{return x*x;}
	console.log ("-----------------------20");
	t.treeMap(square); //assumes the function square is defined 
	//25 49
	console.log ("-----------------------21");
	t.toString()
	console.log (t.toString());
	console.log ("-----------------------22");

}

exports.test = test; //exports
exports.Tree = Tree;