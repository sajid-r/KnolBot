// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var request = require('request');
var moment = require('moment');
var cron = require('node-cron');

const apiURL = "http://localhost:3000";
var randomid = Math.floor((Math.random() * 9999999) + 1000000);
commands = ['/courses','enrol']
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3979, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen for messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var userStore = [];
var bot = new builder.UniversalBot(connector, function (session) {
    // store user's address
    var address = session.message.address;
    userStore.push(address);
    session.userData.courses = [];
    // end current dialog
    session.endDialog('Hi welcome to KnolBot :)');
});

// Every 5 seconds, check for new registered users and start a new dialog
setInterval(function () {
    var newAddresses = userStore.splice(0);
    newAddresses.forEach(function (address) {

        console.log('Starting survey for address:', address);

        // new conversation address, copy without conversationId
        var newConversationAddress = Object.assign({}, address);
        delete newConversationAddress.conversation;

        // start survey dialog
        bot.beginDialog(newConversationAddress, 'survey', null, function (err) {
            if (err) {
                // error ocurred while starting new conversation. Channel not supported?
                bot.send(new builder.Message()
                    .text('This channel does not support this operation: ' + err.message)
                    .address(address));
            }
        });

    });
}, 5000);

bot.dialog('survey', [
    function (session) {
        builder.Prompts.text(session, 'Hello... What\'s your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.text(session, 'Hi ' + results.response + ', Type a command (type /help for a list of commands)');
    },
    function (session, results) {
        var res = results.response;
        switch(res){
            case("/courses"):
                builder.Prompts.text(session, 'Hi ' + session.userData.name + ', These are the available courses: ');
                request(apiURL+'/course', function (error, response, body) 
                {
                    var course=JSON.parse(body);
                    var cards = [];
                    for (var i=0;i<course.length;i++)
                    {
                        cards.push
                        (   new builder.HeroCard(session)
                            .title(course[i].coursetitle)
                            .subtitle('Description')
                            .text(course[i].coursedesc)
                            .images([builder.CardImage.create(session, '/home/knolly/Documents/Training/Projects/botinit/api/core-CreateNewConversation/res/1.png')
                            ])
                            .buttons([builder.CardAction.postBack(session, '/register ' + JSON.stringify({"id":course[i].courseid, "title":course[i].coursetitle}) , 'Register')])
                        );
                    }
                    var reply = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(cards);
                    session.send(reply);

                });
            break;
        }
    },
    function (session, results) {
        
        session.userData.courses.push(results.response);
        var obj = JSON.parse(results.response.substring(10));
        builder.Prompts.text(session, 'Congratulations you have registered for ' + obj.title);
        builder.Prompts.text(session, 'You will start receiving contents soon...');
        
        var options = 
        { method: 'POST',
          url: 'http://localhost:3000/invol/create',
          headers: 
            { 'postman-token': '7446ba9b-7663-924e-5ae3-f97a5d580eb1',
             'cache-control': 'no-cache',
             'content-type': 'application/x-www-form-urlencoded' 
            },
          form: { body: '{"courseid": '+obj.id+', "userid": '+randomid+'}' } 
        };

        request(options, function (error, response, body) 
        {
          if (error) throw new Error(error);
          console.log(body);
        });

        cron.schedule('*/1 * * * *', function(){
          console.log('running a task every minute');
          //search for involvement details of the user
          request(apiURL+'/invol/user/'+randomid, function (error, response, body) 
            {
                var invol=JSON.parse(body);
                for(var i=0;i<invol.length;i++) //run over all involvements
                {
                    var currentinvol = invol[i];
                    console.log("currentinvol = " + currentinvol);
                    //if messagequeue exists
                    if(invol[i].messageQueue[0]!=undefined)
                    {
                        var msgTime = moment(invol[i].messageQueue[0].time);
                        var currenttime = moment();
                        if(msgTime.isSameOrBefore(currenttime))
                        {
                            console.log('contentid: ' + invol[i].messageQueue[0].contentno + " userid: " + invol[i].userid);
                            var contentid = invol[i].messageQueue[0].contentno;
                            var courseid = invol[i].courseid;
                            var objid = invol[i]._id;
                            console.log("objid = " + invol[i]._id);
                            //Post to contentno to userid
                            
                            //search for the content
                            request(apiURL+'/content/'+courseid+'/'+contentid, function (error, response, body)
                            {
                                var response = JSON.parse(body);
                                var contentdesc = response.contentdesc;
                                var link = "", doc="";
                                if(response.link != undefined)
                                    link = response.link;
                                if(response.docurl != undefined)
                                    doc = response.docurl;

                                console.log("Before deleting: " + currentinvol.messageQueue);
                                currentinvol.messageQueue.shift(1); //deleted the sent content from queue
                                var stringified = JSON.stringify(currentinvol);
                                console.log("After deleting: " + currentinvol.messageQueue);

                                var options2 = 
                                { method: 'POST',
                                  url: apiURL+'/invol/obj/' + objid,
                                  headers: 
                                   { 'postman-token': '1e0c16f5-f86e-791b-57be-cf064ccbe1d8',
                                     'cache-control': 'no-cache',
                                     'content-type': 'application/x-www-form-urlencoded' },
                                  form: { body:  stringified } 
                                };

                                request(options2, function (error, response, body) {
                                  if (error) throw new Error(error);

                                  console.log(body);
                                });

                                //send to chatbot
                                builder.Prompts.text(session, contentdesc + ' ' + link + ' ' + doc);
                            });
                        }
                    }
                    else{
                        builder.Prompts.text(session, "That is the end of the course.");
                    }
                    
                }  
            });
        });

    }
]);