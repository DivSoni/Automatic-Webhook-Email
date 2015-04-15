# Automatic Webhook Email Example App

This is a node.js app that listens to Automatic](http://automatic.com) webhooks and sends an email when a users "Check Engine" light comes on with the MIL code and description.

This app demonstrates the use of the [Automatic Webhook API](http://developer.automatic.com).

## Installation

### Install node and gulp

    brew install node

    npm install gulp -g

### Install required packages from NPM:

    npm install

### Configure your client id and client secret

Copy the file `config-sample.json` to `config.json` and add your Automatic client id, Automatic client secret, Sendgrid username and Sendgrid password.  Alternatively, create environment variables for each item listed in `config-sample.json`.

### Run the app locally, with debug logging

    DEBUG=automatic-webhook-email gulp develop

### View the app

Open `localhost:3000` in your browser.

### Testing locally, skipping oAuth

You can test locally as a logged in user, bypassing the oAuth login by including a `TOKEN` and `USER_ID` when running the app.

    TOKEN=<YOUR-AUTOMATIC-ACCESS-TOKEN> USER_ID=<YOUR-AUTOMATIC-USER-ID> DEBUG=automatic-webhook-email gulp develop

### Testing webhooks locally

Post to `localhost:3000/webhook` an example webhook JSON:

```
{
  "id": "E_63db5c25ffd955ba",
  "user": {
    "id": "2fcd8161801e95d1e615",
    "v2_id": "U_9855dcf2030c0111"
  },
  "type": "mil:on",
  "created_at": 1383448450201,
  "time_zone": "America/Los_Angeles",
  "location": {
    "lat": 37.757076,
    "lon": -122.448120,
    "accuracy_m": 10
  },
  "vehicle": {
    "uri": "https://api.automatic.com/v1/vehicles/529e5772e4b00a2ddb562f1f",
    "id": "C_8e7b567626c26695",
    "year": 2001,
    "make": "Acura",
    "model": "MDX",
    "color": "#d15fed",
    "display_name": "My Speed Demon"
  },
  "dtcs": [
    {
      "code": "P0442",
      "description": "Small fuel vapor leak in EVAP system",
      "start": 1383448450301
    }
  ]
}

```

Update the example JSON to match the user id of a user stored in your local mongo `users` collection.  This user must have a valid access token stored in the database to actually trigger an email.


### Formatting email

The email is generated in `libs/helpers.js` in two functions: `formatEmail` and `formatHTMLEmail`.

## Modifying

This app uses SASS and React which are compiled by gulp into the `public/dest` and `public/css` folders.

## Deploying

### Add ons

The app is can be deployed on Heroku with MongoLab, RedisCloud and SendGrid addons.

### Environment Variables

Add all the items in config-sample.json as heroku environment variables as well as a `NODE_ENV` variable set to `production`.
