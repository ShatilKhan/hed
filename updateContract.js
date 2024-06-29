const transaction = await new ContractUpdateTransaction()
    .setContractId(contractId)
    .setAdminKey(adminKey)
    .setMaxTransactionfee(new Hbar(20))
    .freezeWith(client);

// Sign with old & new admin key - every time we execute a smart contract , 
// a new admin key is created
const signTx = await(await transaction
    .sign(newAdminKey))
    .sign(adminKey);

// Sign with client operator private key & submit to hedera net
const txResponse = await signTx.execute(client);

// Request the receipt of tranX
const receipt = await txResponse.getReceipt(client);

// get status
const transactionStatus = receipt.status;

console.log("The consensus status of the transaction : " 
+transactionStatus);