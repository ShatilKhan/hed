const { TokenUnfreezeTransaction } = require("@hashgraph/sdk");

// Freeze an account from transferring a token
const transaction = await new TokenfreezeTransaction()
.setAccountId(accountId)
.setTokenId(tokenId)
.freezeWith(client);

// sign with the freeze key of the token
const signTx = await transaction.sign(freezeKey);

// Submit the transaction to a Hedera Netrwork
const txResponse = await signTx.execute(client);

// Request receipt of transaction
const receipt = await txResponse.getreceipt(client);

// Get transaction consesnsus status
const transactionStatus = receipt.status;

console.log("The transaction consensus status: " +transactionStatus.toString())