/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');
const weatherUtil = require('./lib/weather-data-util');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

const APP_ID = 'amzn1.ask.skill.af476a0e-515c-49f9-8f37-207cfa667d84';

const SKILL_NAME = 'Sky Guy';
const GET_FACT_MESSAGE = 'Here is the weather Update';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';
var here;

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function() {

        this.emit('GetNewFactIntent');
    },

    'GetNewFactIntent': function() {
        here = this;

        const payLoad = {
            route: 'conditions',
            state: 'CA',
            city:'san_francisco'
        };

        weatherUtil.getWeatherObject(payLoad , function(err, resp) {
            console.log('  returned value = ' + resp.toString());
            const speechOutput = 'The temperature feels like ' + resp;
            here.response.cardRenderer(SKILL_NAME, resp);
            here.response.speak(speechOutput);
            here.emit(':responseReady');
        });
    },

    // replica of get new fact intent to get weather forecast
    'GetForecastIntent': function() {
        here = this;
        weatherUtil.getWeatherObject('forecast', 'CA', 'san_francisco' , function(err, resp) {
            console.log('  returned value = ' + resp.toString());
            const speechOutput = 'The temperature feels like ' + resp;

            //here.response.cardRenderer(SKILL_NAME, resp);
            here.response.speak(speechOutput);
            here.emit(':responseReady');
        });
    },

    'AMAZON.HelpIntent': function() {
        const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function() {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function() {
        this.response.speak(STOP_MESSAGE);
        console.log(' After stop message spoken');
        this.emit(':responseReady');
    }
};
