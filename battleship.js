// JavaScript Document



var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,

	
	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],


/*	
	// We created a variable named ships and assigning it an array that holds the three ships.
		//each ship is an object, each ship has a locations property (with the location property as and array of 3 locations)	
	ships: [
		{ locations: ["06", "16", "26"], hits: ["", "", ""] },
		{ locations: ["24", "34", "44"], hits: ["", "", ""] },
		{ locations: ["10", "11", "12"], hits: ["", "", ""] }
	],
*/
			
	fire: function(guess) {
		for(var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");

				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},
	
	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},



	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log("Ships array: ");
		console.log(this.ships);
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},
	
	
    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
    
}; 



var view = {
	
	// The displayMessage method takes one argument, a msg
	displayMessage: function(msg) {
		// We get the messageArea element from the page
		var messageArea = document.getElementById("messageArea");
		// updating the text of the messageArea element by setting its innerHTML to msg.
		messageArea.innerHTML = msg;
		
	},
	
	// Location funcion for hit
	displayHit: function(location) {
		// The location is created from the row and column and matches an id of a <td> element
		var cell = document.getElementById(location);
		// This will set the class of that element to "hit" and add a ship image to the <td> element
		cell.setAttribute("class", "hit");
		
	},
	
	// location function for miss
	displayMiss: function(location) {
		// The location is created from the row and column and matches an id of a <td> element
		var cell = document.getElementById(location);
		// This will set the class of that element to "miss" and add a ship image to the <td> element
		cell.setAttribute("class", "miss");
		
	}
	
};


var controller = {
	guesses: 0,

	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			// if the is valid we increase the guess by one 
			this.guesses++;
			// here we pass the row and column fromt the form
			var hit = model.fire(location);
			// we are looking to see here if the sunk number of ships is strictly equal to the number of ships that populate the board.
			if (hit && model.shipsSunk === model.numShips) {
					// looking to return the number of guesses it took.
					view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
			}
		}
	}
}



// helper function to parse a guess from the user

function parseGuess(guess) {
	// array loaded each letter to match the number of columns
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");
	} else {
		// grabbing the first character of the guess
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		// grabbing the second character of the guess
		var column = guess.charAt(1);
		
		// all of this is to check and make sure it is on the board.
		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Oops, that's off the board!");
		} else {
			return row + column;
		}
	}
	return null;
}



// event handlers

function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value.toUpperCase();

	controller.processGuess(guess);

	guessInput.value = "";
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");

	// in IE9 and earlier, the event object doesn't get passed
	// to the event handler correctly, so we use window.event instead.
	e = e || window.event;

	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}




// init - called when the page has completed loading

window.onload = init;

function init() {
	// Fire! button onclick handler
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	// handle "return" key press
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	// place the ships on the game board
	model.generateShipLocations();
}

