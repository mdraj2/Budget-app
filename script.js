/*we are going to make the modular pattern here
use closures and IIFE

the IFFE makes a new scope which is not visible from the outside scope
The variable and function cannot be accessed from the outside
but the difference is that with the IFFE we can give the outside scope the 
objects that it can access

Currently there will be no interactions between the two modules ever and do not share the 
global space at all. Currently, only budgetController.publicTest() can only be acessed.

This is good because then we can work on the code of the budgetController without having to
worry about anyother modules. This is called seperations of concerns. Each part of the application
should be interested in doing one thing only. They dont even know the other one even exists


*/

// this will handle the data 
var budgetController = (function(){
	var x = 23;
	/*this is a private add function. This means that we cannot access this from
	the outside*/
	var add = function(a){
		return x + a;
	}

	return {
		publicTest: function(b) {
			return add(b);
		}
	}
})();

// this will handle the view
var UIController = (function(){
	// some code later
})();

/*we can pass arguements here. So we tell the main controller about the budget and UI controllers
the reason we do this is because if we change the name of one of the controller then
we only need to change once over here*/
var controller = (function(budgetCtrl, UICtrl){
	var z = budgetCtrl.publicTest(5)
	// get into the habit of returning objects
	return {
		anotherPublic: function () {
			console.log(z);
		}
	}

})(budgetController,UIController);