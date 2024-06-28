const { Client, 
    PrivateKey, 
    AccountCreateTransaction, 
    AccountBalanceQuery,
    Hbar, 
    TransferTransaction,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    TokenAssociateTransaction, 
    TokenMintTransaction} = require("@hashgraph/sdk");
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

    // create the NFT
    const nftCreate = await new TokenCreateTransaction()
        .setTokenName("yamatut")
        .setTokenSymbol("𓂍")
        .setTokenType(TokenType.NonFungibleUnique)
        .setDecimals(0)
        .setInitialSupply(0)
        .setTreasuryAccountId(myAccountId)
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(250)
        .setSupplyKey(supplyKey)
        .freezeWith(client);


    // Log the supply key
    console.log(`- Supply Key : ${supplyKey} \n`);
    

    // Sign tranx
    const nftCreateTxSign = await nftCreate.sign(myPrivateKey);

    // Submit to network
    const nftCreateSubmit = await nftCreateTxSign.execute(client);

    // Receipt
    const nftCreateRx = await nftCreateSubmit.getReceipt(client);

    // Get token ID
    const tokenId = nftCreateRx.tokenId;

    // Log the token ID
    console.log(`- Created NFT with Token ID : ${tokenId} \n`);

    // Max tranX fee as a constant
    const maxTransactionFee = new Hbar(20);

    // IPFS content indentifiers for which we will create a NFT
    const CID = [
        Buffer.from(
          "ipfs://bafyreiao6ajgsfji6qsgbqwdtjdu5gmul7tv2v3pd6kjgcw5o65b2ogst4/metadata.json"
        ),
        Buffer.from(
          "ipfs://bafyreic463uarchq4mlufp7pvfkfut7zeqsqmn3b2x3jjxwcjqx6b5pk7q/metadata.json"
        ),
        Buffer.from(
          "ipfs://bafyreihhja55q6h2rijscl3gra7a3ntiroyglz45z5wlyxdzs6kjh2dinu/metadata.json"
        ),
        Buffer.from(
          "ipfs://bafyreidb23oehkttjbff3gdi4vz7mjijcxjyxadwg32pngod4huozcwphu/metadata.json"
        ),
        Buffer.from(
          "ipfs://bafyreie7ftl6erd5etz5gscfwfiwjmht3b52cevdrf7hjwxx5ddns7zneu/metadata.json"
        )
      ];

    // Mint new batch of NFTs
    const mintTx = new TokenMintTransaction()
      .setTokenId(tokenId)
      .setMetadata(CID) //Batch minting up to 10 nfts in a single transaction
      .setMaxTransactionFee(maxTransactionFee)
      .freezeWith(client);

    // Sign TranX with supply key
    const mintTxSign = await mintTx.sign(supplyKey);

    // submit to net
    const mintTxSubmit = await mintTxSign.execute(client);

    // Receipt
    const mintRx = await mintTxSubmit.getReceipt(client);

    //Log the serial number
    console.log(`- Created NFT ${tokenId} with Serial : ${mintRx.serials[0].low} \n`);

    // Associate transaction & sign with new account id 
    const associateNewTx = await new TokenAssociateTransaction()
      .setAccountId(newAccountId)
      .setTokenIds([tokenId])
      .freezeWith(client)
      .sign(newAccountPrivateKey);

    // Submit to net
    const associateNewTxSubmit = await associateNewTx.execute(client);

    // Receipt
    const associateNewRx = await associateNewTxSubmit.getReceipt(client);

    // Confirm tranX success
    console.log(`- NFT association with new account: ${associateNewRx.status} \n`)



    //BALANCE CHECK
    var balanceCheckTx = await new AccountBalanceQuery()
        .setAccountId(myAccountId)
        .execute(client);

    console.log(`- My account balance balance:
     ${balanceCheckTx.tokens._map.get(tokenId.toString())}
      NFTs of ID ${tokenId}`);

    var balanceCheckTx = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log(`- New Account balance: 
    ${balanceCheckTx.tokens._map.get(tokenId.toString())}
     NFTs of ID ${tokenId}`);

    
    // Transfer NFT from my sccount to new account
    // sign with my pruvate key
    const tokenTransferTx = await new TransferTransaction()
      .addNftTransfer(tokenId, 1, myAccountId, newAccountId)
      .freezeWith(client)
      .sign(myPrivateKey);

    // submit to net
    const tokenTransferSubmit = await tokenTransferTx.execute(client);

    // receipt
    const tokenTransferRx = await tokenTransferSubmit.getReceipt(client);
    
    console.log(`\NFT transfer from my account to new account: 
        ${tokenTransferRx.status} \n`);

     //BALANCE CHECK
     var balanceCheckTx = await new AccountBalanceQuery()
     .setAccountId(myAccountId)
     .execute(client);

    console.log(`- My account balance balance:
        ${balanceCheckTx.tokens._map.get(tokenId.toString())}
        NFTs of ID ${tokenId}`);

     var balanceCheckTx = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log(`- New Account balance: 
        ${balanceCheckTx.tokens._map.get(tokenId.toString())}
        NFTs of ID ${tokenId}`);


}


environmentSetup();



