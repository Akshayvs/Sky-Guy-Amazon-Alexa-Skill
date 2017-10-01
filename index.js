'use strict';

const Alexa = require('alexa-sdk');
const config = require('./config/default.js');
const APP_ID = config.skillParams.applicationId;
const handlers = require('./lib/handlers');

exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

