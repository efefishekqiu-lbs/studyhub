const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const website = require('./routes/website');
// här man initializera express()
const app = express();

// blockar snabb requester
app.use((req, res, next) => {
  req.setTimeout(5000);
  res.setTimeout(5000);
  next();
});

app.disable('x-powered-by');

app.use('/static', express.static(path.join(__dirname, 'public')));

// vi lägger view engine till ejs så att den går enkel att hosta frontend från backend endpoints
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middlewares 
app.use(bodyParser.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.use('/website', website);

// i starten så redirectas användaren till dashboard endpointen och den renderar landningPage.ejs
app.get('/', (req, res) => {
  res.redirect("dashboard")
});
app.get('/dashboard', (req, res) => {
  res.render("landingPage")
});

// Koder för att starta localhost nodemon men man behöver inte dem när man hostar i vercel för att vercel är serverless
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
module.exports = app;