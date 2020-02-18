const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');


const lessionRouter = require('./routes/lession');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const auth = require('./routes/auth');
const courseRouter = require('./routes/course');

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
app.use(session({
  secret: 'linh',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', auth);
app.use('/api', lessionRouter);
app.use('/api',courseRouter)


app.get('/info', (req, res, next) => {
  console.log(req.session);
  res.json(req.session.passport);
})

// app.get('/auth/facebook',
//   passport.authenticate('facebook', { scope: ['user_birthday', 'user_friends', 'public_profile', 'email', 'user_age_range', 'user_gender', 'user_hometown', 'user_likes', 'user_link', 'user_location', 'user_photos', 'user_posts', 'user_status', 'user_tagged_places', 'user_videos'] }));

// // app.get('/auth/facebook/callback',
// //   passport.authenticate('facebook', { failureRedirect: '/login' }),
// //   function (req, res) {

// //     res.redirect('/info');
// //   });

// app.get('/auth/facebook/callback', (req, res, next) => {
//   passport.authenticate('facebook', (err, user, next) => {
//     console.log(user);
//     clientRedis.set('userId', user);
//     res.json({ userId: user });
//   })(req, res, next);
// });

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
