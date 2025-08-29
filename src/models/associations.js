// Import all models
import User from './User.js';
import Game from './Game.js';
import GameMove from './GameMove.js';
import Ranking from './Ranking.js';
import UserSetting from './UserSetting.js';
import Notification from './Notification.js';

// Establish associations between models
const models = {
  User,
  Game,
  GameMove,
  Ranking,
  UserSetting,
  Notification
};

// Setup all associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export {
  User,
  Game,
  GameMove,
  Ranking,
  UserSetting,
  Notification
};