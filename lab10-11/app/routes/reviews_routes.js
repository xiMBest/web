var ObjectID = require('mongodb').ObjectID;
module.exports = function(app, db) {
  app.get('/reviews/all', (req, res) => {
    db.collection('reviews').find({}).toArray(function(err, item) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      } 
    });
  });
  app.get('/reviews/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('reviews').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      } 
    });
  });
  app.post('/reviews', (req, res) => {
    const review = { title: req.body.title, text: req.body.text, datetime: req.body.datetime };
    db.collection('reviews').insert(review, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        res.send(result.ops[0]);
      }
    });
  });
  app.delete('/reviews/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('reviews').remove(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Review ' + id + ' deleted!');
      } 
    });
  });
  app.put ('/reviews/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    const review = { title: req.body.title, text: req.body.text, datetime: req.body.datetime };
    db.collection('reviews').update(details, review, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
      } else {
          res.send(review);
      } 
    });
  });
};