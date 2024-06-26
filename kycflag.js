// Enable KYC flag on account & freeze the transaction for manual signing
const transaction = await new TokenGrantKycTransaction()
.setAccountId(accountId)
.setTokenId(tokenId)
.execute(client);

// Sign with kyc private key of the token
const signTx = await transaction.sign(kycKey);

// Submit the transation to a Hedera Network
const txResponse = await signTx.execute(client);

// Get receipt
const receipt = txResponse.getReceipt(client);

// transaction status
const transacctionStatus = receipt.status;

console.log("Transaction status : " +transacctionStatus.toString())
