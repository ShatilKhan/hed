// Burn 1000 tokens & freeze the unsigned transaction for manual signing
const transaction = await new TokenBurnTransaction()
.setTokenId(tokenId)
.setAmount(1000)
.freezeWith(client);

// Sign with the supply private key of the token
const signTx = await transaction.sign(supplyKey);

// Submit the transaction to a Hedera Network
const txresponse = await signTx.execute(client);

// Request the receipt of the transaction
const receipt = await txresponse.getreceipt(client);

// get transaction consensus status
const transactionStatus = receipt.status;

console.log("the transaction consensus status is : " 
+transactionStatus.toString());