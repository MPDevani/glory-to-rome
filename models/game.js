'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    gameCode: DataTypes.STRING
  }, {});

  Game.associate = function(models) {
    // associations can be defined here
    //talk through this again
    Game.hasMany(models.Players, {foreignKey: 'gameId'})
    Game.hasOne(models.Deck, {foreignKey: 'gameId'});
    Game.hasMany(models.Hand, {foreignKey: 'gameId'});
    // What I want:
    //    game.setLeader or game.getLeader
    //    game.setCurrentTurn
    //    I know that there's a 1 to 1 relationship between game and player for each of these.
    //    I can use either hasOne or belongsTo
    //        hasOne requires foreign key to be in player table
    //        belongsTo requires foreign key to be in game table <-- this is our situation
    Game.belongsTo(models.Players, {as: 'leader', foreignKey: 'leaderId'});
    Game.belongsTo(models.Players, {as: 'currentTurn', foreignKey: 'currentTurnId'});
   };
  

  return Game;
};