const Tour = require('../models/tourModel');
const customizedAsync = require('../utils/customizedAsync');
exports.getOverview = customizedAsync(async (req,res, next) =>{
    // Get Tour data
    const tours = await Tour.find();
    // Build Template
    // Render Template
    res.status(200).render('overview',{
        title: 'All Tours',
        tours
    });
});

exports.getTour = (req,res)=>{
    res.status(200).render('tour', {
      title: 'The Forest Hiker Tour' 
    });
};