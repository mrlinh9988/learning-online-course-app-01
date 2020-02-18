const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const auth = require('./routes/auth');
const redis = require('redis');
const redisClient = redis.createClient();
const redisStore = require('connect-redis')(session);


require('./configs/passport')(passport);

const app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(session({
  secret: 'linh',
  name: 'abc',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Note that the cookie-parser module is no longer needed
  store: new redisStore({ host: 'redis://127.0.0.1', port: 6379, client: redisClient, ttl: 86400 })
}));


// app.use(session({
//   secret: 'linh',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false }
// }));


app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', auth);


app.get('/token', async (req, res, next) => {
  try {
    const token = await jwt.sign(req.session.passport, 'your_jwt_secret');
    res.json({ token });
  } catch (error) {
    console.log(error);
  }
});

app.get('/abc', (req, res) => {
  res.json(req.session.passport)
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
