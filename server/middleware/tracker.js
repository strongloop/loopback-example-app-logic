module.exports = function() {
  return function tracker(req, res, next) {
    console.log('Request tracking middleware triggered on %s.', req.url);

    var start = process.hrtime();

    res.once('finish', function() {
      var diff = process.hrtime(start);
      var ms = diff[0] * 1e3 + diff[1] * 1e-6;

      console.log('The request processing time is %d ms.', ms);
    });

    next();
  };
};
