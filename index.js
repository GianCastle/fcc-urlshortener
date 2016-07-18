const express = require('express');
const mongoose = require('mongoose');
const app = express();

const URL = mongoose.model('URL', {
  original_url : String,
  short_url    : Number,
});

mongoose.connect('mongodb://localhost/urlshort');
app.set('view engine', 'pug');
app.get('/', (req, res, next) => res.render('index'));
app.get('/new', function(req, res, next) {
  const requestURL = req.query.q;
  const urlRegex =  "^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-‌​\.\?\,\'\/\\\+&amp;%\$#_]*)?$";

  if(requestURL.match(urlRegex)) {
    const url = new URL({
      original_url: requestURL,
      short_url: Math.floor((Math.random() * 10000) + 1)
    });
    url.save(function(error) {
        res.json((error)
        ? { error: 'There was an error saving the URL' }
        : url)
    });
  } else {
    res.json({
      error: 'Not a valid URL'
    });
  }
});

app.get('/:number', function(req, res, next) {
  const number = req.params.number;
 URL.findOne({
    short_url: number
  }).exec((err, url) => {
    if(err)
      res.json(err);
    else if (!url)
      res.json({error: 'Not found'});
    else
      res.redirect(url.original_url);
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('The server is running');
});
