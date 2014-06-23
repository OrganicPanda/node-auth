# Node Auth Boilerplate

Boilerplate project for quickly getting up and running with authentication on Node. Uses Express, Passport and Mongo. Comes with local user auth and a few OAuth providers. This project has been designed for easy swapping of providers.

Probably best not to use the local strategy for now until the password is properly salted.

Forked from [scotch-io](https://github.com/scotch-io/easy-node-authentication/) but heavily modified.

## Setup

1. `$ git clone git@github.com:organicpanda/node-auth`
2. `$ npm install`
3. `$ cp config/database.js.tmpl config/database.js` and fill out
4. `$ cp config/keys.js.tmpl config/keys.js` and fill out
6. `$ node server.js`
7. Visit in your browser at: `http://localhost:8080`

## TODO

- [ ] Merge accounts more intelligently
- [ ] Salt the local user's password
- [ ] Async password hashing
