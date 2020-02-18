const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');



const lessionRouter = require('./routes/lession');

const courseRouter = require('./routes/course');

const jwt = require('jsonwebtoken');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const auth = require('./routes/auth');
const redis = require('redis');
const redisClient = redis.createClient();
const redisStore = require('connect-redis')(session);
const multer = require('multer');



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
app.use('/api', lessionRouter);
app.use('/api',courseRouter)

// Multer upload img
// Route này trả về cái form upload cho client
app.get("/upload", (req, res) => {
  res.sendFile(path.join(`${__dirname}/views/master.html`));
});

// Khởi tạo biến cấu hình cho việc lưu trữ file upload
let diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Định nghĩa nơi file upload sẽ được lưu lại
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
    // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
    let math = ["image/png", "image/jpeg"];
    if (math.indexOf(file.mimetype) === -1) {
      
      let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
      return callback(errorMess, null);
    }
    // Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
    let filename = `${Date.now()}${file.originalname}`;
    callback(null, filename);
  }
});

// Khởi tạo middleware uploadFile với cấu hình như ở trên,
// Bên trong hàm .single() truyền vào name của thẻ input, ở đây là "file"
let uploadFile = multer({ storage: diskStorage }).single("file");

// Route này Xử lý khi client thực hiện hành động upload file
app.post("/upload", (req, res) => {
  // Thực hiện upload file, truyền vào 2 biến req và res
  uploadFile(req, res, (error) => {
    // Nếu có lỗi thì trả về lỗi cho client.
    // Ví dụ như upload một file không phải file ảnh theo như cấu hình của mình bên trên
    if (error) {
      console.log(error);
      return res.send(`Error when trying to upload: ${error}`);
    }
    console.log('file.mimetype: ', req.file.mimetype);
    // Không có lỗi thì lại render cái file ảnh về cho client.
    // Đồng thời file đã được lưu vào thư mục uploads
    res.json({
      message: `${req.file.filename} has been upload`
    })
    console.log(`${req.file.filename} success`);
    // res.sendFile(path.join(`${__dirname}/uploads/${req.file.filename}`));
  });
});

app.get('/token', async (req, res, next) => {
  try {
    const token = await jwt.sign(req.session.passport, 'your_jwt_secret');
    res.json({ token });
  } catch (error) {
    console.log(error);
  }
});


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
