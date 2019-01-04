const {BrowserRouter, Route} = ReactRouterDOM;

class GloryToRomeApp extends React.Component {
	render() {
		return <BrowserRouter>
			<div>
				<Route path="/" exact component={IntroComponent} />
				<Route path="/game/:gameId" component={GamePendingComponent} />
			</div>
		</BrowserRouter>
	}
}

ReactDOM.render(<GloryToRomeApp />, document.getElementById('glory-to-rome-container'));