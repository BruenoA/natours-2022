const Tour = require('../models/tourModel');
const customizedAsync = require('../utils/customizedAsync');
exports.getOverview = customizedAsync(async (req,res, next) =>{
    // Get Tour data
    const tours = await Tour.find();


    res.status(200).render('overview',{
        title: 'All Tours',
        tours
    });
});

exports.getTour = customizedAsync(async (req,res,next)=>{
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    res.status(200).render('tour', {
      title: 'The Forest Hiker Tour',
      tour 
    });
});
exports.getLogin = customizedAsync(async (req,res,next)=>{
    res.status(200).render('login', {
      title: 'Login to your account'
    });
});