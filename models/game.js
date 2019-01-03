'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    gameCode: DataTypes.STRING
  }, {});

  Game.associate = function(models) {
    // associations can be defined here
    Game.hasMany(models.Players, {foreignKey: 'gameId'})
  };

  return Game;
};