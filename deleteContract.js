const transaction = await new ContractDeleteTransaction()
    .setContractId(contractId)
    .freezeWith(client);

// Sign with adminKey
const signTx = await transaction.sign(adminKey);

// Sign with client operator private key 
const txResponse = await signTx.execute(client);

// Get receipt
const receipt = await txResponse.getReceipt(client);

// Get status
const transactionStatus = receipt.status;

console.log("The transaction sonsensus status : " 
+transactionStatus);