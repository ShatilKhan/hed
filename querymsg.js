new TopicMessageQuery()
.setTopicId(topicId)
.setStartTime(0)
.subscribe(
    client,
    (message) => 
    console.log(Buffer.from(message.contents, "utf8").toString())
);