// Mint another 1000 tokens & freeze the unsigned transaction for manual signing
const transaction = await new TokenMintTransaction()
.setTokenId(tokenId)
.setAmount(1000)
.freezeWith(client);

// Sign with the supply private key of the token 
const signTx = await transaction.sign(supplyKey);

// Submit the transaction to a hedera network
const txResponse = await signTx.execute(client);

// Request the receipt of the transaction
const receipt = await txResponse.getReceipt(client);

// get transaction consensus status
const transactionStatus = receipt.status;

console.log("the tranbsaction consensus status: " 
+transactionStatus.toString());
