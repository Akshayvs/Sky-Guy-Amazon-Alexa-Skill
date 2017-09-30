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

        request.get(requestURI, function (error, response, body) {
            if (error) {

                // better error handling
                console.log('error detected ' + response.statusCode);
            }
            const data = JSON.parse(body);
            if (data.response.error) {
                // better error handling
                console.log('error in response. Message= ' + data.response.error.description);
                return callback(data.response.error.description);
            }

            var speak = data.current_observation.feelslike_c + ' degree celcius';

            return callback(null, speak);
        });
    },

    _getForecast: function _getForecast(payload, callback) {
        const requestURI = this._uriBuilder(payload.route, payload.state, payload.city);
        console.log(requestURI);

        request.get(requestURI, function (error, response, body) {
            if (error) {
                console.log('error detected ' + response.statusCode);
            }
            const data = JSON.parse(body);
            if (data.response.error) {
                console.log('error in response. Message= ' + data.response.error.description);
                return callback(data.response.error.description);
            }

            var speak = data.forecast.txt_forecast.forecastday[0].fcttext;
            console.log(speak + ' YAYA');

            return callback(null, speak);
        });
    },
    _uriBuilder: function _uriBuilder(route, state, city) {
        const key = config.weatherAPI.key;
        const uriTemplate = config.weatherAPI.endpoints.templateLink;

        return format(uriTemplate, key, route, state, city);
    }
};

// For Testing
// const payLoad = {
//     route: 'forecast',
//     state: 'CA',
//     city: 'san_francisco'
// };
//
// weatherDataUtil._getForecast(payLoad, function (error, value) {
//     console.log('VALUE =' + value);
// });
