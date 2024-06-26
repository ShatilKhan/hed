// Create the token pause transaction, specify the token to pause, 
// freeze the unsigned transaction for signing
const transaction = new TokenPauseTransaction()
.setTokenId(tokenId)
.freezeWith(client);

// Sign with pause key
const signTx = await transaction.sign(pauseKey);

// Submit tx to hedera net
const txResponse = await signTx.execute(client);

// Request the receipt of the transaction
const receipt = await txResponse.getReceipt(client);

// Get the transaction consensus status
const transactionStatus = receipt.status;

console.log("The transaction sonsensus status: " +transactionStatus.toString())
