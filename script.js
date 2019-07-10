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
	/* what does the data look like? there will be income and expenses. Each item will 
	have a description and a value. We also need a way to distingush between income and expenses. We will also 
	need a unique id as well. Perphaps an object will do.

	We will make a constructor because we need to make many different entries
	*/
	var Expense = function(id,description,value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id,description,value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},

		totals : {
			exp: 0,
			inc: 0
		}
	};

	return {
		addItem: function(newInput) {
			var type,description,value,newItem,ID;

			type = newInput.type;
			description = newInput.description;
			value = newInput.value;
			// last ID plus 1
			if (data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}
			

			//Create new item based on 'inc' or 'exp' type
			if (type == 'exp') {
				newItem = new Expense(ID,description,value);
			} else if (type == 'inc') {
				newItem = new Income(ID,description,value);
			}

			// now to push the object
			data.allItems[type].push(newItem);
			// return the newItem
			return newItem;
		},

		testing: function() {
			console.log(data);
		}
	};

})();



// this will handle the view
var UIController = (function(){
	// some code later
	//Use an object to store the add 
	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputAddButton: '.add__btn',
		incomeContainer:'.income__list',
		expenseContainer:'.expense__list'
	};

	return {
		getDOMstrings: function(){return DOMstrings;},

		getInput:  function(){
		// note that if we want these values. so the function returns an object is required for the public properties
			return {
				type: document.querySelector(DOMstrings.inputType).value, //inc or exp as specfied on html doc
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: document.querySelector(DOMstrings.inputValue).value
			};
		},

		addListItem: function(obj,type) {
			var html,newHTML,element,description,value,ID;
			description = obj.description;
			value = obj.value;
			ID = obj.id;
			// Create HTML string with placeholder text
			// there is income and expenses here
			
			if(type == 'inc'){
				element = DOMstrings.incomeContainer;
				html = '<div class = "item" id="income-%id%"><div class = "item__description">%description%</div><div class="item__value">%value%</div><div class="item__delete"><button class ="item__delete--btn">Delete Entry</button></div></div>';
			} else if(type == 'exp') {
				element = DOMstrings.expenseContainer;
				html = '<div class = "item" id="expense-%id%"><div class = "item__description">%description%</div><div class="item__value">%value%</div><div class="item__delete"><button class ="item__delete--btn">Delete Entry</button></div></div>';
			}
			// replace placeholder text with actual data
			newHTML = html.replace('%id%',ID);
			newHTML = newHTML.replace('%description%',description);
			newHTML = newHTML.replace('%value%',value);
			// Insert the HTML to the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
		},

		clearFields: function() {
			var fields,fieldsArr;
			// querySelectorAll returns a list not an array that we can loop over
			// this is like css if we want to select Description and inputValue
			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
			// this is the way to convert to an array
			// var fieldsArr = Array.prototype.slice.call(fields);
			// console.log(fields,fieldsArr);
			// fieldsArr.forEach(function(current,index,array){
			// 	current.value ="";
			// });
			// the fields of description and value put in the main input bar is reset to nothing after push
			fields.forEach(function(current,index,array){
				current.value ="";
			});
			// highlight the description
		 	fields[0].focus();
		}
		
	};
	
})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
// the controller tells what to do for the other controllers
		
	var setUpEventListeners = function() {
		var DOM = UICtrl.getDOMstrings();
		document.querySelector(DOM.inputAddButton).addEventListener('click', ctrlAddItem);
	// we also will handle the keypress as well. This will happen on the global event space
	// e is the event which will be automatically sent by the browser
	// keycode 13 is the return keyword
		document.addEventListener('keypress',function(e){
			if(e.keyCode == 13 || e.which === 13){
				ctrlAddItem();
			}
		});
	};
	
	var ctrlAddItem = function() {
		var userInput,newItem,newItemUI;
		// Get the field input data
		userInput = UICtrl.getInput();

		// Add the new item to the budget controller
		newItem = budgetCtrl.addItem(userInput);
		// Add the new item to the user interace 
		newItemUI = UICtrl.addListItem(newItem,userInput.type);
		// Clear the field
		UICtrl.clearFields();

		// calculate the budget

		// Display the budget on UI

	};

	return {
		init: function(){
			setUpEventListeners();
		}
	};

})(budgetController,UIController);

// run the application
controller.init();
