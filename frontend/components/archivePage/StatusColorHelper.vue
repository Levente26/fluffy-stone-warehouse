<template>
  <div>
    Status Colors: open
    <div class="status status--green"></div>
    closed
    <div class="status status--red"></div>
    full
    <div class="status status--yellow"></div>
    empty
    <div class="status status--blue"></div>
  </div>
</template>

<style lang="scss" scoped>
.status {
  @apply w-5 h-5 rounded-full;

  &--green {
    background-color: #2ecc71;
  }

  &--yellow {
    background-color: #f1c40f;
  }

  &--red {
    background-color: #e74c3c;
  }

  &--blue {
    background-color: #3498db;
  }
}
</style>
