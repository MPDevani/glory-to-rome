import ReactDOM from 'react-dom'
import React from 'react'
import {BrowserRouter, Route, Switch} from'react-router-dom'
import {IntroComponent} from './intro_component.jsx'
import {GamePendingComponent} from './game_pending_component.jsx'
import {GameComponent} from './game_component.jsx'
import {LogoutComponent} from './logout_component.jsx'


class GloryToRomeApp extends React.Component {
	render() {
		return <BrowserRouter>
			<div>
				<LogoutComponent />
				<Switch>
					<Route path="/" exact component={IntroComponent} />
					<Route path="/game/:gameId/pending" component={GamePendingComponent} />
					<Route path="/game/:gameId/" component={GameComponent} />
				</Switch>	
			</div>
		</BrowserRouter>
	}
}

ReactDOM.render(<GloryToRomeApp />, document.getElementById('glory-to-rome-container'));