const withRouter = ReactRouterDOM.withRouter;

const GAME_CODE_ID = "gameCodeInputIdentifier";
const PLAYER_NAME_ID = 'playerNameInputIdentifier';

class IntroComponent extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event, history) {
		event.preventDefault();
		let gameCode = document.getElementById(GAME_CODE_ID).value;
		let playerName = document.getElementById(PLAYER_NAME_ID).value;
		let payload = {
				gameCode: gameCode,
				playerName: playerName
		}

		$.post("/game", payload).then((result)=>{ //what would get passed into result
			console.log(result);
			history.push("/game/" + result.game.id);
			})
	}

	render() {
		let GameCodeForm = withRouter(({ history }) => (
		<div>
			<form onSubmit={(event) => this.handleSubmit(event, history)}>
				<label>
					Player Name:
					<input type='text' name='playerName' id={PLAYER_NAME_ID} />
				  	Code:
				  	<input type="text" name="gameCode" id={GAME_CODE_ID} />
				 </label>	
				 	<input type="submit" value="Submit" />
			</form>
		</div>));

		return <GameCodeForm />;
	}
}