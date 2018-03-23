# Blocktax

Cryptocurrency finance app designed for the Blockstack browser.

## Local Development

To run this, you need:

- A Coinbase account
- Blockstack installed
- Node.js

```shell
git clone git@github.com:gakimball/blocktax
cd blocktax
npm i
```

Copy `.env_example` to `.env` and fill in the ID and secret of a Coinbase app.

To start the app run `yarn start`.

To deploy the app to Github pages run `yarn start`.


## Code style

I'd recommend following the code style of the project, which uses the liner XO. There are various IDE plugins for it, or you can run `npx xo` to do a one-off lint.
