const reviewsRoutes = require('./reviews_routes');
const newsRoutes = require('./news_routes');
const pageRoutes = require('./page_routes');
module.exports = function(app, db) {
  reviewsRoutes(app, db);
  newsRoutes(app, db);
  pageRoutes(app, db);
};