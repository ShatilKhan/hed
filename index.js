const { Client, 
    PrivateKey, 
    AccountCreateTransaction, 
    AccountBalanceQuery,
    Hbar, 
    TransferTransaction,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    TokenAssociateTransaction } = require("@hashgraph/sdk");
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

    // Generate Supply key
    const supplyKey = PrivateKey.generate();

    // create fungible token            
    let tokenCreateTx = await new TokenCreateTransaction()
        .setTokenName("yamatut")
        .setTokenSymbol("𓂍")
        .setTokenType(TokenType.FungibleCommon)
        .setDecimals(2)
        .setInitialSupply(10000)
        .setTreasuryAccountId(myAccountId)
        .setSupplyType(TokenSupplyType.Infinite)
        .setSupplyKey(supplyKey)
        .freezeWith(client);

    // Sign with treasury key
    let tokenCreateSign = await tokenCreateTx.sign(myPrivateKey);

    // submit to hedera net
    let tokenCreateSubmit = await tokenCreateSign.execute(client);

    // gete receipt
    let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);

    // Get token Id
    let tokenId = tokenCreateRx.tokenId;

    // Log token Id 
    console.log(`= Created token with ID: ${tokenId} \n`)
   
    // Token association with new account
    let transaction = await new TokenAssociateTransaction()
        .setAccountId(newAccountId)
        .setTokenIds([tokenId])
        .freezeWith(client)
        
    // Sign transaction with owner/operator private key
    const signTx = await transaction.sign(newAccountPrivateKey)

    // Send tx to hedera net
    const txResponse = await signTx.execute(client);

    // Get Receipt
    let associateRx = await txResponse.getReceipt(client);

    // Tranx Status
    const transactionStatus = associateRx.status

    // log tranx status
    console.log("Trnasaction of association was : " +transactionStatus);

    //BALANCE CHECK
    var balanceCheckTx = await new AccountBalanceQuery()
        .setAccountId(myAccountId)
        .execute(client);

    console.log(`- My account balance balance:
     ${balanceCheckTx.tokens._map.get(tokenId.toString())}
      units of token ID ${tokenId}`);

    var balanceCheckTx = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log(`- New Account balance: 
    ${balanceCheckTx.tokens._map.get(tokenId.toString())}
     units of token ID ${tokenId}`);


    // Transfer token to new account
    const transferTransaction = await new TransferTransaction()
        .addTokenTransfer(tokenId, myAccountId, -10)
        .addTokenTransfer(tokenId, newAccountId, 10)
        .freezeWith(client);

    // Sign with my private key(treaury key)
    const signTransferTx = await transferTransaction.sign(myPrivateKey);

    // Submit to hedera net
    const txTransferRx = await signTransferTx.execute(client);

    // Get rceipt
    const transferTxReceipt = await txTransferRx.getReceipt(client);

    // Status
    const transferStatus = transferTxReceipt.status;

    console.log("Transaction of transafer was : " +transferStatus)

    //BALANCE CHECK
    var balanceCheckTx = await new AccountBalanceQuery()
        .setAccountId(myAccountId)
        .execute(client);

    console.log(`- My account balance balance:
     ${balanceCheckTx.tokens._map.get(tokenId.toString())}
      units of token ID ${tokenId}`);

    var balanceCheckTx = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);
        
    console.log(`- New Account balance: 
    ${balanceCheckTx.tokens._map.get(tokenId.toString())}
     units of token ID ${tokenId}`);

}


environmentSetup();



