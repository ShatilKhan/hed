const { ContractExecuteTransaction, ContractFunctionParameters } = require("@hashgraph/sdk");

const transaction = new ContractExecuteTransaction()
    .setContractId(newContractId)
    .setGas(100_000_000)
    .setFunction("set_message", new ContractFunctionParameters()
    .addString("Hello Hedera"));

// Sign with client operator private key & submit to net
const txResponse = await transaction.execute(client);

// receipt
const receipt = await txResponse.getReceipt(client);

// Status
const transactionStatus = receipt.status;

console.log("The tranX consnsus status : " +transactionStatus);