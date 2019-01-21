export class Player {
	constructor(playerObject, handObject) {
		this.id = playerObject.id;
		this.username = playerObject.username;
		if (handObject) {
			this.hand = {
				cardCount: handObject.cardCount
			};
		}
	}
} 