// Timer
var TIME_LIMIT = 300;
var timer;

var minimumPrice = 0;
var maximumPrice = 500;

var app = new Vue({
  el: ".main",
  data: {
    loading: true,
    loadingmsg: 'Loading..',
    cart: {},
    categories: [
      'All Items', 
      'Books', 
      'Clothing', 
      'Tech', 
      'Gifts', 
      'Stationary', 
      'Supplies'
    ],
    products: {/* products are now loaded from server */},
    total: 0,
    inactive: 0,
    minPrice: minimumPrice,
    maxPrice: maximumPrice,
    category: "All Items"
  },
  mixins: [server],
  computed: {
    displayProducts: function() {
      var filteredProducts = {};
      for (var p in this.products) {
        var product = this.products[p];
        var price = product.price;
        if (price && price >= this.minPrice && price <= this.maxPrice && 
          (this.category === "All Items" || this.category === product.category)) {
          filteredProducts[product.name] = product;
        }
      }
      return filteredProducts;
    }
  },
  methods: {
    // Return number of product in the cart.
    getCartQuantity: function(product) {
      return this.cart[product] || 0;
    },
    // Update total amount in the cart.
    updateTotal: function() {
      var sum = 0;
      var keys = Object.keys(this.cart);
      for (var i = 0; i < keys.length; i++) {
        var item = keys[i]
        var quantity = this.cart[item];
        sum += (this.products[item].price * quantity);
      }
      this.total = sum;
    },
    // Start the timer.
    startTimer: function() { // Commented out because no longer required
      //this.inactive = 0;
      //timer = setInterval(this.updateTimer, 1000); // every 1s
    },
    // Update timer at each tick or restart a timer.
    updateTimer: function(reset) { // Commented out because no longer required
      // if (this.inactive >= TIME_LIMIT) {
      //   alert('Hey there! Are you still planning to buy something?');
      //   clearInterval(timer);
      //   this.startTimer();
      // } else if (reset) {
      //       this.inactive = 0;
      //       clearInterval(timer);
      //       this.startTimer();
      //   } else {
      //       this.inactive++;
      //   }
    },
    // Open the cart modal
    openCart: function() {
        $('.ui.modal').modal('show');
        this.updateTimer(true); // Reset timer.
    },
    // Load data from server.
    onData: function(err, result) {
      if (err) {
        this.loadingmsg = 'We could not connect, please try again later.'
      } else {
        this.products = result;
        this.loading = false;
      }
    },
    addToCart : function(name, amount){
      if (this.products[name].quantity > 0) {
          this.products[name].quantity -= amount;
          if (this.cart.hasOwnProperty(name)) {
              this.cart[name] += amount;
          } else {
              this.cart[name] = 1
          }
      } else {
        alert('out of stock');
      }
    },
    removeFromCart : function(name, amount){
      if (this.cart[name] > 0) {
        this.products[name].quantity -= amount;
        this.cart[name] += amount;
        if (this.cart[name] === 0) {
          delete this.cart[name];
        }
      } else {
        alert('item not in cart');
      }
    }
  },
  // This function runs when app is first started.
  created: function() {
    this.startTimer(); // Start the timer.
    this.fetchData(this.onData); // Load products.
  }
});

// Listens for 'update' event and make changes to the global cart and items.
app.$on('update', function(name, amount) {
    if (amount > 0) {
      // Add to cart - item must be in stock
      // so quantity must be > 0
      this.addToCart(name,amount);
    } else {
      // Remove from cart - item must be in cart
      // so cart[name] > 0
      this.removeFromCart(name,amount);
  }
  this.updateTotal(); // Update cart total.
  this.updateTimer(true); // Reset timer.
});

// Listens for 'refresh' event and reset the global products and cart.
app.$on('refresh', function(products) {
  this.products = products;
  this.cart = {};
  this.updateTotal();
  this.updateTimer(true); // Reset timer.
});

app.$on('filterProducts', function(from, to) {
  this.minPrice = from;
  this.maxPrice = to;
  this.updateTimer(true); // Reset timer.
});

app.$on('changeCategory', function(name) {
  this.category = name;
  this.updateTimer(true); // Reset timer.
});