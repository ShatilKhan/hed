// IPFS content identifier for which we will create an NFT
CID = ["QmTzWcVfk88JRqjTpVwHzBeULRTNzHY7mnBSG42CpwHmPa"];
// Mint new NFT
let mintTx = await new TokenMintTransaction()
.setTokenId(tokenId)
.setMetadata([Buffer.from(CID)])
.freezeWith(client);

// Sign transaction with the supply key
let mintTxSign = await mintTx.sign(supplyKey);

// Submit to hedera net
let mintTxSubmit = await mintTxSign.execute(client);

// Get the transaction receipt
let mintRx = await mintTxSubmit.getReceipt(client);

// Log the serial number
console.log(`Created NFT ${tokenId} with serial: ${mintRx.serials[0].low} \n`);