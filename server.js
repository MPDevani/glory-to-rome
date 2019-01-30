const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const db = require('./models/index.js');
const Promise = require("bluebird");
const Game = db.Game;
const Players = db.Players;
const Deck = db.Deck;
const Hand = db.Hand;
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const gameLib = require('./lib/game.js').getInstance(db);

app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(express.static('frontend'));
app.use(express.static('dist'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// DONE
//where are you getting user from?  
//Where is this documentation on passport site
//Talk through cookies below

// TODO
//Help with google client id and secret
//explain sessions in more detail, why are they necessary
//is this all done in a specific order and why?
//why is google auth last
// TODO(shehzan): Teach Maria about external APIs

const isLoggedIn = (req, res, next) => {
	if(req.user) { 
		console.log("Already logged in!", req.user);
		return next();
	} else {
		console.log("Trying to log in now");
		res.cookie('redirect_url', req.path);
		res.redirect('/login')	

	}
};

app.get('/login', (req, res) => {
	if(req.user){
		console.log("Already logged in!", req.user);
		let path = req.cookies.redirect_url || '/'
		res.redirect(path);
	}
	res.sendFile(`${__dirname}/frontend/login.html`)
})

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
  	  console.log('Logged In!', profile);
      Players.findOrCreate({where: {
      	username: profile.id 
      }}).then((playerInfo)=> {
      	return done(null, playerInfo[0])//why is 0 needed?
      }) 
   }));   	
    
passport.serializeUser((player, done) => { //how is this being hit?
  done(null, player.id);
});

passport.deserializeUser((id, done) => {
  Players.findById(id).then((player)=> {
  	done(null, player)
  })    
});

app.get('/logout', (req,res)=>{
	req.logout();//where is this function coming from?
	res.redirect('/login');
})  

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
  let path = req.cookies.redirect_url || '/' //why did we add this line?	
    res.redirect('/');
  });

app.post("/api/game", function(req, res) {
	let gameCode = req.body.gameCode;
	let playerName = req.body.playerName;
	let game;
	let players;

	let playerPromise = Players.findOrCreate({
		where: {
			username: playerName
		}
	})

	let gamePromise = Game.findOrCreate({
		where: {
	    	gameCode: gameCode
	    }
	});

	return Promise.all([playerPromise,gamePromise]).spread((playerResult,gameResult) => {
		game = gameResult[0];
		players = playerResult[0];
		return game.addPlayer(players)
	}).then((results) => {
		return res.json({
			//player: player, (why is this removed?)
			game:game
		})
	})
})

app.get('/api/game/:gameId/players', (req,res)=>{
	return Game.findOne({
		where: {
			id: req.params.gameId
			}
		}).then((game)=>{
			return game.getPlayers();
		}).then((players)=> {
			return res.json({
				players:players
			})
		})
	})

app.post('/api/game/:gameId/start', (req,res) => {
	let gameId = req.params.gameId;

	gameLib.startGame(gameId).then((results) => {
		res.json(results);
	})	

});

app.get('/api/game/:gameId', (req,res) => {
	let gamePromise = Game.findOne({
		where: {
			id: req.params.gameId
		}
	});

	let playersPromise = gamePromise.then((game) => {
		return Promise.props({
			game: game,
			players: game.getPlayers()
		});
	}).then((results) => {
		return Promise.all(results.players.map((player) => {
			let hand;
			if (results.game.hasStarted) {
				hand = player.getHand();
			}
			return Promise.props ({
				player: player,
				hand: hand
			});
		}));
	});
	let deckPromise = gamePromise.then((game) => {
		if(game.hasStarted) {
			return game.getDeck();
		}
		return undefined;
	});
	Promise.props({
		playerInfo: playersPromise,
		game: gamePromise,
		deck: deckPromise
	}).then((results) => {
		res.json(results);
	})
})


app.get("/*", isLoggedIn, (req, res) => {
	res.sendFile(`${__dirname}/frontend/index.html`)
});


app.listen(port, () => console.log(`Glory to Rome listening on port ${port}!`));