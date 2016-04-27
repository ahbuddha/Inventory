# Inventory
A RESTful API
#### This is a nodejs app

----------

## Quick start (1st time install)
Make sure you have installed [nodejs](https://nodejs.org/)
Open a terminal in the main directory and run the following command:
```
$ npm install
```
This will install all dependencies. Now you are ready to start the server or run tests.
```
$ npm start
```

## Running Tests:
Before you can run tests, you need to install mocha globally (see below) and install all dependencies (see above).
```
$ npm install -g mocha
```
Once mocha is installed, navigate to the tests directory and run tests either individually or all at once
```
$ mocha *
```
or
```
$ mocha expired.js
$ mocha restful.js
```

## File structure
All of the routes are in the routes directory under index.js. There is an inventory object that handles all manipulation (add, delete, search, etc.) and is labeled as '_inventory.js'. Everything else is the standard nodejs structure.

## Notifications
The notifications used are sms via twilio. In order for an sms to be received an account must be set up and the following variables must be changed in routes/_twilio.js

var accountSid = 'AC5ef872f6da5a21de157d80997a64bd33';

var authToken = '[AuthToken]';

## Trade-offs
I decided to not use any authentication, I didn’t have enough time. Primarily, methods that are volatile should require authentication. 

The put and delete methods are supposed to be idempotent but I decided that if the user is trying to do something that doesn’t exist, i.e. removing an item that is not there, they should be notified.

In regards to finding an expired item, all I did was create an api call ‘/expired-item’. When this routes is hit, it will search the current data set to find and return all expired items. I decided to do this because finding expired item would most likely be a background job.  Background jobs are key to building truly scalable web apps as they transfer both time and computationally intensive tasks from the web layer to a background process outside the user request/response lifecycle. This ensures that web requests can always return immediately and reduces compounding performance issues that occur when requests become backlogged. So the thought is, that when this background job finds an expired item, it will simply make a request to ‘/expired-item’.
