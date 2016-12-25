Vue.component('modal', {
  template: `
    <div class="ui modal">
      <i class="close icon"></i>
      <div class="header">
        Cart
      </div>
      <div class="ui segment" v-for="c in cart">
        <div v-for="(amount, name) in c">
          <b> {{name}}</b>
          <p> Amount: {{amount}} </p>
          <button class="ui button green" v-on:click="handleClick(name, 1)">+1</button>
          <button class="ui button red" v-on:click="handleClick(name, -1)">-1</button>
          <div class="ui divider"></div>
        </div>
      </div>
      <div class="actions">
        <div class="ui icon input">
          <input id="username" type="text" placeholder="username">
          <i class="inverted circular lock link icon"></i>
        </div>
        <div class="ui black deny button">
          Cancel
        </div>
        <div id="checkout-btn" v-on:click="checkout" class="ui teal right labeled icon button" v-show="!isProcessing">
          Checkout ($ {{total}})
          <i class="checkmark icon"></i>
        </div>
        <div class="ui active inline loader teal right labeled icon button" v-show="isProcessing">
        </div>
      </div>
    </div>
  `,
  mixins: [server],
  props: ['cart', 'total'],
  data: function() {
    return {
      isProcessing: false
    }
  },
  methods: {
    // Handle add/remove button clicks
    //  - name: name of product
    //  - amount: 
    //    - +1 when adding to cart
    //    - -1 when removing from cart 
    handleClick: function(name, amount) {
      return (function() {
        app.$emit('update', name, amount);
      }.bind(this))()
    },

    // Send POST request to server.
    checkout: function() {
      if (Object.keys(app.cart).length == 0) {
        alert('Cart is empty!');
        return;
      }

      this.isProcessing = true;
      var token = md5(document.getElementById("username").value);

      this.serverCheckout(app.cart, token, this.total, function (err, result) {
        if (err) {
          if (this.isProcessing) {
            alert(err);  
            this.isProcessing = false;
          }
          return
        }

        this.isProcessing = false;
        alert('Thank you for shopping!');

        // hide the modal and refresh products.
        $('.ui.modal').modal('hide');
        app.$emit('refresh', result);
      }.bind(this));
    }
  }
});

document.onkeydown = function (e) {
    var KEYCODE_ESC = 27;
    e = (e || window.event);
    
    if (e.keyCode == KEYCODE_ESC) {
        var modal = document.getElementById('cartModal');
        modal.classList.add("hide");          
        console.log('ESC: hiding');
    }
};