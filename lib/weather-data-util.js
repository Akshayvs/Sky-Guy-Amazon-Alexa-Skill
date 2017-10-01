'use strict';

const request = require('request');
const config = require('../config/default.js');
const format = require('string-format');

var weatherDataUtil;

module.exports = weatherDataUtil = {

    getWeatherObject: function getWeatherObject(payLoad, callback) {
        if (payLoad.route === 'conditions') {
            this._getConditions(payLoad, callback);
        } else if (payLoad.route === 'forecast') {
            this._getForecast(payLoad, callback);
        }
    },

    _getConditions: function _getConditions(payload, callback) {
        const requestURI = this._uriBuilder(payload.route, payload.state, payload.city);

        request.get(requestURI, function(error, response, body) {
            if (error) {
                //todo log the error in newRelic
                console.log('error detected ' + response.statusCode);
                const errorPayload = {
                    speech: 'Error when calling weather api. The developer are looking into this',
                    cardText: 'Error when calling weather api. The developer are looking into this'
                };

                callback(errorPayload, null);
            }
            const data = JSON.parse(body);
            if (data.response.error) {
                console.log('error in response. Message= ' + data.response.error.description);
                const errorPayload = {
                    speech: data.response.error.description,
                    cardText: data.response.error
                };

                callback(errorPayload, null);
            }

            var speech = 'TEMPERATURE. The Temperature feels like ' + data.current_observation.feelslike_c + ' degree celcius,' +
                ' that is ' + data.current_observation.feelslike_f + ' degree fahrenheit in ' + payload.city +
                '... The UV index is ' + data.current_observation.UV;
            return callback(null, speech);
        });
    },

    _getForecast: function _getForecast(payload, callback) {
        const requestURI = this._uriBuilder(payload.route, payload.state, payload.city);

        request.get(requestURI, function(error, response, body) {
            if (error) {
                //todo log the error in newRelic
                console.log('error detected ' + response.statusCode);
                const errorPayload = {
                    speech: 'Error when calling weather api. The developer are looking into this',
                    cardText: 'Error when calling weather api. The developer are looking into this'
                };

                callback(errorPayload, null);
            }

            const data = JSON.parse(body);

            if (data.response.error) {
                //todo log the error in newRelic
                console.log('error detected ' + response.statusCode);

                const errorPayload = {
                    speech: data.response.error.description,
                    cardText: data.response.error
                };

                callback(errorPayload, null);
            }

            var speech = 'FORECAST. ' + data.forecast.txt_forecast.forecastday[0].fcttext;
            return callback(null, speech);
        });
    },
    _uriBuilder: function _uriBuilder(route, state, city) {
        const key = config.weatherAPI.key;
        const uriTemplate = config.weatherAPI.endpoints.templateLink;

        return format(uriTemplate, key, route, state, city);
    }
};

