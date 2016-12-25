/* Price filter slider */
Vue.component('price-slider', {
  template: `<input type="text" id="priceSlider" name="priceRange" value="" />`,
  props: ['min', 'max'],
  mounted: function() {
    $('#priceSlider').ionRangeSlider({
      type: "double",
      min: this.min,
      max: this.max,
      onFinish: function (data) {
        app.$emit('filterProducts', data.from, data.to);
      }
    });
  }
});