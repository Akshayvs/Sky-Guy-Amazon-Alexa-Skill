'use strict';

const dataSet = [
    'Change will not come if we wait for some other person or some other time. ' +
    'We are the ones we have been waiting for. We are the change that we seek',
    'If you\'re walking down the right path, and you\'re willing to keep walking. Eventually.. you WILL make progress',
    'The best .. Is yet to come',
    'We Hold these truths to be self-evident... that all men ....are created equal',
    'You can put lipstick on a pig. It\'s still a pig',
    'A change is brought about ...when Ordinary people, Do extra-ordinary things'
];

var qoutesUtil;

module.exports = qoutesUtil = {
    GetNewFactIntent: function GetNewFactIntent(callback) {
        const factIndex = Math.floor(Math.random() * dataSet.length);
        const randomFact = dataSet[factIndex];
        callback(null, randomFact);
    }
};
