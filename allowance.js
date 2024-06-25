const transaction = new
AccountAllowanceApproveTransaction()
.approvedHbarAllowance(ownerAccount, 
    spenderAccountId, 
    Hbar.from(100));

// Sign the transaction with owner account
const signTx = await transaction.sign(ownerAccountKey);

// Sign the transaction with client operator private key & send to hedera network
const txResponse = await signTx.execute(client);

// Request the receipt of the tranx
const receipt = await txResponse.getReceipt(client);