<template>
  <div>Package List</div>
  <!-- SEARCH INPUT & SORT -->
  <div v-if="packages.length === 0">no packages</div>
  <div v-if="packages.length > 0">
    <SinglePagePackageCard
      v-for="(singlePackage, index) in packages"
      :singlePackage="singlePackage"
      :key="singlePackage.id"
      :index="index"
    />
  </div>
  <button @click="addProducts">Add Products</button>
</template>

<script setup>
const { packages, warehouse } = defineProps(["packages", "warehouse"]);
const emit = defineEmits(["refresh"]);
console.log(warehouse)
const { create, update } = useStrapi();

const addProducts = async () => {
  const newProducts = await useFetch("https://fakestoreapi.com/products?limit=5");

  const newPackages = newProducts.data.value.map(async (product) => {
    const obj = {
      name: product.title,
      price: product.price,
      quantity: 1,
      category: product.category,
      rate: product.rating.rate,
      countRates: product.rating.count,
      description: product.description,
      warehouse: warehouse.id,
    };
    try {
      await create("packages", obj);
      await update("warehouses", warehouse.id, {
       usedCapacity: warehouse.attributes.usedCapacity += 1,
      });

      emit("refresh");
    } catch (error) {
      console.log(error);
    }
  });
};
</script>
