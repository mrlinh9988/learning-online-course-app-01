const express = require('express');
const router = express.Router();
const CourseModel = require('../models/Course');
const checkToken = require('../middleware/checkToken');

router.use(checkToken);

//http://localhost:3000/api/course

//show course 
router.get('/course', async (req, res, next) => {
    if (req.type === 1) {
        try {
            const course = await CourseModel.find();
            console.log(course);
            res.json(course)
        } catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    } else {
        res.json({
            message: 'You can not use this feature'
        })
    }
});

//create course
router.post('/course', async (req, res) => {
    if (req.type === 1) {
        await CourseModel.create(req.body, function (err, course) {
            if (err) throw err;
            res.json({
                status: 200,
                message: "Create Course"
            });
        });
    } else {
        res.json({
            message: 'You can not use this feature'
        })
    }
});

//update course 
router.put('/course/:id', async (req, res) => {
    if (req.type === 1) {
        await CourseModel.findByIdAndUpdate(req.params.id, { $set: req.body }), function (err, course) {
            if (err) throw err;
            res.json({
                status: 200,
                message: "Update successfully!"
            });
        }
    } else {
        res.json({
            message: 'You can not use this feature'
        })
    }
});

//delete course
router.delete('/course/:id', async (req, res) => {
    if (req.type === 1) {
        await CourseModel.findByIdAndRemove(req.params.id, function (err) {
            if (err) throw err;
            res.json({
                status: 200,
                message: "Deleted successfully!"
            });
        })
    } else {
        res.json({
            message: 'You can not use this feature'
        })
    }
});

module.exports = router;