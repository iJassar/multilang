const createError = require('http-errors');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const session = require('express-session');

const indexRouter = require('./routes/index');

const app = express();


// Session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

const db = 'mongodb://localhost:27017/multilangtut'
// Connect DB
mongoose.connect(db,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=>{
  console.log('connected to: '+db)
}).catch((err)=>{
  console.log(err.message);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// Global variables and sessions
app.use((req,res,next)=>{
  app.locals.siteTitle = 'THE BLOG!';
  req.session.lang = (req.query.lang)? req.query.lang:req.session.lang; 
  next();
})

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;