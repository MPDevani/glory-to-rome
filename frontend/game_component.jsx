import ReactDOM from "react-dom";
import React from "react";
import {withRouter} from "react-router-dom";
import {Game} from "./models/game.js";
import {Player} from "./models/player.js";
import {Deck} from "./models/deck.js";

export class GameComponent extends React.Component {
	constructor(props) {
		super(props);
		this.gameId = this.props.match.params.gameId //look this up
		this.state = {
			game: undefined,
			players: undefined,
			deck: undefined
		};
		this.hasRetrievedGameInfo = false;
	}

	getGame(history){
		$.get('/api/game/' + this.gameId).then((result) => {
			let game;
			let players;
			let deck;
			game = new Game(result.game); //does new game reference the model?

			if(!game.hasStarted) {
				history.push('/game/' + result.game.id + '/pending');
				return
			}

			players = result.playerInfo.map((playerInfo) => {
				return new Player(playerInfo.player, playerInfo.hand);
			})
			deck = new Deck(result.deck);

			this.hasRetrievedGameInfo = true;

			this.setState({
				game: game,
				players: players,
				deck: deck
			})
		});
	}

	render() {
		let ShowGameComponent = withRouter(({history}) => {
			if(!this.hasRetrievedGameInfo) {
				this.getGame(history)
				return(<div>
						<h1>Loading...</h1>
					</div>);
			}
			return (
				<div>
					<h1>Game: {this.state.game.gameCode} has started!</h1>
				</div>
				)
		});

		return <ShowGameComponent />
	}

}