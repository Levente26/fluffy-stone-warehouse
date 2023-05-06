<template>
  <div class="status-colors">
    <h3>Status Colors</h3>
    <p>
      The status colors are used to indicate the status of a warehouse. The
      colors are used in the warehouse list and in the warehouse details page.
    </p>

    <section>
      <div class="wrapper">
        <div class="status status--green"></div>
        <span>open</span>
      </div>

      <div class="wrapper">
        <div class="status status--red"></div>
        <span>closed</span>
      </div>

      <div class="wrapper">
        <div class="status status--yellow"></div>
        <span>full</span>
      </div>

      <div class="wrapper">
        <div class="status status--blue"></div>
        <span>empty</span>
      </div>
    </section>
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

.status-colors {
  @apply flex flex-col;

  & > h3 {
    @apply text-lg font-montserratMedium mb-4;
  }

  & > p {
    @apply text-sm font-montserratLight mb-6 max-w-md;
  }

  & > section {
    @apply flex flex-row justify-between items-center mb-10;
    @apply max-w-sm;

    & > .wrapper {
      @apply flex flex-col justify-center items-center;
  
      & > span {
        @apply text-sm font-montserratLight mt-1;
      }
    }
  }
}
</style>
