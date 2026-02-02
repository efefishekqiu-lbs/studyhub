const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const cookieParser = require('cookie-parser');

const website = require('./routes/website');
const app = express();

app.set('trust proxy', 1);

app.use((req, res, next) => {
  req.setTimeout(5000);
  res.setTimeout(5000);
  next();
});

// app.use((req, res, next) => {
//   res.setHeader(
//     "Content-Security-Policy",
//     [
//       "default-src 'self'",
//       "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://code.jquery.com https://www.google.com https://www.gstatic.com",
//       "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
//       "font-src 'self' https://fonts.gstatic.com",
//       "img-src 'self' data: https://www.gstatic.com",
//       "connect-src 'self' https://www.google.com https://www.gstatic.com",
//       "frame-src https://www.google.com",
//     ].join("; ")
//   );
//   next();
// });

app.disable('x-powered-by');

const xss = require("xss-clean");

app.use(xss());

app.use('/static', express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

const websiteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/website', websiteLimiter, website);

app.get('/', (req, res) => {
  res.redirect('/website');
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// module.exports = app;