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
		return game.addPlayer(players)//where are you getting addplayer from? 
	}).then((results) => {
		return res.json({
			//player: player, (why is this removed?)
			game:game
		})
	})
})

app.get('/game/:gameId/players', (req,res)=>{
	return Game.findOne({
		where: {
			id: req.params.gameId
			}
		}).then((game)=>{
			return game.getPlayers();//explain where get players is coming from
		}).then((players)=> {
			return res.json({
				players:players
			})
		})
	})








app.listen(port, () => console.log(`Glory to Rome listening on port ${port}!`));