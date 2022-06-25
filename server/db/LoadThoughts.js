const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
  region: 'us-west-1',
});

//DocumentClient allows use of JavaScript object as arguments
const dynamodb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
});

//assign the object allUser
console.log('Importing thoughts into DynamoDB. Please wait.');
const allUsers = JSON.parse(
  fs.readFileSync('./server/seed/users.json', 'utf8'),
);

//loop allUser array and create param object
allUsers.forEach(user => {
  const params = {
    TableName: "Thoughts",
    Item: {
      "username": user.username,
      "createdAt": user.createdAt,
      "thought": user.thought
    }
  };

//call to db with service interface object(dynamodb) and use PUT method
  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error("Unable to add thought", user.username, ". Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("PutItem succeeded:", user.username);
    }
  });
});