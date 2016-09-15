# BlueSocksChat

##Overview

The Blue Socks Chat application is a chat application using Socket.io, IBM Bluemix, Watson Language Translation, and Watson Tone Analyzer. Using this application, we will build your very own chatroom to chat with friends. Using the Watson Language Translation, we will be able to do translations on the fly with a simple command. Also, while you chat there is a chat bot named "sockBot" who will use the Watson Tone Analyzer service to analyze they chat messages. The bot will then alert the users if the the messages are either angry or sad.

##Instructions

To get the application deployed, start by clicking on the button below. This will open up the "Deploy to Bluemix" page.

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/odrodrig/BlueSocksStarter.git)

###1. Deployment
 1. This tool requires a Bluemix account so you will need to either create one or log in with your existing account.
2. Start by creating a unique name for your application. For example, if my name is John Smith, I'd use jsBluesocks
3. Verify that you are deploying to your organization and space. Dev is the default space.
4. If everything is correct, click Deploy.
 
###2. Making Changes in the code
For this application, we will be using our browser based code editor in IBM Dev Ops Services.
1. To get to the code editor, click on "Edit Code" in the "Deploy to Bluemix" screen after your application has been deployed. This will tak you to Dev Ops Services
 * If this is your first time in Dev Ops Services, you may need to create an alias for Dev Ops Serivces. Enter a name that you would like to be known as on Dev Ops Services.
2. The file we will be editing is the "app.js" file. Locate that file in the pane on the left.

###3. Adding the Watson Services to the code
1. In order to use the Watson services we need to add the library to the code first. On ***line 13***, paste in the following:
```javascript
var watson = require('watson-developer-cloud');
```
 This will incorporate the Watson Developer Cloud library in you code.

2. Now we need to get our usernammes and passwords for the services. On **line 31** paste in the following code:
```javascript
var username = "";
var password = "";
var toneUser = "";
var tonePass = "";
```
3. After that, we need to look up the values for the username and password. To this, paste the following on **line 44**.
 ```javascript
  var watsonCreds = services['language_translation'][0].credentials;
  var toneCreds = services['tone_analyzer'][0].credentials;

  username = watsonCreds.username;
  password = watsonCreds.password;

  toneUser = toneCreds.username;
  tonePass = toneCreds.password;
 ```
4. With the username and password in hand, we can now call the Language Translation and Tone Analyzer functions from the Watson Developer Cloud library. To do this, find **line 57** and paste in the following: 
```javascript
 var language_translation = watson.language_translation({
    username: username,
    password: password,
    version: 'v2'
});

 var tone_analyzer = watson.tone_analyzer({
    url: 'https://gateway.watsonplatform.net/tone-analyzer/api/',
    username: toneUser,
    password: tonePass,
    version_date: '2016-05-19',
    version: 'v3'
});
```

###4. Adding Watson Translation
In this section, we will be adding the code necessary to use the Watson Translation service within your application.
1. This section of code will call the Watson Language Translation from the library that we imported earlier. Go to **line 168** and add the following code:
```javascript
    language_translation.translate({
      text: data.message, source : data.sourceLang, target: data.targetLang },
      function (err, translation) {

        console.log("Watson will translate : " + data.message);

        if (err) {
          console.log('error:', err);

          socket.emit('translationResults', {
            username: socket.username,
            message: "Error translating. Try again."
          });

          socket.broadcast.emit('translationResults', {
            username: socket.username,
            message: "Error translating. Try again."
          });

        } else {
            console.log(translation.translations[0].translation);
            data.message = translation.translations[0].translation;

            socket.emit('translationResults', {
            username: socket.username,
            message: data.message
            });

            socket.broadcast.emit('translationResults', {
              username: socket.username,
              message: data.message
            });
        }
      }
    );
```

###5. Adding Watson Tone Analyzer
Here we will add the code necessary to use the Watson Tone Analyzer service.
1. First, we have to create the function named "getTone" that will do the tone analysis. Let's find **line 211** and paste in the following code:
```javascript
function getTone(data){
    var tones;
    var message;
    var name;
    var score;

    tone_analyzer.tone({text:data}, function(err, results) {
      if (err)
        console.log("Error getting tone: "+err);
      else {
        tones = results.document_tone.tone_categories[0].tones;
        var stats = [];

      for(var i=0; i<tones.length; i++){
        name = tones[i].tone_name;
        score = tones[i].score;

        stats.push(score);

        console.log(name+":"+score);
      }

      var topTrait = Math.max.apply(Math,stats);
      var topTraitPercent = (topTrait *100).toFixed(2)+"%";

      switch(topTrait){
          case stats[0]:
            name = tones[0].tone_name;
            message = "The chat is too volatile. Let's be nice! Anger at "+topTraitPercent;
            botTalk(message);
            break;
          case stats[1]:
            name = tones[1].tone_name;
            break;
          case stats[2]:
            name = tones[2].tone_name;
            break;
          case stats[3]:
            name = tones[3].tone_name;
            break;
          case stats[4]:
            name = tones[4].tone_name;
            message = "Cheer up "+socket.username+". Sadness at "+topTraitPercent;
            botTalk(message);
            break;
      }
    }
  });
```
2. Now that we have created the function, we will need to invoke it in our code. Find **line 100** and **line 166** and paste in the following code:
```javascript
getTone(data.message);
```

###6. Final Deployment
Now that we have made the changes all we need to do is deploy the application. To do this, all you need to do is click on the triangle button at the top of the page. Once it's done deploying, you can open the application and start chatting.


##How to Use

Once in the application, choose a nickname that will appear to other users and select the language you are fluent in (English is the default).
To translate, start your message with "/translate 'language'" replacing 'language' with the language you want to translate to. For example, if I wanted to translate "Hi my name is Oliver" to spanish, I would type "/translate spanish Hello my name is Oliver" and the translated spanish output would be sent to the chat room.

##The Services

1. Watson Language Translation
	* Watson Language Translation allows you to translate English to/from Brazilian Portuguese, French, Modern Standard Arabic, or Spanish. In our application, we are translating sentences in the chatroom.

2. Watson Tone Analyzer
	* Watson Tone Analyzer analyzes text that you send the service and returns the tone detected in the conversation. Using this service, you are able to extract emotion such as anger, disgust, fear, joy, and sadness. In our application, we use the service in our "SockBot" that is monitoring the chat for any angry or sad messages and promptly offer a comforting message.

