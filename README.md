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

## Add a provider

1. Add the keys they provide (usually id and secret) to `config/keys.js`.
2. Modify `app/models/user.js` to add properties for the new data you will be storing. Usually this is `id`, `token`, `email` and `displayName` but different providers give different data.
3. Add a directory under `lib/auth` for your provider and create 2 files in there: `%provider-name%.js` and `routes.js`. 
4. Fill out these files in the same way as the other examples. It's easier to start by copying the Twitter or Facebook examples and modifying for your needs.
5. Add your provider in to `app/passport.js` and `app/routes.js`.
6. Create, patch or drop/recreate your users collection in Mongo.

## Remove a provider

1. Remove the keys from `config/keys.js`.
2. Modify `app/models/user.js` to remove the old provider properties.
3. Remove the provider directory from `lib/auth`.
5. Remove the provider from `app/passport.js` and `app/routes.js`.
6. Create, patch or drop/recreate your users collection in Mongo.

## TODO

- [ ] Merge accounts more intelligently
- [X] ~Salt the local user's password~ (It was already doing this, I wasn't aware bcrypt stores it as part of the hash)
- [X] Async password hashing
- [ ] Make adding and removing providers easier
