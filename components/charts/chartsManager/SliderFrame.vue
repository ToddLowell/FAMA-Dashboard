<script>
// https://markus.oberlehner.net/blog/building-a-simple-content-slider-with-vue/

export default {
  data() {
    return {
      activeIndex: 0,
    };
  },
  computed: {
    slides() {
      return this.$children;
    },
    slidesCount() {
      return this.slides.length;
    },
    nextIndex() {
      const nextIndex = this.activeIndex + 1;

      return nextIndex <= this.slidesCount - 1 ? nextIndex : 0;
    },
    prevIndex() {
      const prevIndex = this.activeIndex - 1;

      return prevIndex >= 0 ? prevIndex : this.slidesCount - 1;
    },
  },
  mounted() {
    // Immediately activate the first slide
    this.goToIndex(this.activeIndex);
  },
  methods: {
    goToIndex(index, direction = 'right') {
      // Call the `hide()` method on the currently
      // active `SliderSlide` component.
      this.slides[this.activeIndex].hide(direction);
      // Call the `show()` method on the `SliderSlide`
      // component with the correspondign index.
      this.slides[index].show(direction);
      this.activeIndex = index;
    },
    next() {
      this.goToIndex(this.nextIndex, 'right');
    },
    prev() {
      this.goToIndex(this.prevIndex, 'left');
    },
  },
  render(h) {
    return h(
      'div',
      { class: 'fill' },
      this.$scopedSlots.default({
        // Data
        // activeIndex: this.activeIndex,
        // Methods
        // goToIndex: this.goToIndex,
        next: this.next,
        prev: this.prev,
      })
    );
  },
};
</script>
