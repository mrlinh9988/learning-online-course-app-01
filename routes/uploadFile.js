const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
});

// Init upload
const upload = multer({
    storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

// check file type
function checkFileType(file, cb) {
    // allow extension
    const filetypes = /jpeg|jpg|png|gif/;
    // check extension (Kết quả trả về là true hoặc false)
    // regex.test(string) : test xem 1 chuỗi regex có thuộc 1 string nào không
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // check mime type
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only')
    }
}

router.post('/', (req, res) => {
    upload(req, res, (err) => {
        console.log(req.file);
        if (err) {
            console.log(err);
            return res.render('index', { msg: err });
            // return res.json({ message: err });
        } else {
            if (!req.file) {
                return res.render('index', { msg: 'Error: No file selected' });
                // return res.json({ message: 'Error: No file selected' });
            }

            return res.render('index', { msg: 'File uploaded', file: `uploads/${req.file.filename}` });
            // return res.json({ file: `uploads/${req.file.filename}` });
        }
    });
});


module.exports = router;


