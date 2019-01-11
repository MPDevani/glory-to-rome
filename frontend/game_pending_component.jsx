import ReactDOM from 'react-dom'
import React from 'react'

export class GamePendingComponent extends React.Component {
	constructor(props) {
		super(props);
		this.gameId = this.props.match.params.gameId;
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

	startGame(event){
		event.preventDefault();
		$.post('/api/game/' + this.gameId + '/start').then((result) => {
			console.log(result);
		});
	}

	render(){
		if (!this.playersFound) {
			this.searchForPlayers();
			return <h1>Loading...</h1>
		} else {
			console.log(this.state.players);
			let playersList = this.state.players.map((player) => {
				return (<li key={player.id}> {player.username}</li>
				)});
				console.log('Playerslist', playersList);
				let result = (<div>
					<h1>Game Has Not Started Yet</h1>
					<h3>Players:</h3>
					<ul>
						{playersList}
					</ul>
					<form onSubmit={this.startGame}>
						<input type='submit' name='submit' value='Start Game' />
					</form>
				</div>)
				return result;
		}
	}
};