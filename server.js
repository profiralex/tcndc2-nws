const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

const app = express();

const maintenance = false;

hbs.registerPartials(`${__dirname}/views/partials`)
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  if (maintenance) {
    res.render('maintenance.hbs');
  } else {
    next();
  }
});

app.use((req, res, next) => {
  const now = new Date();
  const log = `${now.toISOString()}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', err => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

hbs.registerHelper('getCurrentYear', () => new Date().getFullYear())

hbs.registerHelper('screamIt', (text) => text.toUpperCase());

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website',
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects Page',
  });
});

app.get('/bad', (req, res) => {
  res.send({errorMessage: 'Unable to handle request'});
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
