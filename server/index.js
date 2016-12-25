var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var monk = require('monk');
var mongo = require('mongodb');
var db = monk('localhost:27017/test');

var port = 5000;
var badRequest = 400;
var unauthorizedRequest = 401;

app.set('port', (process.env.PORT || port))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/products', function(request, response) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var collection = db.get('products');
  var min = request.param('min');
  var max = request.param('max');

  // Convert to integer if exist or leave it as undefined.
  min = min? Number(min) : min; 
  max = max? Number(max) : max;

  if (checkRange(min, max)) {
    var query = {};
    if (min != undefined && max != undefined) {
      query = {price: {$gt: min, $lt: max}};
    }
    collection.find(query, {}, function(err, result) {
      if (err) {
          response.json(err);
      } else {
          response.json(result);
      }
    });
  } else {
    response.statusCode = badRequest;
    response.statusMessage = 'Bad Request';
    response.writeHead(badRequest, {'Content-Type': 'text/plain'});
    response.end('Bad Request');
  }
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});

// Check if min and max are valid.
// Valid if:
//    - both are not defined (not provided by user).
//    - both are integers >= 0 and min < max.
function checkRange(min, max) {
  if (min == undefined && max == undefined) return true;
  if (isNaN(min) || isNaN(max)) return false;
  if (min < 0 || max < 0) return false;
  if (min > max) return false;
  return true;
}

app.post('/checkout', function(request, response) {
  var collection = db.get('users');
  var order = request.body;
  var cart = order.cart;
  var token = order.token;
  collection.find({token: token}, {}, function(error, result) {
    if (error) {
      response.json(err);
    } else if (result.length === 0) {
      response.statusCode = unauthorizedRequest;
      response.statusMessage = 'Unauthorized';
      response.writeHead(unauthorizedRequest, {'Content-Type': 'text/plain'});
      response.end('You do not have the permission to perform this action.');
    } else {
      collection = db.get('orders');
      collection.insert(order);
      collection = db.get('products');
      for (var key in cart) {
        var change = Number(cart[key]) * -1;
        collection.update({name: key}, {$inc: { quantity: change}},
          function(err, result) {
            if (err) {
              response.json(err);
            } else {
              collection.find({}, {}, function(e, r) {
                if (err) {
                  response.json(e);
                } else {
                  response.json(r);
                }
              })    
            }
        });
      }
    }
  });
});
