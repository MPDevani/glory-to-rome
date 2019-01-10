const {BrowserRouter, Route, Switch} = ReactRouterDOM;

class GloryToRomeApp extends React.Component {
	render() {
		return <BrowserRouter>
			<div>
			<Switch>
				<Route path="/" exact component={IntroComponent} />
				<Route path="/game/:gameId" component={GamePendingComponent} />
			</Switch>	
			</div>
		</BrowserRouter>
	}
}

ReactDOM.render(<GloryToRomeApp />, document.getElementById('glory-to-rome-container'));