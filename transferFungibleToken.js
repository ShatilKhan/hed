// Create Transafer transaction
const transaction = await new TransferTransaction()
.addTokenTransfer(tokenId, accouintId1, -10)
.addTokenTransfer(tokenId, accountId2, 10)
.freezeWith(client);

// Sign with the sender account private key
const signTx = await transaction.sign(accountKey1);

// Sign with client operator private key & submit to a Hedera Network
const txResponse = await signTx.execute(client);

// Request the receipt of transaction
const receipt = await txResponse.getReceipt(client);

// Obtain transaction consensus status
const transactionStatus = receipt.status;

console.log("The transaction consensus status: " +transactionStatus.toString()); 