import Vue from 'vue';

Vue.directive('click-outside', {
  bind(el, binding, vNode) {
    if (!validate(binding)) return;
    if (!vNode.context) return;

    el.__clickOutsideEvent__ = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        vNode.context[binding.expression](event);
        event.stopPropagation();
      }
    };

    document.body.addEventListener('click', el.__clickOutsideEvent__);
  },
  unbind(el) {
    document.body.removeEventListener('click', el.__clickOutsideEvent__);
    el.__clickOutsideEvent__ = null;
  },
});

function validate(binding) {
  if (typeof binding.value !== 'function') {
    // eslint-disable-next-line no-console
    console.warn(
      '[Vue-click-outside:] provided expression',
      binding.expression,
      'is not a function.'
    );
    return false;
  }

  return true;
}
