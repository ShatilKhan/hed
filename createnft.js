let nftCreate = await new TokenCreateTransaction()
.setTokenName("voidcoin")
.setTokenSymbol("𓁾")
.setTokenType(TokenType.NonFungibleUnique)
.setdecimals(0)
.setInitialSupply(0)
.setTreasuryAccountId(treasuryId)
.setSupplyType(TokenSupplyType.Finite)
setMaxSupply(250)
.setSupplyKey(supplyKey)
.freezeWith(client);

// Sign transaction with treasury key
let nftCreateTxSign = await nftCreate.sign(treasuryKey);

// Submit to Hedera Net
let nftCreateSubmit = await nftCreateTxSign.execute(client);

// Get status
let nftCreateRx = await nftCreateSubmit.getReceipt(client);

// Get toiken id
let tokenId = nftCreateRx.tokenId;
