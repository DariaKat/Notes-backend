const localRoutes = require('./routes');
module.exports = function (app, db) {
  localRoutes(app, db);
};