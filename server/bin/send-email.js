// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-example-app-logic
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var dsConfig = require('../datasources.json');
var app = require('../server.js');

if (process.env.CI) {
  console.log('skipping sending email from CI');
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
});
