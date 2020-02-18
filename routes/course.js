const express = require('express');
const router = express.Router();
const CourseModel = require('../models/Course');

//http://localhost:3000/api/course


//show course 
router.get('/course', async (req, res, next) => {
    try {
        const course = await CourseModel.find();
        console.log(course);
        res.json(course)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
});

//create course
router.post('/course', async (req, res) => {
    console.log(req.body);
    await CourseModel.create(req.body, function (err, course) {
        console.log(course);
        if (err) throw err;
        res.json({
            status: 200,
            message: "Create Course"
        });
    });

});

//update course 
router.put('/course/:id', async (req, res) => {
    await CourseModel.findByIdAndUpdate(req.params.id, { $set: req.body }), function (err, course) {
        if (err) throw err;
        res.json({
            status: 200,
            message: "Update successfully!"
        });
    }


});

//delete course
router.delete('/course/:id', async (req, res) => {
    await CourseModel.findByIdAndRemove(req.params.id, function (err) {
        if (err) throw err;
        res.json({
            status: 200,
            message: "Deleted successfully!"
        });
    })
});

module.exports = router;