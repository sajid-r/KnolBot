var restify = require('restify');
var request = require('request');

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