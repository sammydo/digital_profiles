var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../index');
var should = chai.should();
var expect = require('chai').expect;
var admin = require("firebase-admin")
var User = require('../models/user');

chai.use(chaiHttp);

describe('Admin users', function() {
  var currentUID
  var currentAuthToken
  var newAdminId
  var newAdmin = new User({
    uid: "some-uid",
    role: 2,
    profile: {
      firstname: "Test",
      lastname: "User",
      email: "user@example.com"
    }
  });


  beforeEach(function(done){
    newAdmin.save(function(err, createdAdmin){
      newAdminId = createdAdmin._id;
      if(err) return console.log("***", err, test);


      admin.auth().createUser({
        email: "userTest37@example.com",
        emailVerified: false,
        password: "secretPassword",
        displayName: "John Doe",
        photoURL: "http://www.example.com/12345678/photo.png",
        disabled: false
      }).then(function(userRecord) {
        currentUID = userRecord.uid
        //admin.auth().createCustomToken(userRecord.uid)
        admin.auth().verifyIdToken("123456789")
          .then(function(customToken) {
            currentAuthToken = customToken
            done();
          })
          .catch(function(error) {
            console.log("Error creating custom token:", error);
            done();
          });
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully created new user:", userRecord.uid);
      }).catch(function (err) {
        console.log("***", err)
      })
    });
  });


  afterEach(function(done){
    User.findByIdAndRemove(newAdminId,function(err){
      if(err) return console.log(err);
      admin.auth().deleteUser(currentUID).then(function(data){
        console.log('data:', data)
        done();
      }).catch(function(err){
        console.log('User.findByIdAndRemove: err:', err)
        done();
      })
    });
  });



  // Test the /GET route
    it('It should GET all the spartans', function(done) {
      chai.request(app)
        .get('/api/users/spartans')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          done();
        });
    });

  // Test the /GET route for a single spartan
    it('It should GET a user', function(done) {
      chai.request(app)
        .get('/api/users/spartans')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;

          User.findOne({
            "uid": "6vK7E4TerqO0E4YkQfkDuf6ky3z2"
          }, function(err, newUser) {
              done();
          });
        });
    });

  // Test the /POST route for admin
  //   it('It should add an admin user', function(done) {
  //     chai.request(app)
  //       .post('/api/users')
  //       .set(admin.auth, 123456789)
  //       .send({
  //         uid: "38luh927d7ydf637",
  //         role: 2,
  //         profile: {
  //           firstname: "Test",
  //           lastname: "Admin",
  //           email: "admin@testing.com"
  //         }
  //       })
  //       .end(function(err, res) {
  //         res.should.have.status(201);
  //         res.should.be.json;

  //         User.findOne({
  //           "uid": "38luh927d7ydf637"
  //         }, function(err, newUser) {
  //           chai.request(app)
  //             .get('/api/users/' + newUser.id)
  //             .end(function(err, res) {
  //               res.should.have.status(200);
  //               res.should.be.json;

  //               User.findByIdAndRemove(newUser.id, function(err) {
  //                 if (err) return console.log(err);
  //                 done();
  //               });
  //             });
  //         });

  //       });
  //   });

  // // Test the /POST route for client
  //   it('It should add a client', function(done) {
  //     chai.request(app)
  //       .post('/api/users')
  //       .set(admin.auth, 123456789)
  //       .send({
  //         uid: "39jqpl78sbvur90k",
  //         role: 1,
  //         profile: {
  //           firstname: "Test",
  //           lastname: "Client",
  //           email: "client@testing.com"
  //         }
  //       })
  //       .end(function(err, res) {
  //         res.should.have.status(201);
  //         res.should.be.json;

  //         User.findOne({
  //           "uid": "39jqpl78sbvur90k"
  //         }, function(err, newUser) {
  //           chai.request(app)
  //             .get('/api/users/' + newUser._id)
  //             .end(function(err, res) {
  //               res.should.have.status(200);
  //               res.should.be.json;

  //               User.findByIdAndRemove(newUser._id, function(err) {
  //                 if (err) return console.log(err);
  //                 done();
  //               });
  //             });
  //         });

  //       });
  //   });

  // Test the /POST route for spartan
    it.skip('It should add an spartan', function(done) {
      chai.request(app)
        .post('/api/users')
        .set({"auth": '123456789'})
        .send({
          uid: "h80olmxy29sqp0cb4j2",
          role: 0,
          profile: {
            firstname: "Test",
            lastname: "Spartan",
            email: "spartan@testing1.com"
          }
        })
        .end(function(err, res) {
          res.should.have.status(201);
          res.should.be.json;

          User.findOne({
            "uid": "h80olmxy29sqp0cb4j"
          }, function(err, newUser) {
            chai.request(app)
              .get('/api/users/' + newUser._id)
              .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;

                User.findByIdAndRemove(newUser._id, function(err) {
                  if (err) return console.log(err);
                  done();
                });
              });
          });
        });
    });

    it('It should send an annonymous enquiry', function(done){
      chai.request(app)
        .patch('/api/enquiry')
        .send({
          user: {
              profile: {
                email: "example1@e.com",
                firstname: "test",
                lastname: "test",
                number: 054353290320903,
                company: "safhljsdjds",
                companyPosition: "highsgjdshf"
              }
            }
        })
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          done();
      })
  });
})
