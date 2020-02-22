console.log('Loading function');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
 
// Create the DynamoDB service object
var dynamo = new AWS.DynamoDB({apiVersion: '2012-08-10'});

/**
 * HTTP endpoint using API Gateway. You have full access to the request 
 * and response payload, including headers and status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    switch (event.httpMethod) {
        case 'DELETE':
            dynamo.deleteItem(JSON.parse(event.body), done);
            break;
        case 'GET':
            dynamo.scan({ TableName: event.queryStringParameters.TableName }, done);
            break;
        case 'POST':
            dynamo.putItem(event.queryStringParameters, done);
            break;
        case 'PUT':
            dynamo.updateItem(JSON.parse(event.queryStringParameters), done);
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};
