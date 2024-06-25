const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction } = require("@hashgraph/sdk");
require('dotenv').config();


async function environmentSetup() {
    // Grad Account Id & Private Key from .env file
    const accountId = process.env.ACCOUNT_ID;
    const privateKey = process.env.PRIVATE_KEY;

     // If not able to grab credentials, throw error
     if(!accountId || !privateKey) {
        throw new Error("Envrionment vars accountId & privateKey must be present!")
    }

    // Create Hedera testnet client
    const client = Client.forTestnet();

    // Set my account as the client's operator
    client.setOperator(accountId, privateKey );

    // Set default maxx trx fee in hbar
    client.setDefaultMaxTransactionFee(new Hbar(100));

    // Set Max payment for queries in hbar
    client.setDefaultMaxQueryPayment(new Hbar(50));

   
}

environmentSetup();



