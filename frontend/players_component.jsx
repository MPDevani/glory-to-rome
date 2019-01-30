import React from 'react'
import {PlayerComponent} from './player_component.jsx';

export class PlayersComponent extends React.Component {
	render() {
		console.log (this.props.players);
		let playersComponent = this.props.players.map((player) => {
			return <PlayerComponent player={player} key={player.id} />
		})

		return (<div>
					<h2>Players:</h2>
					{playersComponent}
				</div>)
	}
}