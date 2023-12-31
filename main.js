// Arrays to store game state
let sequence = [];
let humanSequence = [];
let level = 0;

// DOM elements
const startButton = document.querySelector(".js-start");
const info = document.querySelector(".js-info");
const heading = document.querySelector(".js-heading");
const tileContainer = document.querySelector(".js-container");

/**
 * Resets the game state and displays an alert with the given text.
 * @param {string} text - The text to display in the alert.
 */
function resetGame(text) {
	alert(text);
	sequence = [];
	humanSequence = [];
	level = 0;
	startButton.classList.remove("hidden");
	heading.textContent = "Simon Says Game";
	info.classList.add("hidden");
	tileContainer.classList.add("unclickable");
}

/**
 * Initiates the human's turn in the game.
 * @param {number} level - The current level of the game.
 */
function humanTurn(level) {
	tileContainer.classList.remove("unclickable");
	info.textContent = `Your turn: ${level} Tap${level > 1 ? "s" : ""}`;
}

/**
 * Activates a colored tile and plays its associated sound.
 * @param {string} color - The color of the tile to activate
 */
function activateTile(color) {
	const tile = document.querySelector(`[data-tile='${color}']`);
	const sound = document.querySelector(`[data-sound='${color}']`);

	tile.classList.add("activated");
	sound.play();

	setTimeout(() => {
		tile.classList.remove("activated");
	}, 300);
}

/**
 * Plays the sequence of colored tiles for the given round.
 * @param {Array} nextSequence - The sequence of colors to play.
 */
function playRound(nextSequence) {
	nextSequence.forEach((color, index) => {
		setTimeout(() => {
			activateTile(color);
		}, (index + 1) * 600);
	});
}

/**
 * Generates the next step in the game (color for the computer's turn).
 * @returns {string} - The color for the next step.
 */
function nextStep() {
	const tiles = ["red", "green", "blue", "yellow"];
	const random = tiles[Math.floor(Math.random() * tiles.length)];

	return random;
}

/**
 * Initiates the next round of the game.
 */
function nextRound() {
	level += 1;

	tileContainer.classList.add("unclickable");
	info.textContent = "Wait for the computer";
	heading.textContent = `Level ${level} of 20`;

	// Copy all the elements in the `sequence` array to `nextSequence`
	const nextSequence = [...sequence];
	nextSequence.push(nextStep());
	playRound(nextSequence);

	sequence = [...nextSequence];
	setTimeout(() => {
		humanTurn(level);
	}, level * 600 + 1000);
}

/**
 * Handles the click event on a colored tile during the human's turn.
 * @param {string} tile - The color of the clicked tile.
 * @returns
 */
function handleClick(tile) {
	const index = humanSequence.push(tile) - 1;
	const sound = document.querySelector(`[data-sound='${tile}']`);
	sound.play();

	const remainingTaps = sequence.length - humanSequence.length;

	if (humanSequence[index] !== sequence[index]) {
		resetGame("Oops! Game over, you pressed the wrong tile");
		return;
	}

	if (humanSequence.length === sequence.length) {
		if (humanSequence.length === 20) {
			resetGame("Congrats! You completed all the levels!");
			return;
		}
		humanSequence = [];
		info.textContent = "Success! Keep going!";
		setTimeout(() => {
			nextRound();
		}, 1000);
		return;
	}

	info.textContent = `Your turn: ${remainingTaps} Tap${
		remainingTaps > 1 ? "s" : ""
	}`;
}

/**
 * Initiates the game by hiding the start button and starting the first round.
 */
function startGame() {
	startButton.classList.add("hidden");
	info.classList.remove("hidden");
	info.textContent = "Wait for the computer";
	nextRound();
}

// Event listeners
startButton.addEventListener("click", startGame);
tileContainer.addEventListener("click", (event) => {
	const { tile } = event.target.dataset;

	if (tile) handleClick(tile);
});
