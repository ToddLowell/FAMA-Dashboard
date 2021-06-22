<template>
  <div class="card-holder">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.card-holder {
  width: 100%;
  height: 100%;
  background: rgba(#000000, 0.5);
  border: 3px solid var(--clr-neutral-100);
  border-radius: 5px;
  box-shadow: 0 0.4px 1px rgba(0, 0, 0, 0.031),
    0 1.4px 2.6px rgba(0, 0, 0, 0.044), 0 3.4px 5.3px rgba(0, 0, 0, 0.056),
    0 7.6px 11px rgba(0, 0, 0, 0.069), 0 20px 30px rgba(0, 0, 0, 0.1);

  // overflow hides the change view icon
  // overflow: hidden;
}
</style>
