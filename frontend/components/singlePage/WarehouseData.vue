<template>
  <h2>{{ $t("wh-data.title") }}</h2>
  <div class="warehouse__data">
    <section>
      <article>
        <div>
          <span> {{ $t("wh-data.address") }} </span>
          <span>
            {{ data.data.attributes.address }}
          </span>
        </div>
        <div>
          <span> {{ $t("wh-data.status") }} </span>
          <span>
            {{ data.data.attributes.status }}
          </span>
        </div>
      </article>
    </section>

    <div class="divider"></div>

    <section>
      <article>
        <div>
          <span> {{ $t("wh-data.max-cap") }} </span>
          <span>
            {{ data.data.attributes.maximumCapacity }}
          </span>
        </div>
        <div>
          <span> {{ $t("wh-data.used-cap") }} </span>
          <span>
            {{ data.data.attributes.usedCapacity }}
          </span>
        </div>
      </article>

      <ClientOnly>
        <ChartsPieChart
          :usedCapacity="data.data.attributes.usedCapacity"
          :usedCapacityText="$t('warehouse.usedCapacity')"
          :maximumCapacity="data.data.attributes.maximumCapacity"
          :maximumCapacityText="$t('warehouse.maximumCapacity')"
        />
      </ClientOnly>
    </section>

    <div class="divider"></div>

    <section>
      <article>
        <div>
          <span>{{ $t("wh-data.received-packages") }}</span>
          <span>
            {{ data.data.attributes.packagesReceived }}
          </span>
        </div>

        <div>
          <span>{{ $t("wh-data.sent-packages") }}</span>
          <span>
            {{ data.data.attributes.packagesSent }}
          </span>
        </div>
      </article>

      <ClientOnly>
        <ChartsXYChart
          :receivedPackages="data.data.attributes.packagesReceived"
          :receivedPackagesText="$t('warehouse.receivedPackages')"
          :sentPackages="data.data.attributes.packagesSent"
          :sentPackagesText="$t('warehouse.sentPackages')"
        />
      </ClientOnly>
    </section>
  </div>
</template>

<script setup>
const data = defineProps(["data"]);
const router = useRouter();
const route = useRoute();

onMounted(() => {
  router.push({
    path: route.path,
    query: { warehouse: data.data.attributes.name },
  });
});
</script>

<style lang="scss" scoped>
h2 {
  @apply text-2xl font-montserratMedium mb-10;
}

.divider {
  @apply h-[1px] w-full mx-auto bg-gray-300 my-10;
}

.warehouse {
  &__data {
    @apply flex flex-col;

    & section {
      @apply flex flex-col mb-10;

      @screen lg {
        @apply flex-row;

        & > * {
          @apply w-1/2;
        }
      }

      & article {
        @apply flex flex-col gap-4;


        & > div {
          @apply flex flex-col mb-4;

          &:last-child {
            @apply mb-0;
          }

          & > span {
            &:first-child {
              @apply font-montserratMedium mb-1;
            }

            &:last-child {
              @apply font-montserratLight;
            }
          }
        }
      }
    }
  }

  &__charts {
    @apply flex flex-col gap-4;
  }
}
</style>
