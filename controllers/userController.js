const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const customizedAsync = require('../utils/customizedAsync');
const AppError = require('../utils/appError');
const Factory = require('./controllerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')){
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer( {
  storage: multerStorage,
  fileFilter: multerFilter
} );

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next)=>{
  if (!req.file) return next();
  
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  
  sharp(req.file.buffer).resize(500, 500)
                                  .toFormat('jpeg').jpeg({quality: 90 })
                                  .toFile(`public/img/users/${req.file.filename}`);
  next();
}
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el) && obj[el]) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = customizedAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('Wrong route. Please consider /updateMyPassword', 400)
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');
  if(req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    }
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
  let users;
  console.log(req.query.role);
  if (req.query.role) {
    users = await User.find({ role: req.query.role });
  } else {
    users = await User.find();
  }

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.getUser = Factory.getOne(User);
exports.deleteUser = Factory.deleteOne(User);
exports.updateUser = Factory.updateOne(User);
