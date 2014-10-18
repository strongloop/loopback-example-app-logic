module.exports = function(req, res, next) {
  console.log('pre-processing middleware triggered');
  console.log(new Date());
  next();
};
