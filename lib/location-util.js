'use strict';

const request = require('request');
const config = require('../config/default.js');
const format = require('string-format');
const _ = require('lodash');

var locationUtil;

module.exports = locationUtil = {

    getStateAndCity: function getStateAndCity(locationAccessToken, callback) {
        locationUtil._getZipcodeFromAmazon(locationAccessToken, function(error, zip) {
            if (!zip) {
                callback('error getting zip code from amazon');
            } else {
                locationUtil._getStateAndZip(zip, callback);
            }
        });
    },

    _getZipcodeFromAmazon: function _getZipcodeFromAmazon(locationAccessToken, callback) {
        const deviceId = locationAccessToken.device.deviceId;
        const consentToken = locationAccessToken.user.permissions.consentToken;

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

            } else if (error) {
                //todo log the error in newRelic
                callback(error);

            } else if (response.statusCode !== 200) {
                //todo log the error in newRelic
                callback(response.statusCode);
            }
        });
    },

    // we are fetching the state and zip by calling an external service as some users might not be
    // comfortable in sharing their entire address with a skill provider.
    // we only request zip code access and [populate the state and city via external calls.
    _getStateAndZip: function _getStateAndZip(zip, callback) {
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
                callback(' Error fetching ity from google api', null);
            }
        });
    }

};
locationUtil._getStateAndZip(10005, function callback(a, b) {
    console.log('RESULT = ', JSON.stringify(b));
});
