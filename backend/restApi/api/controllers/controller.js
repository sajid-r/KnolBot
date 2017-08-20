'use strict';
var tz=require('moment-timezone'),
  moment = require('moment'),
  mongoose = require('mongoose'),
  User = mongoose.model('user'),
  Course = mongoose.model('course'),
  Admin = mongoose.model('admin'),
  Invol = mongoose.model('involvement');


                //////////////////
                //  RETRIEVE    //
                //////////////////

exports.getUser = function(req,res) {
  User.find({"userid":req.params.id}, function(err,item){
    if(err)
      res.send(err);
    res.json(item);
  });
};

exports.getCourse = function(req,res) {
  Course.find({"courseid":req.params.id}, function(err,item){
    if(err)
      res.send(err);
    res.json(item);
  });
};

exports.getAllCourses = function(req,res) {
  Course.find({}, function(err,item){
    if(err)
      res.send(err);
    res.json(item);
  });
};

exports.getAdmin = function(req,res) {
  Admin.find({"adminid":req.params.id}, function(err,item){
    if(err)
      res.send(err);
    res.json(item);
  });
};

exports.getInvol = function(req,res) {
  Invol.find({"involvementno":req.params.id}, function(err,item){
    if(err)
      res.send(err);
    res.json(item);
  });
};

exports.getInvolUsingObjID = function(req,res) {
  Invol.find({'_id':req.params.id}, function(err,item){
    if(err)
      res.send(err);
    res.json(item);
  });
};

exports.getInvolUsingUserID = function(req,res) {
  Invol.find({"userid":req.params.userid}, function(err,item){
    if(err)
      res.send(err);
    res.json(item);
  });
};

exports.getAllInvol = function(req,res) {
  Invol.find({}, function(err,item){
    if(err)
      res.send(err);
    res.json(item);
  });
};

exports.getContent = function(req,res) {
  Course.find({"courseid":req.params.courseid}, function(err,item){
    if(err)
      res.send(err);
    for(var i=0;i<item[0].content.length;i++){
      if(req.params.contentid == JSON.stringify(item[0].content[i].contentno)){
        res.send(item[0].content[i]);
      }
    }
  });
};

                //////////////////
                //    CREATE    //
                //////////////////

exports.postUser = function(req,res) {
  console.log(req.body.body);
  var newuser = new User(JSON.parse(req.body.body));
  newuser.save(function(err,data){
    if(err)
      res.send(err);
    res.json(data);
  });
};

exports.postCourse = function(req,res) {
  console.log(req.body.body);
  var newcourse = new Course(JSON.parse(req.body.body));
  Course.find({}, function(err,item){
      var courses = item;
      var lastid = courses[courses.length-1].courseid;
      newcourse.courseid = lastid+1;
      newcourse.save(function(err,data){
      if(err)
        res.send(err);
      res.json(data);
    });
  });
};

exports.postAdmin = function(req,res) {
  console.log(req.body.body);
  var newadmin = new Admin(JSON.parse(req.body.body));
  newadmin.save(function(err,data){
    if(err)
      res.send(err);
    res.json(data);
  });
};

exports.postInvol = function(req,res) {
  console.log(req.body.body);
  var newinvol = new Invol(JSON.parse(req.body.body));
  var courseid = newinvol.courseid;
  var contentqueue = [];
  Course.find({"courseid":courseid}, function(err,item){
    if(err)
      console.log(err);
    for(var i =0; i<item[0].content.length; i++)
    {
      var timediff = item[0].content[i].timediff; //in format : {'months':11,'days':30,'hours':23,'minutes':59}
      var currenttime = moment();
      var contenttime = currenttime.clone().tz('Asia/Kolkata').add(timediff.months,'M').add(timediff.days,'d').add(timediff.hours,'h')
      .add(timediff.minutes,'m');
      console.log("Current Time is: " + contenttime.toDate());
      contentqueue.push({"contentno":item[0].content[i].contentno, "time":contenttime.toDate()});
    }
    newinvol.messageQueue = contentqueue;
    newinvol.save(function(err,data)
    {
      if(err)
        res.send(err);
      res.json(data);
    });
  });
};

                //////////////////
                //    UPDATE    //
                //////////////////


exports.updateUser = function(req,res) {
  console.log(req.body.body);
  var queryid = JSON.parse(req.body.body);
  var query = {'userid':queryid.userid};
  var newobj = JSON.parse(req.body.body);
  User.findOneAndUpdate(query, newobj, {upsert:true},function(err,data){
    if(err)
      res.send(err);
    res.json(data);
  });
};

exports.updateAdmin = function(req,res) {
  console.log(req.body.body);
  var queryid = JSON.parse(req.body.body);
  var query = {'adminid':queryid.adminid};
  var newobj = JSON.parse(req.body.body);
  Admin.findOneAndUpdate(query, newobj, {upsert:true},function(err,data){
    if(err)
      res.send(err);
    res.json(data);
  });
};

exports.updateCourse = function(req,res) {
  console.log(req.body.body);
  var queryid = JSON.parse(req.body.body);
  var query = {'courseid':queryid.courseid};
  var newobj = JSON.parse(req.body.body);
  Course.findOneAndUpdate(query, newobj, {upsert:true},function(err,data){
    if(err)
      res.send(err);
    res.json(data);
  });
};

exports.insertContent = function(req,res) {
  console.log(req.body.body);
  var queryid = JSON.parse(req.body.body);
  var query = {"courseid":queryid.courseid};
  //console.log("Query = " + query + "queryid.courseid = " + queryid.courseid);
  var desc = queryid.contentdesc;
  var url = queryid.link;
  var newcontent = {"contentdesc":desc,"link":queryid.link, "imgurl":queryid.imgurl, "timediff":queryid.timediff};
  Course.update(query,{$push: {"content":newcontent}},{upsert:true},function(err,data){
        if(err){
                res.send(err);
        }else{
                res.json(data);
        }
});
}


exports.updateInvol = function(req,res) {
  console.log(req.body.body);
  var queryid = JSON.parse(req.body.body);
  var query = {'involvementno':queryid.involvementno};
  var newobj = JSON.parse(req.body.body);
  Invol.findOneAndUpdate(query, newobj, {upsert:true},function(err,data){
    if(err)
      res.send(err);
    res.json(data);
  });
};

exports.updateInvolUsingObjID = function(req,res) {
  console.log(req.body.body);
  var queryid = JSON.parse(req.body.body);
  var query = {'_id':queryid._id};
  var newobj = JSON.parse(req.body.body);
  Invol.findOneAndUpdate(query, newobj, {upsert:true},function(err,data){
    if(err)
      res.send(err);
    res.json(data);
  });
};