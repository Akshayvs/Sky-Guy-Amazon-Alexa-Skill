# Sky Guy
Sky Guy is an open source Amazon Alexa skill which provides the user with information about the current weather forecast, the temperature, UV index, and a positive quote.

This application uses the user location permission to get the zip code from the user by calling amazon address api.
This zip code is then fed to Google GeoCoding API to extract the same of the City and State.
The response from Google API is sanitized to extract the required information and a call is made to the API service of The Weather Channel. to fetch weather information.

I have used Node.js as the development language along with amazon alexa node-sdk and AWS lambda for cloud deployment.
I have used Claudia for easy deployment of the app on AWS lambda

Here is a link to the demo Youtube Video : https://www.youtube.com/watch?v=tM3ibvQLKzw

### Good reference resource.

Alexa repository
https://github.com/alexa

Amazon Alexa Developer Home
https://developer.amazon.com/alexa

To run the application locally instead of deploying on aws lambda every single time.
https://github.com/bespoken/bst

Web version of amazon echo.
https://echosim.io/welcome

Sample project and step-by-step walkt-hrough
https://github.com/alexa/skill-sample-nodejs-fact/blob/master/step-by-step/1-voice-user-interface.md

Lodash:
https://lodash.com/docs/4.17.4

Amazon address API
https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/device-address-api

Google GeoCoding API
https://developers.google.com/maps/documentation/geocoding/intro

The Weather Channel Weather API Documentation
https://www.wunderground.com/weather/api/d/docs

### Running Locally

Make sure you have Node.js installed.
If you do not, Install homebrew , NVM  ( Node Version Manager) and Node.js on your machine.
Naviagte into the application root directory.

Create a amazon developer account on  https://developer.amazon.com/

configure the Voice User Interface of your amazon alexa skill by refering this tutorial
https://github.com/alexa/skill-sample-nodejs-fact/blob/master/step-by-step/1-voice-user-interface.md

execute the following command to get all the dependencies installed.

```
npm install
bst proxy lambda index.js
```
Follow the instructions in the link below to link your local host to the alexa skill.
http://docs.bespoken.io/en/latest/tutorials/tutorial_lambda_nodejs/


### TO DO

In future development, i will be adding mocha unit tests for unit testing the code and will be researching on the integration testing best practices.