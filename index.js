const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction } = require("@hashgraph/sdk");
require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 4000;  // Read from .env if not available then defaults to 4000
const accountId = process.env.ACCOUNT_ID;
const privateKey = process.env.PRIVATE_KEY;


const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
  console.log(accountId, privateKey);
});

async function environmentSetup() {
    const accountId = process.env.ACCOUNT_ID;
    const privateKey = process.env.PRIVATE_KEY;

    console.log(accountId, privateKey);
}

