// Smart Contract using Hedera 

// Create TranX
const contractCreate = new ContractCreateFlow()
    .setGas(100000)
    .setBytecode(bytecode);

    // Sign & submit to net
    const txResponse = contractCreate.execute(client);

    // Get receipt
    const receipt = (await txResponse).getreceipt(client);

    // Get new contract ID
    const newContractId = (await receipt).contractid;
    console.log("The new contract ID is : " +newContractId);