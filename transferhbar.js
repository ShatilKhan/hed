const sendHbar = await new TransferTransaction()
.addHbarTransfer(accountId, Hbar.fromTinybars(-1000))
.addHbarTransfer(newAccountId, Hbar.fromTinybars(1000))
.execute(client);

// Verify the transaction reached consensus
const transactionReceipt = await sendHbar.getReceipt(client);
console.log("Transfer transaction to new account: " +
 transactionReceipt.status.toString()
 )
