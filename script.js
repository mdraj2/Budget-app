// this will handle the data 
var budgetController = (function(){
	"use strict";
	var Expense = function(){}, 
		Income= function(){},
		data = {},
		calculateTotal = function(){};
	Expense = function(id,description,value){
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};
	Expense.prototype.calcPercentage = function(totalIncome){
		if(totalIncome>0){
			this.percentage = Math.round((this.value/totalIncome)*100);
		} else {
			this.percentage = -1;
		}
	};
	Expense.prototype.getPercent = function(){
		return this.percentage;
	};
	Income = function(id,description,value){
		this.id = id;
		this.description = description;
		this.value = value;
	};
	calculateTotal = function(type) {
		data.totals[type] = 0;
		data.allItems[type].forEach(function(item) {
		data.totals[type] += item.value;
		});
	};
	data = {
		allItems: {
			exp: [],
			inc: []
		},

		totals : {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	};
	return {
		addItem: function(newInput) {
			var type = String,
				description = String,
				value = String,
				newItem = {},
				ID = Number;

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
			if (type === 'exp') {
				newItem = new Expense(ID,description,value);
			} else if (type === 'inc') {
				newItem = new Income(ID,description,value);
			}

			// now to push the object
			data.allItems[type].push(newItem);
			// return the newItem
			return newItem;
		},
		deleteItem: function(type,ID) {
			var ids = [],
				index;

			ids = data.allItems[type].map(function(current,index,array){
				return current.id;
			});

			index = ids.indexOf(ID);
			// if not found -1 is returned

			if(index !== -1) {
				// first argument is the position in the data array and the second is the number of
				// elements
				data.allItems[type].splice(index, 1); 
			}
		},
		calculateBudget: function(){
			// get used to the methodolgy that either get or set data
			// calculate the total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');
			// calculate the budget: income and expense 
			data.budget = data.totals.inc - data.totals.exp;  
			// calculate the percentage of income that we have spent 
			if(data.budget > 0){
				data.percentage = Math.round((data.totals.exp)/(data.totals.inc)*100);
			} else {
				data.percentage = -1;
			}
		},
		calculatePercentages: function(){
			data.allItems.exp.forEach(function(expense){
				expense.calcPercentage(data.totals.inc);
			});
		},
		getPercentages:function(){
			// return an array of equal size containing the percentages in the expenses
			var allPerc = data.allItems.exp.map(function(current){
				return current.getPercent();
			});
			return allPerc;
		},	
		getBudget: function(){
			return {
				budget:data.budget,
				totalInc: data.totals.inc,
				totalExp:data.totals.exp,
				percentage: data.percentage
			};
		},
		testing: function(obj) {
			return this.addItem(obj);
		}
	};

})();

// this will handle the view
var UIController = (function(){
	"use strict";
	var DOMstrings = {};
	DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputAddButton: '.add__btn',
		incomeContainer:'.income__list',
		expenseContainer:'.expense__list',
		budgetLabel: '.budget__value',
		incomeLabel: '______________',
		expenseLabel: '______________',
		containerLabel : ".container"
	};
	return {
		getDOMstrings: function(){return DOMstrings;},
		getInput:  function(){
		// note that if we want these values. so the function returns an object is required for the public properties
			return {
				type: document.querySelector(DOMstrings.inputType).value, //inc or exp as specfied on html doc
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: Math.abs(parseFloat(document.querySelector(DOMstrings.inputValue).value))
			};
		},
		addListItem: function(obj,type) {
			var html = String,
				newHTML = String,
				element = String,
				description = String,
				value = String,
				ID = Number;

			description = obj.description;
			value = obj.value;
			ID = obj.id;
			// Create HTML string with placeholder text
			// there is income and expenses here
			
			if(type == 'inc'){
				element = DOMstrings.incomeContainer;
				html = '<div class = "item" id="inc-%id%"><div class = "item__description">%description%</div><div class="item__value">%value%</div><div class="item__delete"><button class ="item__delete--btn">Delete Entry</button></div></div>';
			} else if(type == 'exp') {
				element = DOMstrings.expenseContainer;
				html = '<div class = "item" id="exp-%id%"><div class = "item__description">%description%</div><div class="item__value">%value%</div><div class="item__delete"><button class ="item__delete--btn">Delete Entry</button></div></div>';
			}
			// replace placeholder text with actual data
			newHTML = html.replace('%id%',ID);
			newHTML = newHTML.replace('%description%',description);
			newHTML = newHTML.replace('%value%',value);
			// Insert the HTML to the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
		},
		clearFields: function() {
			var fields = {},
				fieldsArr = {};
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
		},
		deleteListItem: function(selectorID){
			// note that you can only delete a child of an element not itself
			var el = {};
			el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
		},
		displayBudget: function(obj) {
			var currentBudget = Number;
			currentBudget = document.querySelector(DOMstrings.budgetLabel);
			currentBudget.textContent = '$' + obj.budget.toString();
		}
	};
})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
	"use strict";
	var setUpEventListeners = function(){},
		DOM = {},
		ctrlAddItem = function(){},
		ctrlDeleteItem = function(){},
		updateBudget = function(){},
		traverseDOM = function(){},
		updatePercentages = function(){};
	setUpEventListeners = function() {
		DOM = UICtrl.getDOMstrings();
		document.querySelector(DOM.inputAddButton).addEventListener('click', ctrlAddItem);
		document.addEventListener('keypress',function(e){
			if(e.keyCode == 13 || e.which === 13){
				ctrlAddItem();
			}
		});

		document.querySelector(DOM.containerLabel).addEventListener('click',ctrlDeleteItem);
	};
	ctrlAddItem = function() {
		var userInput = {},
			newItem = {},
			newItemUI = {};
		// Get the field input data
		userInput = UICtrl.getInput();

		if(userInput.description !=="" && !isNaN(userInput.value) && userInput.value != 0)
		{	// Add the new item to the budget controller
			newItem = budgetCtrl.addItem(userInput);
			// Add the new item to the user interace 
			newItemUI = UICtrl.addListItem(newItem,userInput.type);
			// Clear the field
			UICtrl.clearFields();
			// Calculate and update the budget
			updateBudget();
			// calculate and update the percentages
			updatePercentages();
		}
	};
	ctrlDeleteItem = function(e) {
		var itemID = false,
			splitID = String,
			type = String,
			ID = String,
			className = "item__delete--btn";
			

		if(e.target.classList.contains(className)){
			itemID = traverseDOM(e,"item").id;
		}

		if(itemID) {
			// even though string is a primative by putting a dot we make it to an object and access string methods
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);
			// remove the data from the database
			budgetCtrl.deleteItem(type,ID);
			// Delete the item in the UI
			UICtrl.deleteListItem(itemID);
			// update and show
			updateBudget();
			// calculate and update the percentages
			updatePercentages();
		}
	};
	updateBudget = function() {
		var budget = {};
		// calculate the budget
		budgetCtrl.calculateBudget();
		// return the budget
		budget = budgetCtrl.getBudget();
		// Display the budget on UI
		UICtrl.displayBudget(budget);
	};
	updatePercentages = function() {
		var percentages = {};
		// calculate the percentages of all expense items when item is added or deleted
		budgetCtrl.calculatePercentages();
		// read from the budget controller
		percentages = budgetCtrl.getPercentages();
		// update the user interface with the new percentages
		console.log(percentages);
	};
	traverseDOM = function(e,className) {
		var DOMelement = e.target;

 		while(DOMelement.classList && !DOMelement.classList.contains(className)){

 			DOMelement = DOMelement.parentNode;
 		}

 		return DOMelement;
	};
	return {
		init: function(){
			// note that with the init we can reset the entire page during loading
			UICtrl.displayBudget(
				{budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: 0}
			);
			setUpEventListeners();
		}
	};
})(budgetController,UIController);

// run the application
controller.init();
