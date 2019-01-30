import React from 'react';

export class GameTitleComponent extends React.Component {
	render() {
		return <h1>Game: {this.props.game.gameCode} has started! </h1>
	}
}