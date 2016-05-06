// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-example-app-logic
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

module.exports = function() {
  return function datetime(req, res, next) {
    console.log('Date time middleware triggered.');

    res.json({datetime: new Date()});
  };
};
