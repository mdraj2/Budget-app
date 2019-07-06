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
	//some code later
})();

// this will handle the view
var UIController = (function(){
	// some code later
})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

	var ctrlAddItem = function() {
		console.log('passed');
		// this will be shared by both events
		// Get the field input data
		// Add the item to the budget controller
		// Add the item to the user interace 
		// calculate the budget
		// Display the budget on UI

	}

	document.querySelector('.add__btn').addEventListener('click', ctrlAddItem)

	// we also will handle the keypress as well. This will happen on the global event space
	// e is the event which will be automatically sent by the browser
	// keycode 13 is the return keyword
	document.addEventListener('keypress',function(e){
		if(e.keyCode == 13 || e.which === 13){
			ctrlAddItem();
		}
	})

})(budgetController,UIController);