'use strict';

const request = require('request');
const config = require('../config/default.js');
const format = require('string-format');
const _ = require('lodash');

var locationUtil;

module.exports = locationUtil = {

    getLocation: function getLocation(thisObject, callback) {
        if (_.get(thisObject, 'event.context.System.user.permissions.consentToken', null) !== null &&
            _.get(thisObject, 'event.context.System.device.deviceId', null) !== null) {

            locationUtil.getStateAndCity(thisObject.event.context.System, callback);
        } else {
            const errorPayload = {
                speech: 'Location access not enabled. please enable location access',
                cardText: 'Location access not enabled. please enable location access'
            };
            callback(errorPayload, null);
        }
    },

    getStateAndCity: function getStateAndCity(locationAccessToken, callback) {
        locationUtil._getZipcodeFromAmazon(locationAccessToken, function(error, zip) {
            if (error) {
                callback(error, null);

            } else {
                locationUtil._getStateAndZipFromGoogle(zip, callback);
            }
        });
    },

    _getZipcodeFromAmazon: function _getZipcodeFromAmazon(locationAccessToken, callback) {
        const consentToken = locationAccessToken.user.permissions.consentToken;
        const deviceId = locationAccessToken.device.deviceId;

        var options = {
            url: 'https://api.amazonalexa.com/v1/devices/' + deviceId + '/settings/address/countryAndPostalCode',
            headers: {
                'Authorization': 'Bearer ' + consentToken
            }
        };

        request(options, function(error, response, body) {

            if (!error && response.statusCode === 200) {
                const zipcode = JSON.stringify(JSON.parse(body).postalCode);

                callback(null, zipcode);
            } else {
                //todo log the error in newRelic

                const errorPayload = {
                    speech: 'Error getting zip code from amazon. Please make sure you have provided your zip code',
                    cardText: 'Error getting zip code from amazon. Please make sure you have provided your zip code'
                };

                callback(errorPayload, null);
            }
        });
    },

    // we are fetching the state and zip by calling an external service as some users might not be
    // comfortable in sharing their entire address with a skill provider.
    // we only request zip code access and [populate the state and city via external calls.
    _getStateAndZipFromGoogle: function _getStateAndZipFromGoogle(zip, callback) {
        const uri = config.googleAPI.endpoint;
        const token = config.googleAPI.token;

        var requestUri = format(uri, token, zip);

        request.get(requestUri, function(error, response, body) {
            if (!error && response.statusCode === 200) {

                var bodyObject = JSON.parse(body);
                var address = bodyObject.results[0].formatted_address;
                var values = _.split(address, ',', 2);

                values.forEach(function(value, index) {
                    values[index] = value.replace(',', '');
                });

                var stateAndZip = _.split(values[1], ' ');

                const addressPayload = {
                    city: values[0].replace(' ', '_'),
                    state: stateAndZip[1],
                    zip: stateAndZip[2]
                };
                callback(null, addressPayload);
            } else {
                const errorPayload = {
                    speech: ' Error fetching data from google api. Please try again after some time',
                    cardText: ' Error fetching data from google api. Please try again after some time'
                };
                callback(errorPayload, null);
            }
        });
    }
};
