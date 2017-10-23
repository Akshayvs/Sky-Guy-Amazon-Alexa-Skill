'use strict';

var mockery = require('mockery');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('weather-data-util', function () {

    var weatherUtil;

    before(function () {
        mockery.enable({useCleanCache: true});
        mockery.registerAllowable('../../../lib/weather-data-util.js');
    });

    after(function () {
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('scaffolding', function () {

        beforeEach(function () {
            mockery.resetCache();

            mockery.registerMock('request', {});
            mockery.registerMock('../config/default.js', {});
            mockery.registerMock('string-format', {});

            weatherUtil = require('../../../lib/weather-data-util.js');
        });

        afterEach(function () {
            mockery.deregisterMock('request');
            mockery.deregisterMock('../config/default.js');
            mockery.deregisterMock('string-format');
        });

        it('should contain `getWeatherObject` function', function () {
            expect(weatherUtil).to.have.property('getWeatherObject');
        });
        it('should contain `_getConditions` function', function () {
            expect(weatherUtil).to.have.property('_getConditions');
        });
        it('should contain `_getForecast` function', function () {
            expect(weatherUtil).to.have.property('_getForecast');
        });
        it('should contain `_uriBuilder` function', function () {
            expect(weatherUtil).to.have.property('_uriBuilder');
        });
    });

    describe('getWeatherObject', function () {

        beforeEach(function () {
            mockery.resetCache();

            mockery.registerMock('request', {});
            mockery.registerMock('../config/default.js', {});
            mockery.registerMock('string-format', {});

            weatherUtil = require('../../../lib/weather-data-util.js');

            weatherUtil._getConditions = sinon.stub();
            weatherUtil._getForecast = sinon.stub();
            weatherUtil._uriBuilder = { };
        });

        afterEach(function () {
            mockery.deregisterMock('request');
            mockery.deregisterMock('../config/default.js');
            mockery.deregisterMock('string-format');
        });

        it ('should call `_getConditions` exactly once if the payload route property is set to `conditions`', function(){
            var payload = {
                route:'conditions'
            };
            var callback = sinon.stub();

            weatherUtil.getWeatherObject(payload,callback);

            expect(weatherUtil._getConditions.callCount).to.eql(1);
        });

        it ('should call `_getConditions` with expected parameters', function(){
            var payload = {
                route:'conditions'
            };
            var callback = sinon.stub();

            weatherUtil.getWeatherObject(payload,callback);

            expect(weatherUtil._getConditions.args).to.eql([[payload,callback]]);
        });

        it('should call `_getForecast` exactly once if the payload route property is set to `conditions`', function(){
            var payload = {
                route:'forecast'
            };
            var callback = sinon.stub();

            weatherUtil.getWeatherObject(payload,callback);

            expect(weatherUtil._getForecast.callCount).to.eql(1);
        });

        it ('should call `_getForecast` with expected parameters', function(){
            var payload = {
                route:'forecast'
            };
            var callback = sinon.stub();

            weatherUtil.getWeatherObject(payload,callback);

            expect(weatherUtil._getForecast.args).to.eql([[payload,callback]]);
        });


    });

    describe('_getConditions', function(){

        var request;
        var testUri= 'TEST URI';

        beforeEach(function () {
            mockery.resetCache();

            request = {
                get: sinon.stub()
            };

            mockery.registerMock('request', request);
            mockery.registerMock('../config/default.js', {});
            mockery.registerMock('string-format', {});

            weatherUtil = require('../../../lib/weather-data-util.js');

            weatherUtil.getWeatherObject = {};
            weatherUtil._getForecast = sinon.stub();
            weatherUtil._uriBuilder = sinon.stub().withArgs('testRoute', 'testState', 'testCity').returns(testUri);
        });

        afterEach(function () {
            mockery.deregisterMock('request');
            mockery.deregisterMock('../config/default.js');
            mockery.deregisterMock('string-format');
        });

        it('should call `request.get` exactly once', function(){
            var payLoad ={
                route:'testRoute',
                state: 'testState',
                city:'testCity'
            };
            var callback = sinon.stub();

            weatherUtil._getConditions(payLoad,callback);

            expect(request.get.callCount).to.eql(1);
        });

        it('should call `request.get` with the URI returned by _uriBuilder as the first parameter', function(){
            var payLoad ={
                route:'testRoute',
                state: 'testState',
                city:'testCity'
            };
            var callback = sinon.stub();

            weatherUtil._getConditions(payLoad,callback);

            expect(request.get.args[0][0]).to.eql(testUri);
        });

        it('should call `request.get` with a callback function as the second parameter', function(){
            var payLoad ={
                route:'testRoute',
                state: 'testState',
                city:'testCity'
            };
            var callback = sinon.stub();

            weatherUtil._getConditions(payLoad,callback);

            expect(request.get.args[0][1]).to.be.a('function');
        });

        it('should call the callback with an error if `request.get` returns an error', function(){
            var payLoad ={
                route:'testRoute',
                state: 'testState',
                city:'testCity'
            };
            var callback = sinon.stub();
            var errorResponse={
                speech: 'httpError : Error when calling weather api. The developer are looking into this',
                cardText: 'httpError : Error when calling weather api. The developer are looking into this'
            }

            request.get.callsArgWith(1,'httpError');

            weatherUtil._getConditions(payLoad,callback);

            expect(callback.args).to.eql([[errorResponse, null]]);
        });

        it('should call the callback with an error if the response contains an error property', function(){
            var payLoad ={
                route:'testRoute',
                state: 'testState',
                city:'testCity'
            };
            var callback = sinon.stub();
            var body = {
                response:{
                    error: {
                        description: 'some random error'
                    },
                    current_observation:{
                        feelslike_c: '55',
                        UV:'5'
                    }
                }
            };
            var errorResponse={
                speech: body.response.error.description,
                cardText: body.response.error.description
            };

            request.get.callsArgWith(1,null, null, JSON.stringify(body));

            weatherUtil._getConditions(payLoad,callback);

            expect(callback.args).to.eql([[errorResponse, null]]);
        });
    })

});