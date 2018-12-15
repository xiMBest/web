var ObjectID = require('mongodb').ObjectID;
var _dirname = 'C:/Users/ProBook/Desktop/web';
module.exports = function(app, db) {
  app.get('/', (req, res) => {
    res.sendFile(_dirname + '/index.html');
  });
  app.get('/index.html', (req, res) => {
    res.sendFile(_dirname + '/index.html');
  });
  app.get('/admin.html', (req, res) => {
    res.sendFile(_dirname + '/admin.html');
  });
  app.get('/contacts.html', (req, res) => {
    res.sendFile(_dirname + '/contacts.html');
  });
  app.get('/fans.html', (req, res) => {
    res.sendFile(_dirname + '/fans.html');
  });

  app.get('/news.html', (req, res) => {
    res.sendFile(_dirname + '/news.html');
  });
  app.get('/bowling_clubs.html', (req, res) => {
    res.sendFile(_dirname + '/bowling_clubs.html');
  });
};