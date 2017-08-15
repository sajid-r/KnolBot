var restify = require('restify');
var request = require('request');
var moment = require('moment');
var cron = require('node-cron');
 
cron.schedule('*/1 * * * *', function(){
  console.log('running a task every thirty minutes');
  request('http://localhost:3000/invol', function (error, response, body) 
    {
        var invol=JSON.parse(body);
        for(var i=0;i<invol.length;i++) //run over all involvements
        {
        	
        	if(invol[i].messageQueue[0]!=undefined)
        	{
        		var msgTime = moment(invol[i].messageQueue[0].time);
	        	var currenttime = moment();
	        	if(msgTime.isSameOrBefore(currenttime))
	        	{
	        		console.log('Invol No.' + invol[i].involvementno);
	        		var contentid = invol[i].messageQueue[0].contentno;
	        		var courseid = invol[i].courseid;
	        		var userid = invol[i].userid;
	        		//Post to contentno to userid


	        		invol[i].messageQueue.shift(1); //deleted the sent content from queue
	        		var stringified = JSON.stringify(invol[i]);
	        		request.post({
					  headers: {'content-type' : 'application/x-www-form-urlencoded'},
					  url:     'http://localhost:3000/invol/update',
					  body:    "body="+stringified
					}, function(error, response, body){
					  console.log("\n");
					});
	        	}
        	}
        	
        }  
	});
});