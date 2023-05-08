module.exports = {
  async afterCreate(event) {
    const { result, params } = event;

    if (params.data.usedCapacity > 0) {
      const response = await fetch(
        `https://fakestoreapi.com/products?limit=${params.data.usedCapacity}`
      );
      const data = await response.json();

      data.map(async (item) => {
          const entry = await strapi.entityService.create("api::package.package", {
            data: {
              name: item.title,
              price: item.price,
              category: item.category,
              warehouse: result.id,
            },
          });
      })
    }
  },
};
