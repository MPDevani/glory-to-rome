import ReactDOM from 'react-dom'
import React from 'react'
import {withRouter} from 'react-router-dom'

export class GamePendingComponent extends React.Component {
	constructor(props) {
		super(props);
		this.gameId = this.props.match.params.gameId;//explain this
		this.state = {players: undefined};
		this.playersFound = false;
		this.startGame = this.startGame.bind(this);
	}

	searchForPlayers(){
		$.get('/api/game/' + this.gameId + '/players').then((result) =>{
			this.playersFound = true;
			this.setState({players: result.players})

		})
	}

	startGame(event, history){
		event.preventDefault();
		$.post('/api/game/' + this.gameId + '/start').then((result) => {
			history.push(/game/ + result.game.id); //explain this
		});
	}

	render(){
		if (!this.playersFound) {
			this.searchForPlayers();
			return <h1>Loading...</h1>
		} else {
			let playersList = this.state.players.map((player) => {
				return (<li key={player.id}> {player.username}</li>
				)});
				let PendingComponent = withRouter(({history}) => (<div>
					<h1>Game Has Not Started Yet</h1>
					<h3>Players:</h3>
					<ul>
						{playersList}
					</ul>
					<form onSubmit={(event) => this.startGame(event, history)}>
						<input type='submit' name='submit' value='Start Game' />
					</form>
				</div>))
				return <PendingComponent />;
		}
	}
};