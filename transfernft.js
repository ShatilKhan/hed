// Transfer NFT from treasury to alice
// Sign with treasury key to authorize transfer
let tokenTransferTx = await new TransferTransaction()
.addNftTransfer(tokenId, 1, treasuryId, aliceId)
.freezeWith(client)
.sign(treasuryKey);

let tokenTransferSubmit = await tokenTransferTx.execute(client);
let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

console.log(`\n- NFT transfer from treasury to Alice
 : ${tokenTransferRx.status} \n`);