// Wipe 100 tokens from an account &  
// freeze the unsigned transaction for manual signing

const transaction = await new TokenWipeTransaction()
.setAccountId(accountId)
.setTokenId(tokenId)
.setAmount(100)
.freezeWith(client);

// Sign with payer account private key, 
// sign with the wipe private key of the token
const signTx = await (await transaction.sign(accountKey)).sign(wipeKey);

// Submit the transaction to a Hedera Net
const txResponse = await signTx.execute(client);

// Request the receipt of the transaction
const receipt = await txResponse.getReceipt(client);

// Consensus Status
const transactionStatus = receipt.status;

console.log("The transaction consensus status is :"  +transactionStatus.toString())