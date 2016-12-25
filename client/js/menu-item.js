Vue.component('menu-item', {
  template: `
    <a class="item list-menu" v-on:click="changeCategory(name)">
      <b v-show="visible">{{name}}</b>
      <div v-show="!visible">{{name}}</div>
    </a>
  `,
  computed: {
    visible: function() {
      return this.name === this.selected;
    }
  },
  methods: {
    changeCategory: function(name) {
      app.$emit('changeCategory', name);
    }
  },
  props: ['name', 'selected']
})