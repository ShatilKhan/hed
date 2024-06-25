const { Client, 
    PrivateKey, 
    AccountCreateTransaction, 
    AccountBalanceQuery,
    Hbar, 
    TransferTransaction } = require("@hashgraph/sdk");
require('dotenv').config();


async function environmentSetup() {
    // Grad Account Id & Private Key from .env file
    const myAccountId = process.env.ACCOUNT_ID;
    const myPrivateKey = PrivateKey.fromStringECDSA(process.env.PRIVATE_KEY);

     // If not able to grab credentials, throw error
     if(!myAccountId || !myPrivateKey) {
        throw new Error("Envrionment vars accountId & privateKey must be present!")
    }

    // Create Hedera testnet client
    const client = Client.forTestnet();

    // Set my account as the client's operator
    client.setOperator(myAccountId, myPrivateKey );

    // Set default maxx trx fee in hbar
    client.setDefaultMaxTransactionFee(new Hbar(100));

    // Set Max payment for queries in hbar
    client.setDefaultMaxQueryPayment(new Hbar(50));

    // Create new keys
    const newAccountPrivateKey = PrivateKey.generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    // Create new account with 1000 tinybars starting balance
    const newAccount = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(1000))
        .execute(client);

    // Get the new account ID
    const getReceipt = await newAccount.getReceipt(client);
    const newAccountId = getReceipt.accountId;

    // Log the account ID
    console.log("The new account ID is : " +newAccountId);

    // Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    // Log the account balance
    console.log("The new account balance is : " +accountBalance.hbars.toTinybars() + " tinybar.");

    // Create the transfer transaction
    const sendHbar = await new TransferTransaction()
        .addHbarTransfer(myAccountId, Hbar.fromTinybars(-1000)) //Sending Account
        .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000)) //Receiving Account
        .execute(client);

    // Verify the transaction reached consensus
    const transactionReceipt = await sendHbar.getReceipt(client);
    console.log("The transfer from my account to new account was : " + transactionReceipt.status.toString() );
   
    // Request cost of query
    const queryCost = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .getCost(client);

    // Log the cost of query 
    console.log("The cost of query is : " +queryCost);

    // Check the new account's balance
    const getNewBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    // Log the balance after transfer
    console.log(" The account balance after the transfer is: " +getNewBalance.hbars.toTinybars() + " tinybars.")
}


environmentSetup();



