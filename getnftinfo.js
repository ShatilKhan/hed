const nftInfos = await new
TokenNftInfoQuery()
.setNftId(nftId)
.execute(client);