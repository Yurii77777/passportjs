const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

require('dotenv').config();

import { authToken } from './middleware/token';

const port = process.env.PORT || 3080;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    if (jwtPayload.sub === 'user_01') {
      done(null, { id: 'user_01' });
    } else {
      done(null, false);
    }
  }),
);

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'user_01' && password === 'qwertY123') {
    const token = jwt.sign({ sub: 'user_01' }, process.env.JWT_SECRET);

    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Using passport middleware
// app.get('/api/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
//   res.json({ message: 'Well done! Come in!' });
// });

// Using custom middleware
app.get('/api/protected', authToken, (req, res) => {
  res.json({ message: 'Well done! Come in!' });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
