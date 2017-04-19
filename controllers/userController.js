var User = require('../models/user.js');
var sendmail = require('sendmail')({
  silent: true
});

// Updates a spartan with new info
function updateSpartan(req, res) {
  User.findByIdAndUpdate(
    req.params.id,
    req.body, {
      new: true
    },
    function(err, spartan) {
      if (err) return res.status(500).json({
        error: error
      });
      res.status(200).json(spartan);
    });
}

// Create a new user
function createUser(req, res) {
  var placeholder = require('../models/spartanPlaceholder.json');
  var userProfile = {};

  if (req.body.role !== 0) {
    userProfile = req.body.profile;
  } else {
    userProfile = Object.assign({}, placeholder, req.body.profile);
  }

  var userObj = {
    uid: req.body.uid,
    role: req.body.role,
    profile: userProfile
  };

  User.create(userObj, function(error, user) {
    if (error) return res.status(500).json({
      error: error
    });
    console.log("error", error);
    console.log("user", user);
    res.status(201).json(user);
  });
}

// Create a new spartan
function getSpartans(req, res) {
  var acceptableFields = ['stream', 'skills'];

  var filteredQuery = acceptableFields.filter(function(field) {
    return (field === Object.keys(req.query)[0]);
  });

  var firstQuery = filteredQuery[0];
  var query = {};

  if (filteredQuery.length > 0) {
    query = {
      role: 0,
    };
    query['profile.' + firstQuery] = req.query[firstQuery];
  } else {
    query = {
      role: 0
    };
  }

  User.find(query, function(error, spartans) {
    if (error) return res.status(500).json({
      error: error
    });
    res.status(200).json(spartans);
  }).sort({
    'profile.availability': -1
  });
}

// Get a single spartan
function getSpartan(req, res) {
  User.findById(req.params.id, function(error, spartan) {
    if (error) return res.status(500).json({
      error: error
    });
    res.status(200).json(spartan);
  });
}

// Get a single user
function getUser(req, res) {
  User.find({
    uid: req.params.id
  }, function(error, user) {
    if (error) return res.status(500).json({
      error: error
    });
    res.status(200).json(user);
  });
}

// Make an enquiry to sparta global
function annonymousEnquiry(req, res) {
  sendmail({
    from: req.body.user.profile.email,
    to: "gsbahra1994@gmail.com",
    subject: 'enquiry',
    html: "first name:" + req.body.user.profile.firstname + "<br> last name:" + req.body.user.profile.lastname + "<br> number:" + req.body.user.profile.number + "<br> company:" + req.body.user.profile.company + "<br> position:" + req.body.user.profile.companyPosition + "<br> message" + req.body.message,
  }, function(err, reply) {
    sendmail({
      from: "donotreply@digital-profiles.co.uk",
      to: req.body.user.profile.email,
      subject: 'Enquiry Confirmation',
      html: "Hello,<br>" + req.body.user.profile.firstname + " " + req.body.user.profile.lastname + "<br>" + "Thank for your enquiry <br> Sparta Global",
    }, function(err, reply) {

    });
  });

  res.status(200).json({
    message: "Email Sent"
  });
}

// Make an enquiry to sparta global
function enquiry(req, res) {
  sendmail({
    from: req.body.user.data[0].profile.email,
    to: "gsbahra1994@gmail.com",
    subject: 'enquiry',
    html: "first name:" + req.body.user.data[0].profile.firstname + "<br> last name:" + req.body.user.data[0].profile.lastname + "<br> number:" + req.body.user.data[0].profile.number + "<br> company:" + req.body.user.data[0].profile.company + "<br> position:" + req.body.user.data[0].profile.companyPosition + "<br> message:" + req.body.message,
  }, function(err, reply) {
    sendmail({
      from: "donotreply@digital-profiles.co.uk",
      to: req.body.user.data[0].profile.email,
      subject: 'Enquiry Confirmation',
      html: "Hello,<br>" + req.body.user.data[0].profile.firstname + " " + req.body.user.data[0].profile.lastname + "<br>" + "Thank for your enquiry <br> Sparta Global",
    }, function(err, reply) {

    });
  });
  res.status(200).json({
    message: "Email Sent"
  });
}

module.exports = {
  update: updateSpartan,
  create: createUser,
  getSpartans: getSpartans,
  getSpartan: getSpartan,
  getUser: getUser,
  annonymousEnquiry: annonymousEnquiry,
  enquiry: enquiry
};
