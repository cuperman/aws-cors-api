const AWS = require('aws-sdk');

const ITEM_TABLE = process.env.ITEM_TABLE;

const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;
const INTERNAL_SERVER_ERROR = 500;

function documentClient() {
  return new AWS.DynamoDB.DocumentClient();
}

function jsonResponse(statusCode = 200, body = '', headers = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  return {
    statusCode: statusCode,
    body: body ? JSON.stringify(body) : '',
    headers: Object.assign({}, defaultHeaders, headers)
  };
}

function attributeUpdates(attributes = {}) {
  let updates = {};

  Object.keys(attributes).forEach(key => {
    const value = attributes[key];
    updates[key] = {
      Action: 'PUT',
      Value: value
    };
  });

  return updates;
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
      callback(null, jsonResponse(INTERNAL_SERVER_ERROR, err));
    } else {
      callback(null, jsonResponse(CREATED, data));
    }
  });
};

exports.index = (event, context, callback) => {
  const doc = documentClient();

  doc.scan({
    TableName: ITEM_TABLE
  }, (err, data) => {
    if (err) {
      callback(null, jsonResponse(INTERNAL_SERVER_ERROR, err));
    } else {
      callback(null, jsonResponse(OK, data));
    }
  });
};

exports.show = (event, context, callback) => {
  const doc = documentClient();
  const name = event.pathParameters.itemName;

  doc.get({
    TableName: ITEM_TABLE,
    Key: {
      Name: name
    }
  }, (err, data) => {
    if (err) {
      callback(null, jsonResponse(INTERNAL_SERVER_ERROR, err));
    } else {
      callback(null, jsonResponse(OK, data));
    }
  });
};

exports.update = (event, context, callback) => {
  const doc = documentClient();
  const name = event.pathParameters.itemName;
  const body = JSON.parse(event.body);
  const attributes = body.item;

  doc.update({
    TableName: ITEM_TABLE,
    Key: {
      Name: name
    },
    AttributeUpdates: attributeUpdates(attributes)
  }, (err, data) => {
    if (err) {
      callback(null, jsonResponse(INTERNAL_SERVER_ERROR, err));
    } else {
      callback(null, jsonResponse(OK, data));
    }
  });
};

exports.destroy = (event, context, callback) => {
  const doc = documentClient();
  const name = event.pathParameters.itemName;

  doc.delete({
    TableName: ITEM_TABLE,
    Key: {
      Name: name
    }
  }, (err) => {
    if (err) {
      callback(null, jsonResponse(INTERNAL_SERVER_ERROR, err));
    } else {
      callback(null, jsonResponse(NO_CONTENT));
    }
  });
};
