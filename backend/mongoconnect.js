var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost:27017/knolbot';

var getUserDetails = function(url, userID){

	MongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
  		findUserDetails(db, userID, function() {
      	db.close();
  		});
	});
}

var findUserDetails = function(db, userID, callback) {
   var cursor =db.collection('user').find({ "userid": userID } );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         var user = {"userid":doc.userid, "username":doc.username, "age" : doc.age, "organization":doc.organization,
         	"courses_completed" :doc.courses_completed, "current_courses":doc.current_courses
     		}

      } else {
         callback();
      }
   });
};

var getCourseDetails = function(url, courseID){

	MongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
  		findCourseDetails(db, courseID, function() {
      	db.close();
  		});
	});
}

var findCourseDetails = function(db, courseID, callback) {
   var cursor =db.collection('course').find({ "courseid": courseID } );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         var course = {"courseid":doc.courseid, "coursetitle":doc.coursetitle,"coursedesc":doc.coursedesc, 
         			"datecreated":doc.datecreated, "content":doc.content
     		}

      } else {
         callback();
      }
   });
};

var getInvolvementDetailsByCourse = function(url, courseID){

	MongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
  		findInvolvementDetailsByCourse(db, courseID, function() {
      	db.close();
  		});
	});
}

var findInvolvementDetailsByCourse = function(db, courseID, callback) {
   var cursor =db.collection('involvement').find({ "courseid": courseID } );
   var involvement = [];
	cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         var obj = {"courseid":doc.courseid, "userid":doc.userid, "involvementno":doc.involvementno, 
         	"last_contentid":doc.last_contentid
     		}
     	 involvement.push(obj);
      } else {
         callback();
      }
   });

};

var getInvolvementDetailsByUser = function(url, userID){

	MongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
  		findInvolvementDetailsByUser(db, userID, function() {
      	db.close();
  		});
	});
}

var findInvolvementDetailsByUser = function(db, userID, callback) {
   var cursor =db.collection('involvement').find({ "userid": userID } );
   var involvement = [];
	cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         var obj = {"courseid":doc.courseid, "userid":doc.userid, "involvementno":doc.involvementno, 
         	"last_contentid":doc.last_contentid
     		}
     	 involvement.push(obj);
     	 console.log(involvement);
      } else {
         callback();
      }
   });

};

getInvolvementDetailsByUser(url,2);