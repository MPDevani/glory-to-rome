import React from 'react';

export class DeckComponent extends React.Component {
	render() {
		return <h2>{this.props.deck.cardCount} Cards Remaining!</h2>
	}
}