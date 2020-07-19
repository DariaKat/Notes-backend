const cloudRoutes = require('./routes');
module.exports = function (app, db) {
  cloudRoutes(app, db);
};