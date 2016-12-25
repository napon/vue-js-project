// SERVER URL
var SERVER_ENDPOINT = "http://localhost:5000/products";
var CHECKOUT_ENDPOINT = "http://localhost:5000/checkout";

// AJAX Timeouts
var AJAX_TIMEOUT = 5000; // 5 seconds.

// AJAX Constants
var STATE_END = 4;
var RESPONSE_200 = 200;
var RESPONSE_401 = 401;
var RESPONSE_ERR = 500;
var retryCount = 0;
var retryMax = 5;

// AJAX Error messages
var ERR_MESSAGE = "An error has occured. Please try again";
var ERR_UNAUTHENTICATED = "You are not authorized to perform this action.";

var server = {
  methods: {
    fetchData: function(callback) {
      // Fetches data from server and return result or error by calling callback
      // callback => (err, result)
      //    - err: Boolean if timed out.
      //    - result: JSON format of result.
      var self = this;
      var xhttp = new XMLHttpRequest(); 
      xhttp.onload = function() {
        if (this.readyState == STATE_END && this.status == RESPONSE_200) {
          var result = self.processResponse(this.responseText);
          callback(undefined, result);
          retryCount = retryMax;
          return;
        } else{
          retryCount = retryCount + 1;
          if(retryCount < retryMax){
            console.log("Trying to connect again");
            self.fetchData(callback); // Retry.
            return;
          }
          else{
            console.log("Could not connect. Please try again");
            callback(true,result);
            return;
          }
        }
      };
      xhttp.ontimeout = function () {
        retryCount = retryCount + 1;
        if(retryCount < retryMax){
          console.log("Trying to connect again");
            self.fetchData(callback); // Retry.
            return;
          }
          else{
            console.log("Could not connect. Please try again");
            callback(ERR_MESSAGE, undefined);
            return;
          }
      };
      xhttp.timeout = AJAX_TIMEOUT;
      xhttp.open("GET", SERVER_ENDPOINT, true);
      xhttp.send();
    },

    processResponse: function(response) {
      /** Pre-process the response from server with additional information.
       ** Resulting format looks like:
      {
        "product1": {
          "name": // name of product,
          "image": // image url of product,
          "displayName": // display name of product,
          "quantity": // quantity of product
        },
        "product2": {
          "name": // name of product,
          "image": // image url of product,
          "displayName": // display name of product,
          "quantity": // quantity of product
        },
      } */
      var result = {};
      response = JSON.parse(response);
      for (var i = 0; i < response.length; i++) {
        var product = response[i];
        var productName = product.name;
        for (var key in product) {
          product.displayName = productName;
          product.image = product.url;
        }
        result[productName] = product;
      }
      return result;
    },

    serverCheckout: function(cart, token, total, callback) {
      var self = this;
      var xhttp = new XMLHttpRequest(); 
      xhttp.onload = function() {
        if (this.readyState == STATE_END && this.status == RESPONSE_200) {
          var result = self.processResponse(this.responseText);
          callback(undefined, result);
          return;
        } else if (this.readyState == STATE_END && this.status == RESPONSE_401) {
          callback(ERR_UNAUTHENTICATED, undefined);
        } else {
          callback(ERR_MESSAGE, undefined);
          return;
        }
      };
      xhttp.ontimeout = function () {
        callback(ERR_MESSAGE, undefined);
        return;
      };
      xhttp.timeout = AJAX_TIMEOUT;
      xhttp.open("POST", CHECKOUT_ENDPOINT, true);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(JSON.stringify({cart: cart, total: total, token: token}));
    }
  }
}