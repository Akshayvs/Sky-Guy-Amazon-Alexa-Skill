'use strict';

const request = require('request');
const config = require('../config/default.js');
const format = require('string-format');

var weatherDataUtil;

module.exports = weatherDataUtil = {

    getWeatherObject: function getWeatherObject(route, state, city , callback) {
        const requestURI = this._uriBuilder(route, state, city );
        console.log( requestURI)

        request.get(requestURI, function (error, response, body) {
            if (error){
                console.log("error detected " + response.statusCode);
            }
            const data = JSON.parse(body);
            if (data.response.error){
                console.log("error in response. Message= " + data.response.error.description);
                return callback (data.response.error.description);
            }
            console.log(data.current_observation.feelslike_c +' celcius');

            return callback (null, data.current_observation.feelslike_c +' celcius');
        });
    },

    _uriBuilder : function _uriBuilder (route, state, city){
        const key = config.weatherAPI.key;
        const uriTemplate = config.weatherAPI.endpoints.templateLink;

        return format(uriTemplate,key, route,state,city );
    }
};
