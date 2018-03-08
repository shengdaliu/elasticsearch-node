var jsonfile = require('jsonfile');
var fs = require('fs');
var readline = require('readline');
var elasticsearch = require('elasticsearch');

var file = 'stocks.json';

// Streaming the stock.json file
const rl = readline.createInterface({
  input: fs.createReadStream(file)
});

// connect to elasticsearch
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  //log: 'trace'
});

// client.search({
//   index: 'movies',
//   type: 'movie',
//   body: {
//     query: {
//       match: {
//         "fields.directors.keyword": "George Lucas"
//       }
//     }
//   }
// }).then(function (res) {
//     console.log(res.hits[0]);
// }, function (err) {
//     console.trace(err.message);
// });

var i = 1;

rl.on('line', function (line) {
  var jsonObject = JSON.parse(line);

  jsonObject.mongoId = jsonObject['_id']['$oid'];
  delete jsonObject['_id'];

  client.create({
    index: 'stocks',
    type: 'stock',
    id: i.toString(),
    body: jsonObject
  }, function (error, response) {
    if(error)
    {
      console.log(error);
    }
  });
  i++;
});

