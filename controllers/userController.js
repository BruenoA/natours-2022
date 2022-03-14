const User = require('../models/userModel');
const customizedAsync = require('../utils/customizedAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el) && obj[el]) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateMe = customizedAsync(async (req, res, next) => {
  if (req.body.password || req.body.password) {
    return next(
      new AppError('Wrong route. Please consider /updateMyPassword', 400)
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = customizedAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({
    status: 'success',
    data: undefined,
  });
});

exports.getAllUsers = customizedAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});
