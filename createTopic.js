// Create the transaction
const transaction = await new TopicCreateTransaction();

// Sign with client operator private key & submit the transaction to Hedera Network
const txResponse = await transaction.execute(client);

// Request the receipt of transaction 
const receipt = await txResponse.getReceipt(client);

// Get topic ID
const newTopicId = receipt.topicId;

console.log("The new topic ID is : " + newTopicId);