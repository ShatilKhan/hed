const { TokenAssociateTransaction } = require("@hashgraph/sdk");

// Associate a token to an account & freeze the unsigned transaction for signing
const transaction = await new TokenAssociateTransaction()
.setAccountId(accountId)
.setTokenIds(tokenId)
.freezeWith(client);

// Sign with the private key of the account that is being associated to a token
const signTx = await transaction.sign(accountKey);

// Submit the transaction to a hedera network
const txResponse = await signTx.execute(client);

//Request the receipt of the transaction
const receipt = await txResponse.getReceipt(client);

// Get the transaction consensus status
const transactionStatus = receipt.status;

console.log("The transaction consensus is :" +transactionStatus.toString());