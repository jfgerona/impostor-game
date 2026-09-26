const WORDS = {
  Food: ["Pizza", "Sushi", "Pancakes", "Tacos", "Popcorn", "Burger", "Ice cream", "Spaghetti", "Donut", "Salad",
         "Sandwich", "Soup", "Chocolate", "Cheese", "Watermelon", "Fries", "Curry", "Poutine", "Waffles", "Hot dog"],
  Animals: ["Penguin", "Giraffe", "Elephant", "Shark", "Kangaroo", "Owl", "Octopus", "Lion", "Panda", "Dolphin",
            "Moose", "Frog", "Eagle", "Camel", "Zebra", "Snake", "Rabbit", "Horse", "Bee", "Turtle"],
  Places: ["Airport", "Hospital", "Beach", "Library", "Zoo", "School", "Gym", "Movie theatre", "Museum", "Farm",
           "Hotel", "Bakery", "Space station", "Submarine", "Stadium", "Mall", "Castle", "Train station", "Campsite", "Restaurant"],
  Jobs: ["Doctor", "Teacher", "Firefighter", "Chef", "Pilot", "Farmer", "Dentist", "Police officer", "Plumber", "Astronaut",
         "Nurse", "Mechanic", "Lawyer", "Barber", "Photographer", "Electrician", "Cashier", "Lifeguard", "Journalist", "Architect"]
};

let players = [];
let game = null;

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function randomIndex(length) {
  return Math.floor(Math.random() * length);
}

function makeElement(tag, text, testId) {
  const element = document.createElement(tag);
  element.textContent = text;
  if (testId) element.dataset.testid = testId;
  return element;
}

const nameInput = document.getElementById("name-input");
const categorySelect = document.getElementById("category-select");

function showError(message) {
  document.getElementById("setup-error").textContent = message;
}

function renderPlayerList() {
  const list = document.getElementById("player-list");
  list.innerHTML = "";
  players.forEach((name, index) => {
    const item = makeElement("li", name);
    const removeButton = makeElement("button", "✕");
    removeButton.className = "remove";
    removeButton.addEventListener("click", () => {
      players.splice(index, 1);
      renderPlayerList();
    });
    item.appendChild(removeButton);
    list.appendChild(item);
  });
}

function addPlayer() {
  const name = nameInput.value.trim();
  if (!name) return;

  if (players.some(p => p.toLowerCase() === name.toLowerCase())) {
    showError("That name is already taken.");
    return;
  }

  players.push(name);
  nameInput.value = "";
  showError("");
  renderPlayerList();
  nameInput.focus();
}

function populateCategories() {
  Object.keys(WORDS).forEach(category => {
    const option = makeElement("option", category);
    option.value = category;
    categorySelect.appendChild(option);
  });
}

function startGame() {
  if (players.length < 3) {
    showError("You need at least 3 players.");
    return;
  }

  const category = categorySelect.value;
  const words = WORDS[category];

  game = {
    category: category,
    word: words[randomIndex(words.length)],
    impostorIndex: randomIndex(players.length),
    firstPlayerIndex: randomIndex(players.length),
    currentIndex: 0
  };

  showPassScreen();
}

function showPassScreen() {
  document.getElementById("pass-name").textContent = players[game.currentIndex];
  showScreen("pass-screen");
}

function showCard() {
  const card = document.getElementById("role-card");
  card.innerHTML = "";

  if (game.currentIndex === game.impostorIndex) {
    card.classList.add("impostor");
    card.append(
      makeElement("h2", "You're the impostor", "impostor-card"),
      makeElement("p", `Category: ${game.category}`)
    );
  } else {
    card.classList.remove("impostor");
    card.append(
      makeElement("p", `Category: ${game.category}`),
      makeElement("h2", game.word, "secret-word")
    );
  }

  showScreen("card-screen");
}

function hideCard() {
  game.currentIndex++;

  if (game.currentIndex < players.length) {
    showPassScreen();
  } else {
    document.getElementById("first-player").textContent = players[game.firstPlayerIndex];
    showScreen("play-screen");
  }
}

function showResults() {
  document.getElementById("result-impostor").textContent = players[game.impostorIndex];
  document.getElementById("result-word").textContent = game.word;
  showScreen("results-screen");
}

document.getElementById("add-player-btn").addEventListener("click", addPlayer);
nameInput.addEventListener("keydown", event => {
  if (event.key === "Enter") addPlayer();
});
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("reveal-btn").addEventListener("click", showCard);
document.getElementById("hide-btn").addEventListener("click", hideCard);
document.getElementById("reveal-impostor-btn").addEventListener("click", showResults);
document.getElementById("play-again-btn").addEventListener("click", startGame);
document.getElementById("change-players-btn").addEventListener("click", () => showScreen("setup-screen"));

populateCategories();
renderPlayerList();