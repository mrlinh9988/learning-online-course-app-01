const express = require('express');
const router = express.Router();
const LessionModel = require('../models/Lession');
const checkToken = require('../middleware/checkToken');

//http://localhost:3000/api/lession/:id

router.use(checkToken);
//show lession 
router.get('/lession', async (req, res, next) => {
  if (req.type === 1) {
    try {
      const lession = await LessionModel.find();
      console.log(lession);
      res.json(lession)
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

//add lession 
router.post('/lession', async (req, res) => {
  if (req.type === 1) {
    const LessionNew = await LessionModel(req.body);
    LessionNew
      .save()
      .then(result => {

        res.json({
          status: 200,
          message: "Thành Công",

          createdProduct: result
        });
      })
      .catch(err => {
        res.json({
          status: 500,
          error: err,
          message: "Lỗi"
        });
      });
  } else {
    res.json({
      message: 'You can not use this feature'
    });
  }
});


//update lession
router.put('/lession/:id', async (req, res) => {
  if (req.type === 1) {
    await LessionModel.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, lession) {
      if (err) return next(err);
      res.json({
        status: 200,
        message: "lession udpated."
      });
    });
  } else {
    res.json({
      message: 'You can not use this feature'
    });
  }
});

//delete lession
router.delete('/lession/:id', async (req, res) => {
  if (req.type === 1) {
    await LessionModel.findByIdAndRemove(req.params.id, function (err) {
      if (err) return next(err);
      res.json({
        status: 200,
        message: "Deleted successfully!"
      });
    })
  } else {
    res.json({
      message: 'You can not use this feature'
    });
  }
});


module.exports = router;