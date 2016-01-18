var dsConfig = require('./datasources.json');

if (process.env.CI) {
  console.log('skipping sending email from CI');
  return done();
}
var yourEmailAddress = dsConfig.emailDs.transports[0].auth.user;

app.models.Email.send({
  to: null,  // your email address
  from: null, // your email address
  subject: 'The email subject',
  text: '<strong>HTML</strong> tags are not converted'
  //html: '<strong>HTML</strong> tags are converted'
}, function(err) {
  if (err) throw err;
  console.log('> email sent successfully');
  done();
});
