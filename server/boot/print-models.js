module.exports = function(app) {
  var models = [];

  Object.keys(app.models).forEach(function(model) {
    var modelName = app.models[model].modelName;

    if (models.indexOf(modelName) === -1)
      models.push(modelName);
  });

  console.log('Models: ', models);
};
