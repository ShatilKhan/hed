// Create the query

const balanceQuery = new 
AccountBalanceQuery().setAccountId(operatorId);

// Sign with the client operator private key & submit to hedera network

const tokenBalance = await balanceQuery.execute(client);

console.log(tokenBalance);