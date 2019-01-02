'use strict';
module.exports = (sequelize, DataTypes) => {
  const Players = sequelize.define('Players', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: DataTypes.STRING
  }, {});
  Players.associate = function(models) {
    // associations can be defined here
  };
  return Players;
};