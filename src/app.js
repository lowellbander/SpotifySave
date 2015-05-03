// Import the UI elements
var UI = require('ui');

// Create a simple Card
var card = new UI.Card({
  title: 'Hello World',
  body: 'This is your first Pebble app!'
});

// Display to the user
card.show();