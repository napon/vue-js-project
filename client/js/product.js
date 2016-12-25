Vue.component('product', {
  template: ` 
    <div class="column product">
      <div class="ui segment">
        <div class=productBox>
            <div class="cartOverlay">
                <img src="images/cart.png">
                <button class="add-cart" v-on:click="handleClick(name, 1)">Add</button>
                <button class="remove-cart" v-show="quantity > 0" v-on:click="handleClick(name, -1)">Remove</button>
            </div>
        </div>
        <img class="product-image" v-bind:src="image">  
        <h3 class="productName">{{displayName}}:{{quantity}}</h3>
        <div class="productPrice">
            <h5>$ {{price}}</h5>
        </div>
      </div>
    </div>
  `,
  props: ['image', 'display-name', 'name', 'price', 'quantity'],
  methods: {
    // Handle add/remove button clicks
    //  - name: name of product
    //  - amount: 
    //    - +1 when adding to car t
    //    - -1 when removing from cart        
    handleClick: function(name, amount) {
        return (function() {
            app.$emit('update', name, amount);
        }.bind(this))()
    }
  }
})