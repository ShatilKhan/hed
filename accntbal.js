// Create account balance query
const query = new AccountBalanceQuery()
.setAccountId(accountId);

// Submit the query to a hedera network
const accountBalance = await query.execute(client);

// Print the balance of hbars
console.log("The hbar accnt balance for this account is : " + accountBalance.hbars);