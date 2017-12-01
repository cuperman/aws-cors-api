const AWS = require('aws-sdk');

const ITEM_TABLE = process.env.ITEM_TABLE;

const OK = 200;
const CREATED = 201;
const NOT_IMPLEMENTED = 501;

function documentClient() {
  return new AWS.DynamoDB.DocumentClient();
}

exports.create = (event, context, callback) => {
  const doc = documentClient();
  const body = JSON.parse(event.body);
  const item = body.item;

  doc.put({
    TableName: ITEM_TABLE,
    Item: item
  }, (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        statusCode: CREATED,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    }
  });
};

exports.index = (event, context, callback) => {
  const doc = documentClient();

  doc.scan({
    TableName: ITEM_TABLE
  }, (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {
        statusCode: OK,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    }
  });
};

exports.show = (event, context, callback) => {
  callback(null, {
    statusCode: NOT_IMPLEMENTED
  });
};

exports.update = (event, context, callback) => {
  callback(null, {
    statusCode: NOT_IMPLEMENTED
  });
};

exports.delete = (event, context, callback) => {
  callback(null, {
    statusCode: NOT_IMPLEMENTED
  });
};
