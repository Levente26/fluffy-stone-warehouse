import { ref, computed } from "vue";

export default function usePagination(list) {
  let page = ref(1);

  const data = list.value.map((item) => {
    return item;
  });

  const perPage = 10;

  const paginatedData = computed(() =>
    data.slice((page.value - 1) * perPage, page.value * perPage)
  );

  const nextPage = () => {
    if (page.value !== Math.ceil(data.length / perPage)) {
      page.value += 1;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backPage = () => {
    if (page.value !== 1) {
      page.value -= 1;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPage = (numPage) => {
    page.value = numPage;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { data, paginatedData, perPage, page, nextPage, backPage, goToPage };
}
