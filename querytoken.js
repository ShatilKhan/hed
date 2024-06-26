// Create the query

const query = new
TokenInfoQuery().setTokenId(tokenId);

const tokenInfo = await query.execute(client);

console.log(tokeninfo);