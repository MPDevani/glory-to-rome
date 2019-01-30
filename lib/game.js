const Promise = require('bluebird');

let gameModuleInstance;
let Game;
let Player;
let Deck;
let Hand;

class GameModule {
	constructor(db) {
		Game = db.Game;
		Player =db.Player;
		Deck = db.Deck;
		Hand = db.Hand;
	}

	static getInstance(...args) {
		if(!gameModuleInstance){
			gameModuleInstance = new GameModule(...args);
		}

		return gameModuleInstance;
	}

	startGame(gameId){
		let gamePromise = Game.findOne({
			where: {
				id: gameId
			}
		})

		let gameUpdatePromise = gamePromise.then((game)=>{
			game.hasStarted = true;
			return game.save();
		});

		let playerPromise = gamePromise.then((game) =>{
			return game.getPlayers()
		});

		let deckCreationPromise = playersPromise.then((players)=> {
			return Deck.create({
				gameId: gameId,
				cardCount: 100 - (players.length * 5)
			})
		})

		let playerInfoPromises = playersPromise.then((players)=>{
			let handCreationPromises = players.map((player) =>{
				let handPromise = hand.create({
					gameId: gameId,
					cardCount: 5,
					playerId: player.id
				})
				return Promise.props({
					player: player,
					hand: handPromise
				})
			})

			return Promise.all(handCreationPromises);
		})

		return Promise.props({
			playerInfo: playerInfoPromises,
			deck: deckCreationPromise,
			game: gameUpdatePromise
		})
	}

}

module.exports = GameModule;	
