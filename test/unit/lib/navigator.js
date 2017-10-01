'use strict';

var expect = require('chai').expect;
var mockery = require('mockery');

describe('navigator', function() {

    var navigator;

    beforeEach(function() {
        mockery.enable({useCleanCache: true});
        mockery.registerAllowable('../../../lib/navigator.js');

        navigator = require ('../../../lib/navigator')
    });

    afterEach(function() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it ('should contain locationUtil', function (){
        expect(navigator).to.contain.key('locationUtil');
    });

    it ('should contain qoutesUtil', function (){
        expect(navigator).to.contain.key('qoutesUtil');
    });
    it ('should contain weatherUtil', function (){
        expect(navigator).to.contain.key('weatherUtil');
    })
});
