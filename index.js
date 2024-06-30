const { Client, 
    PrivateKey, 
    FileCreateTransaction, 
    ContractCreateTransaction,
    ContractFunctionParameters,
    ContractCallQuery,
    ContractExecuteTransaction} = require("@hashgraph/sdk");
require('dotenv').config();



async function environmentSetup() {
    // Grad Account Id & Private Key from .env file
    const myAccountId = process.env.ACCOUNT_ID;
    const myPrivateKey = PrivateKey.fromStringECDSA(process.env.PRIVATE_KEY);

     // If not able to grab credentials, throw error
     if(!myAccountId || !myPrivateKey) {
        throw new Error("Envrionment vars accountId & privateKey must be present!")
    }

    // Create Hedera testnet client
    const client = Client.forTestnet();

    // Set my account as the client's operator
    client.setOperator(myAccountId, myPrivateKey );



    //Import the compiled contract from the HelloHedera.json file
    let helloHedera = require("./HelloHedera.json");
    const bytecode = helloHedera.data.bytecode.object;

    // Create a file on Hedera & store the hex-encoded bytecode
    const fileCreateTx = new FileCreateTransaction()
        .setContents(bytecode);

    // Sign & cubmit to net
    const submitTx = await fileCreateTx.execute(client);

    // Receipt
    const fileReceipt = await submitTx.getReceipt(client);

    // File ID from receipt
    const byetcodeFileId = fileReceipt.fileId;

    console.log("The smart contract byte code file ID is : "
     +byetcodeFileId);


    // Instantiate the contract instance
    const contractTx = await new ContractCreateTransaction()
        .setBytecodeFileId(byetcodeFileId)
        .setGas(100000)
        .setConstructorParameters(
            new ContractFunctionParameters()
            .addString("Hello Hedera"));

    // Submit to net
    const contractRx = await contractTx.execute(client);

    // receipt
    const contractReceipt = await contractRx.getReceipt(client);

    // Get smart contract ID
    const newContractId = contractReceipt.contractId;

    console.log("The smart contract ID is "  
    +newContractId);
   

    // Call smart contract
    const contractCall = await new ContractCallQuery()
        .setGas(100000)
        .setContractId(newContractId)
        .setFunction("get_message")
        .setQueryPayment(new Hbar(2));

    // Submit to net
    const getMessage = await contractCall.execute(client);

    // get string from result @ index 0
    const message = getMessage.getString(0);

    console.log("The contract message: " + message); 

    // Create tranX to update the contract msg
    const contractExecTx = await new ContractExecuteTransaction()
            .setContractId(newContractId)
            .setGas(100000)
            .setFunction("set_message", new ContractFunctionParameters()
                .addString("Hello Again!"));

    // submit to net
    const submitExecTx = await contractExecTx.execute(client);

    // receipt
    const execReceipt = await submitExecTx.getReceipt(client);
    
    console.log("The transaction status is : " 
    +execReceipt.status.toString());

    // Query contract fro message
    const contractCallQuery = new ContractCallQuery()
            .setContractId(newContractId)
            .setGas(100000)
            .setFunction("get_message")
            .setQueryPayment(new Hbar(2));

    // submit
    const querySubmit = await contractCallQuery.execute(client);

    // get updated message at index 0
    const newMessage = querySubmit.getString(0);

    console.log("The updated contract message: " +newMessage);

}


environmentSetup();



