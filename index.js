'use strict';

const Alexa = require('alexa-sdk');
const navigator = require('./lib/navigator');
const weatherUtil = require('./lib/weather-data-util.js');
const config = require('./config/default.js');
const locationUtil = require('./lib/location-util.js');
const _ = require('lodash');

const APP_ID = config.skillParams.applicationId;
const SKILL_NAME = config.skillParams.skillName;
var self;

var addressPayload;

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function() {
        self = this;
        const locationAccessToken = this.event.context.System;

        if (locationAccessToken ) {
            locationUtil.getStateAndCity(locationAccessToken, function(error, response) {
                if (error) {
                    const speechOutput = 'We are having trouble getting your location details. ' +
                        'Please make sure you have enabled location access for this skill';
                    self.response.cardRenderer(SKILL_NAME, speechOutput);
                    self.response.speak(speechOutput);
                    self.emit(':responseReady');
                } else {
                    addressPayload = response;
                    const welcomeMessage = 'Hello!; How can i help you today? You can say Forecast, Temperature, Alerts , or help to know a list of commands';
                    self.response.cardRenderer(SKILL_NAME, welcomeMessage);
                    self.emit(':ask', welcomeMessage);
                    //self.emit('getMyLocalTemperatureIntent');
                }
            });

        } else {
            const noLocationAccessMessage = 'We are unable to access your location. Please make sure location access is enabled for this skill. You can still try saying, Quote, or Help';
            self.response.cardRenderer(SKILL_NAME, noLocationAccessMessage);
            self.emit(':ask', noLocationAccessMessage);
        }
    },

    'getMyLocalTemperatureIntent': function() {
        self = this;

        addressPayload.route = 'conditions';

        weatherUtil.getWeatherObject(addressPayload, function(err, speech) {

            self.response.cardRenderer(SKILL_NAME, speech);
            self.emit(':ask', speech + 'would you want to know anything else ? try saying help');
        });
    },

    // replica of get new fact intent to get weather forecast
    'GetMyLocalForecastIntent': function() {
        self = this;

        addressPayload.route = 'forecast';

        weatherUtil.getWeatherObject(payLoad, function(err, resp) {
            console.log('  returned value = ' + resp.toString());
            const speechOutput = resp;
            self.response.cardRenderer(SKILL_NAME, resp);
            self.response.speak(speechOutput);
            self.emit(':responseReady');
        });
    },

    'GetQuoteIntent': function() {
        self = this;

        console.log("INSIDE GET QUOTE INTENT");

        navigator.qoutesUtil.GetNewFactIntent(function(err, quote) {
            self.response.cardRenderer(SKILL_NAME, quote);

            self.emit(':ask', quote + 'would you want to know anything else ?');
        });

    },

    'AMAZON.HelpIntent': function() {
        const speechOutput = 'You can say things like, What is the weather forecast? or,' +
            ' what is the feels like temperature?  or, you can say exit... What can I help you with?';
        const reprompt = 'What can I help you with?';
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function() {
        const speech = 'Thanks for using Sky Guy by ak93. Have a good day!!';
        self.response.cardRenderer(SKILL_NAME, speech);
        self.emit(':tell', speech);
    },
    'AMAZON.StopIntent': function() {
        const speech = 'Thanks for using Sky Guy by ak93. Have a good day!!';
        self.response.cardRenderer(SKILL_NAME, speech);
        self.emit(':tell', speech);
    }
};
