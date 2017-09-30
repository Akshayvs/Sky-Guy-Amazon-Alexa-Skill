'use strict';

const Alexa = require('alexa-sdk');
const weatherUtil = require('./lib/weather-data-util.js');
const config = require('./config/default.js');
const locationUtil = require('./lib/location-util.js');

const APP_ID = config.skillParams.applicationId;
const SKILL_NAME = config.skillParams.skillName;
var self;

var addressPayload ;

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function() {
        self = this;
        const locationAccessTokesn = this.event.context.System;

        console.log('CONFIG = ' + JSON.stringify(config));

        locationUtil.getStateAndCity(locationAccessTokesn, function(error, response) {
            if (error) {
                const speechOutput = 'We are having trouble getting your location details. ' +
                    'Please make sure you have enabled location access for this skill' ;
                self.response.cardRenderer(SKILL_NAME, speechOutput);
                self.response.speak(speechOutput);
                self.emit(':responseReady');
            } else {
                addressPayload = response;
                self.emit('getMyLocalTemperatureIntent');
            }
        });
    },

    'getMyLocalTemperatureIntent': function() {
        self = this;

        addressPayload.route = 'conditions';

        weatherUtil.getWeatherObject(addressPayload , function(err, resp) {
            console.log('  returned value = ' + resp.toString());
            const speechOutput = 'The temperature feels like ' + resp;
            self.response.cardRenderer(SKILL_NAME, speechOutput);
            self.response.speak(speechOutput);
            self.emit(':responseReady');
        });
    },

    // replica of get new fact intent to get weather forecast
    'GetMyLocalForecastIntent': function() {
        self = this;

        const payLoad = {
            route: 'conditions',
            state: 'CA',
            city:'san_francisco'
        };

        weatherUtil.getWeatherObject(payLoad , function(err, resp) {
            console.log('  returned value = ' + resp.toString());
            const speechOutput = resp;
            self.response.cardRenderer(SKILL_NAME, resp);
            self.response.speak(speechOutput);
            self.emit(':responseReady');
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
        this.response.speak('Good Bye !!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function() {
        const STOP_MESSAGE = 'Goodbye!';
        this.response.speak(STOP_MESSAGE);
        console.log(' After stop message spoken');
        this.emit(':responseReady');
    }
};
