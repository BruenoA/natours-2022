const customizedAsync = require('../utils/customizedAsync');
const AppError = require('../utils/appError');

exports.getOne = (Model, populateOptions) => {
  return customizedAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError(`Document ID ${req.params.id} not found`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });
};

exports.updateOne = (Model) => {
  return customizedAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`Document ID ${req.params.id} not found`, 404));
    }

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });
};

exports.createOne = (Model) => {
  return customizedAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });
};

exports.deleteOne = (Model) => {
  return customizedAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError(`Document ID ${req.params.id} not found`, 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};
