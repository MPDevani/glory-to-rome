'use strict';
//talk through this page, its not making sense
module.exports = {
  up: (queryInterface, Sequelize) => {
    let addLeaderId =  queryInterface.addColumn(
      'Games',
      'leaderId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Players',
          key: 'id'
        }
      }
    );

    let addCurrentTurnId = queryInterface.addColumn(
      'Games',
      'currentTurnId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Players',
          key: 'id'
        }
      }
    );

    return Promise.all([addLeaderId, addCurrentTurnId]);
  },
        
  down: (queryInterface, Sequelize) => {
    return Promise.all([
    queryInterface.removeColumn('Games', 'leaderId'),
    queryInterface.removeColumn('Games', 'currentTurnId')
    ]);
  }
};

// A migration is a file that exports an object.
// This object has 2 properties: up and down. Both of these properties
// need to return a promise.
// When you run db:migrate, it will run up.
// When you run db:migrate:undo, it will run down.
