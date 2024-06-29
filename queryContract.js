const query = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(600)
    .setFunction("great");

// Sign with client operator private key to pay for the query & submit to net
const contractCallResult = await query.execute(client);

// Get the fucntion value
const message = contractCallResult.getString(0);

console.log("Contract Message: " +message);