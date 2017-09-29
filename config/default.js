'use strict';

module.exports = {

    weatherAPI : {
        endpoints:{
            conditions: 'http://api.wunderground.com/api/338005910442e5ba/conditions/q/CA/San_Francisco.json',
            forecast: 'http://api.wunderground.com/api/338005910442e5ba/forecast/q/CA/San_Francisco.json',
        },

        key: '338005910442e5ba',
        responseFormat:'JSON'
    }
};