const client = Client.forTestnet();

client.setOperator(accountId, privateKey)

// Create New Keys
const newAccounrPrivateKey = PrivateKey.generateED25519();
const newAccountPublicKey = newAccountPrivateKey.publicKey;

// Create New account with 1000 tinybar starying balance
const transactionResponse = await new AccountCreateTransaction()
.setKey(newAccountPublicKey)
.setInitialBalance(Hbar.from(10))
.execute(client);


// Get new account ID
const transactionReceipt = await
transactionResponse.getReceipt(client);

const newAccountId = transactionReceipt.accountId;

console.log("The new account ID is : " + newAccountId);
