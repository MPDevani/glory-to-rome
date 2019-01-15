const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const db = require('./models/index.js');
const Promise = require("bluebird");
const Game = db.Game;
const Players = db.Players;
const Deck = db.Deck;
const Hand = db.Hand;

app.use(express.static('frontend'));
app.use(express.static('dist'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post("/api/game", function(req, res) {
	let gameCode = req.body.gameCode;
	let playerName = req.body.playerName;
	let game;
	let players;

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
		players = playerResult[0];
		return game.addPlayer(players)
	}).then((results) => {
		return res.json({
			//player: player, (why is this removed?)
			game:game
		})
	})
})

app.get('/api/game/:gameId/players', (req,res)=>{
	return Game.findOne({
		where: {
			id: req.params.gameId
			}
		}).then((game)=>{
			return game.getPlayers();
		}).then((players)=> {
			return res.json({
				players:players
			})
		})
	})

app.post('/api/game/:gameId/start', (req,res) => {
	let gamePromise = Game.findOne({
		where: {
			id: req.params.gameId
		}
	});

	let gameUpdatePromise = gamePromise.then((game) => {
		game.hasStarted = true;
		return game.save()
	});

	let playersPromise = gamePromise.then((game) => {
		return game.getPlayers()
		});

	let deckCreationPromise = playersPromise.then((players) => {
		return Deck.create({
			gameId: req.params.gameId,
			cardCount: 100 - (players.length * 5)
		})
	});

	let playerInfoPromises = playersPromise.then((players) => {
		console.log("Players", players);
		let handCreationPromises = players.map((player) => {
			let handPromise = Hand.create({
				gameId: req.params.gameId,
				cardCount: 5,
				playerId: player.id
			});

			return Promise.props({ //I don't understand from this point down
				player: player,
				hand: handPromise
			});
		});

		return Promise.props(handCreationPromises);
	});

	return Promise.props({
		playerInfo: playerInfoPromises,
		deck: deckCreationPromise,
		gameStarted: gameUpdatePromise
	}).then((result) => {
		console.log("Result", result);
		res.json(result);
	});
});

app.get('/api/game/:gameId', (req,res) => {
	let gamePromise = Game.findOne({
		where: {
			id: req.params.gameId
		}
	});

	let playersPromise = gamePromise.then((game) => {
		return Promise.props({
			game: game,
			players: game.getPlayers()
		});
	}).then((results) => {
		return Promise.all(results.players.map((player) => {
			let hand;
			if (results.game.hasStarted) {
				hand = player.getHand();
			}
			return Promise.props ({
				player: player,
				hand: hand
			});
		}));
	});
	let deckPromise = gamePromise.then((game) => {
		if(game.hasStarted) {
			return game.getDeck();
		}
		return undefined;
	});
	Promise.props({
		playerInfo: playersPromise,
		game: gamePromise,
		deck: deckPromise
	}).then((results) => {
		res.json(results);
	})
})


app.get("/*", (req, res) => {
	res.sendFile(`${__dirname}/frontend/index.html`)
});


app.listen(port, () => console.log(`Glory to Rome listening on port ${port}!`));