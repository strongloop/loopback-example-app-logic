var dsConfig = require('../datasources.json');

module.exports = function(app, done) {
  var yourEmailAddress = dsConfig.emailDs.transports[0].auth.user;

  app.models.Email.send({
    to: yourEmailAddress,    
    from: yourEmailAddress,
    subject: 'The email subject',
    text: '<strong>HTML</strong> tags are not converted'
    //html: '<strong>HTML</strong> tags are converted'
  }, function(err) {
    if (err) throw err;
    console.log('> email sent successfully');
    done();
  });
};
