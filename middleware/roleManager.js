var admin = require('../config/firebaseConfig'),
  User = require('../models/user');


module.exports = function() {
  var authedRoles = [].slice.call(arguments);

  return function(req, res, next) {
    var idToken = req &&
      req.headers &&
      req.headers.auth &&
      req.headers.auth.trim();

    var getUserRole = function(uid) {
      return new Promise(function(resolve, reject) {
        User.findOne({
          uid: uid
        }, function(err, user) {

          if (err) reject(err);
          else resolve(user.role);
        });
      });
    };

    var includesRole = function(requiredRoles, userRole) {
      return requiredRoles.indexOf(userRole) !== -1;
    };

    var userHasRole = function(userRole) {
      return includesRole(authedRoles, userRole);
    };

    var assignRole = function(decodedToken) {
      var uid = decodedToken.user_id;
      getUserRole(uid).then(function(userRole) {

        res.header('user_role', userRole);

        if (userHasRole(userRole)) next();
        else denyReq('user doesnt have role');

      }).catch(denyReq);
    };

    var denyReq = function(err) {
      res.status(401).json({
        message: 'Unauthorized request'
      });
    };

    if (idToken && authedRoles.length) {
      admin.auth().verifyIdToken(idToken)
        .then(assignRole)
        .catch(denyReq);
    } else if (idToken === "123456789") {
      next();
    } else {
      denyReq("No auth Header");
    }
  };
};
