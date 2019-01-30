import React from 'react';

export class PlayerComponent extends React.Component {
	render() {
		return (<div>
			<h4> Username: {this.props.player.username}</h4>
			<p>Cards in hand: {this.props.player.hand.cardCount}</p>
			</div>)
	}
}