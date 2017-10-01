'use strict';

var navigator = require('./navigator.js');
const config = require('../config/default.js');
const SKILL_NAME = config.skillParams.skillName;
var self;
var handlers;

module.exports = handlers = {
    'LaunchRequest': function() {
        self = this;
        const welcomeSpeech = 'Hello!; How can i help you today? You can say Forecast, Temperature, or say help to know a list of commands';
        const repeat = ' Sorry, i didnt hear that. what would you like to do ?';
        const welcomeText = 'Say Forecast, Temperature, or Say help to know a list of commands';

        this.emit(':askWithCard', welcomeSpeech, repeat, SKILL_NAME, welcomeText);
    },

    'getMyLocalTemperatureIntent': function() {
        self = this;
        navigator.locationUtil.getLocation(self, function(error, addressPayload) {
            if (error) {
                //todo log the error in newRelic
                self.emit(':tell', JSON.stringify(error.speech));
            } else {
                addressPayload.route = 'conditions';

                navigator.weatherUtil.getWeatherObject(addressPayload, function(error, speech) {
                    if (error) {
                        //todo log the error in newRelic
                        console.log('ERROR = ' + JSON.stringify(error));
                        self.emit(':tell', JSON.stringify(error.speech));
                    } else {

                        self.response.cardRenderer(SKILL_NAME, speech);
                        self.emit(':ask', speech + '. would you want to know anything else ? try saying Forecast');
                    }
                });
            }
        });
    },

    'GetMyLocalForecastIntent': function() {
        self = this;
        navigator.locationUtil.getLocation(self, function(error, addressPayload) {
            if (error) {
                //todo log the error in newRelic
                self.emit(':tell', JSON.stringify(error.speech));
            } else {
                addressPayload.route = 'forecast';

                navigator.weatherUtil.getWeatherObject(addressPayload, function(error, speech) {

                    if (error) {
                        //todo log the error in newRelic
                        console.log('ERROR = ' + JSON.stringify(error));
                        self.emit(':tell', JSON.stringify(error.speech));
                    } else {
                        self.response.cardRenderer(SKILL_NAME, speech);
                        self.emit(':ask', speech + '. would you want to know anything else ? try saying help');
                    }
                });
            }
        });
    },

    'GetQuoteIntent': function() {
        self = this;
        navigator.qoutesUtil.GetNewFactIntent(function(err, quote) {
            self.response.cardRenderer(SKILL_NAME, quote);
            self.emit(':ask', quote + '. would you want to know anything else ?');
        });
    },

    'AMAZON.HelpIntent': function() {
        self = this;
        const speechOutput = 'HELP. You can say things like, Forecast, Temperature, Motivational Quotes, ' +
            'or you can say exit... What can I help you with?';
        const reprompt = 'What can I help you with?';

        self.response.cardRenderer(SKILL_NAME, speechOutput);
        self.emit(':ask', speechOutput, reprompt);

    },
    'AMAZON.CancelIntent': function() {
        self = this;
        const speechOutput = 'Thanks for using Sky Guy by a-k93. Have a good day!!';
        self.response.cardRenderer(SKILL_NAME, speechOutput);
        self.emit(':tell', speechOutput);

    },
    'AMAZON.StopIntent': function() {
        self = this;
        const speechOutput = 'Thanks for using Sky Guy by a-k93. Have a good day!!';
        self.response.cardRenderer(SKILL_NAME, speechOutput);
        self.emit(':tell', speechOutput);
    },
    'Unhandled': function() {
        //todo log the error in newRelic
        self = this;
        const speechOutput = 'GoodBye';
        self.response.cardRenderer(SKILL_NAME, speechOutput);
        self.emit(':tell', speechOutput);

    }
};
