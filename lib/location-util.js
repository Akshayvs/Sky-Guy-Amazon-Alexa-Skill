'use strict';

var request = require('request');

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
        console.log(' reaching  get State and Zip with zip = ' + zip);
        callback(null, 'heya');
    }
};
