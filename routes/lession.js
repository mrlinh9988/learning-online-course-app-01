const express = require('express');
const router = express.Router();
const LessionModel = require('../models/Lession');

//http://localhost:3000/api/lession/:id


//show lession 
router.get('/lession', async (req, res, next) => {
      try {
      const lession = await LessionModel.find();
      console.log(lession);
      res.json(lession)
    } catch (error) {
      console.log(error);
      res.status(500).json(error)
    }  
  });

//add lession 
router.post('/lession',async (req, res) => {

const LessionNew = await LessionModel({
    title: req.body.title,
    content: req.body.content,
    solution: req.body.solution
  });
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


});


//update lession
router.put('/lession/:id',async (req, res) =>{

 await LessionModel.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err,lession ) {
    if (err) return next(err);
     res.json({ status: 200,
      message: "lession udpated."});
});

}  );

//delete lession
router.delete('/lession/:id',async (req, res) =>{
  await LessionModel.findByIdAndRemove(req.params.id, function (err) {
    if (err) return next(err);
    res.json({ status: 200,
      message: "Deleted successfully!"});
})
} );
  

module.exports = router;