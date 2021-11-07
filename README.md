# NextDapp / DFINITY Integration

This is a starter app to develop an DFINITY dapp with [NextDapp](https://warashibe.github.io/next-dapp/) framework.

[Our motoko smart contract](src/nxd/main.mo) extends the todo example from [this DFINITY tutorial](https://smartcontracts.org/docs/developers-guide/tutorials/multiple-actors.html).

Import `nd/dfx`.

```javascript
import dfx from "nd/dfx"
```
Then, use it like below to connect to a DFINITY canister (`nxd`) and execute a function (`getTodos`).

```javascript
await dfx("nxd").getTodos()
```

That's it!

Refer to [/pages/index.js](pages/index.js) for a super simple one page todo app.

## How to run

```bash
git clone https://github.com/warashibe/nextdapp-dfinity.git
cd nextdapp-dfinity
yarn
dfx start --background
dfx deploy
yarn dev
```

Now your app is running at [localhost:3000](http://localhost:3000).
