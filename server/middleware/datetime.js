module.exports = function() {
  return function datetime(req, res, next) {
    console.log('Date time middleware triggered.');

    res.json({datetime: new Date()});
  };
};
