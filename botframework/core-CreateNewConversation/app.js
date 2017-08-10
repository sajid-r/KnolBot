// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var request = require('request');

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

    // end current dialog
    session.endDialog('You\'ve been invited to a survey! It will start in a few seconds...');
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
                request('http://localhost:3000/course', function (error, response, body) 
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
                            .images([builder.CardImage.create(session, '/home/knolly/Documents/Training/Projects/botinit/api/core-CreateNewConversation/res/1.png')])
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
        session.userData.coding = results.response;
        builder.Prompts.choice(session, 'What language do you code Node using? ', ['JavaScript', 'CoffeeScript', 'TypeScript']);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.endDialog('Got it... ' + session.userData.name +
            ' you\'ve been programming for ' + session.userData.coding +
            ' years and use ' + session.userData.language + '.');
    }
]);