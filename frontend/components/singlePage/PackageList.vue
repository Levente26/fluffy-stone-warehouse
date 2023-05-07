<template>
  <div>Package List</div>
  <!-- SEARCH INPUT & SORT -->
  <!-- <div v-if="data.data.attributes.packages.data.length === 0">
      no packages
    </div>
    <div v-if="data.data.attributes.packages.data.length > 0">
      <PackageCard
        v-for="singlePackage in data.data.attributes.packages.data"
        :singlePackage="singlePackage"
      />
    </div> -->
</template>

<script setup>
const packages = defineProps(["packages"]);
console.log(packages);
</script>
