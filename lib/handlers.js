'use strict';

var navigator = require('./navigator.js');
var self;
var handlers;

module.exports = handlers = {
    'LaunchRequest': function() {
        self = this;
        const welcomeSpeech = 'Hello!; How can i help you today? ' +
            'You can ask current Forecast, local Temperature, or say help to know a list of commands';
        const repormptSpeech = ' Sorry, i didnt hear that. what would you like to do ?';
        const cardTitle = 'Sky Guy - Welcome';
        const cardContent = 'Say Forecast, Temperature, or Say help to know a list of commands';

        this.emit(':askWithCard', welcomeSpeech, repormptSpeech, cardTitle, cardContent);
    },

    'getMyLocalTemperatureIntent': function() {
        self = this;
        navigator.locationUtil.getLocation(self, function(error, addressPayload) {
            if (error) {
                //todo log the error in newRelic
                const speechOutput = JSON.stringify(error.speech);
                const cardTitle = 'Sky Guy - Temperature (Error Message)';
                const cardContent = JSON.stringify(error.cardText);

                self.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
            } else {
                addressPayload.route = 'conditions';

                navigator.weatherUtil.getWeatherObject(addressPayload, function(error, speech) {
                    if (error) {
                        //todo log the error in newRelic
                        console.log('ERROR = ' + JSON.stringify(error));

                        const speechOutput = JSON.stringify(error.speech);
                        const cardTitle = 'Sky Guy - Temperature (Error Message)';
                        const cardContent = JSON.stringify(error.cardText);

                        self.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
                    } else {

                        const speechOutput = speech + '. would you want to know anything else ? try saying what is the local forecast?';
                        const cardTitle = 'Sky Guy - Temperature Data';
                        const cardContent = speech;

                        self.emit(':askWithCard', speechOutput, speechOutput, cardTitle, cardContent);
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

                const speechOutput = JSON.stringify(error.speech);
                const cardTitle = 'Sky Guy - Forecast ( Error Message)';
                const cardContent = JSON.stringify(error.cardText);

                self.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
            } else {
                addressPayload.route = 'forecast';

                navigator.weatherUtil.getWeatherObject(addressPayload, function(error, speech) {

                    if (error) {
                        //todo log the error in newRelic
                        const speechOutput = JSON.stringify(error.speech);
                        const cardTitle = 'Sky Guy - Forecast (Error Message)';
                        const cardContent = JSON.stringify(error.cardText);

                        self.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
                    } else {

                        const speechOutput = speech + '. would you want to know anything else ? try saying, Give me a positive quote';
                        const reprompt = 'would you want to know anything else ? try saying what is the local forecast? or, Motivational quote';
                        const cardTitle = 'Sky Guy - Forecast Data';

                        self.emit(':askWithCard', speechOutput, reprompt , cardTitle, speechOutput);
                    }
                });
            }
        });
    },

    'GetQuoteIntent': function() {
        self = this;
        navigator.qoutesUtil.GetNewFactIntent(function(err, quote) {

            const speechOutput = 'Here is a Quote. ' + quote + '. Wanna try something else ? Try saying, what is the local temperature';
            const cardTitle = 'Sky Guy - Motivational Quote';

            self.emit(':askWithCard', speechOutput, speechOutput, cardTitle, speechOutput);
        });
    },

    'AMAZON.HelpIntent': function() {
        self = this;
        const speechOutput = 'HELP. Try saying things like, Tell me today\'s forecast. ' +
            'Or,  What is the temperature. Or, Tell me a motivational quote. ' +
            'Or you can say exit... What can I help you with?';
        const reprompt = 'What can I help you with?';
        const cardTitle = 'Sky Guy - Help';

        self.emit(':askWithCard', speechOutput, reprompt, cardTitle, speechOutput);
    },
    'AMAZON.CancelIntent': function() {
        self = this;

        self.emit('AMAZON.StopIntent');
        },

    'AMAZON.StopIntent': function() {
        self = this;

        const speechOutput = 'Thanks for using Sky Guy by a-k93. Have a good day!! Bye';
        const cardTitle = 'Sky Guy - Stop';

        self.emit(':tellWithCard', speechOutput, cardTitle, speechOutput);
    },
    'Unhandled': function() {
        //todo log the error in newRelic
        self = this;

        const speechOutput = 'Sorry, an unhandled error has occured. The developers are working on fixing this. Thanks.';
        const cardTitle = 'Sky Guy - Unhandled Error State';

        self.emit(':tellWithCard', speechOutput, cardTitle, speechOutput);
    }
};
