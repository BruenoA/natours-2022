const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const customizedAsync = require('../utils/customizedAsync');
const AppError = require('../utils/appError')

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

    if(!tour){
        return next(new AppError('There is no tour with that name.',404));
    }


    res.status(200).render('tour', {
      title: 'The Forest Hiker Tour',
      tour 
    });
});


exports.getLogin =  (req,res)=>{
    res.status(200).render('login', {
      title: 'Login to your account'
    });
};

exports.getAccount  =  (req,res)=>{
    res.status(200).render('account', {
      title: 'Your account'
    });
};

exports.updateUserData = customizedAsync(async (req,res,next)=>{
    const updateUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email
        },
        {
            new: true,
            runValidators:true
        }
    );
    res.status(200).render('account', {
        title: 'Your account',
        user: updateUser
      });
});