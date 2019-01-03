const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const db = require('./models/index.js');
const Promise = require("bluebird");
const Game = db.Game;
const Players = db.Players;

app.use(express.static('frontend'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post("/game", function(req, res) {
	let gameCode = req.body.gameCode;
	let playerName = req.body.playerName;
	let game;
	let player;

	let playerPromise = Players.findOrCreate({
		where: {
			username: playerName
		}
	})

	let gamePromise = Game.findOrCreate({
		where: {
	    	gameCode: gameCode
	    }
	});

	return Promise.all([playerPromise,gamePromise]).spread((playerResult,gameResult) => {
		game = gameResult[0];
		player = playerResult[0];
		return game.addPlayer(player) 
	}).then((results) => {
		console.log(results);	
		return res.json({
			player: player,
			game:game
		})
	})
})

app.listen(port, () => console.log(`Glory to Rome listening on port ${port}!`));