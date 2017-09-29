'use strict';

module.exports = {

    weatherAPI : {
        endpoints:{
            templateLink: 'http://api.wunderground.com/api/{0}/{1}/q/{2}/{3}.json',
            conditions: 'http://api.wunderground.com/api/338005910442e5ba/conditions/q/CA/San_Francisco.json',
            forecast: 'http://api.wunderground.com/api/338005910442e5ba/forecast/q/CA/San_Francisco.json',
        },

        key: '338005910442e5ba',
        responseFormat:'JSON'
    }
};