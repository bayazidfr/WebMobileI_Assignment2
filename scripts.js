document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("product-container");
  const paginationContainer = document.getElementById("pagination-container");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const productModal = document.getElementById("productModal");
  const modalContent = document.getElementById("modalContent");
  const itemsPerPage = 10;
  let currentPage = 1;
  let allProducts = []; // Store all products globally

  // Fetch data from the API
  fetch("https://dummyjson.com/products")
    .then(response => response.json())
    .then(data => {
      // Store all products globally
      allProducts = data.products;

      // Display products initially
      displayProducts(allProducts);

      // Populate category filter options
      populateCategoryFilter(allProducts);

      // Render pagination
      renderPagination(allProducts.length);
    })
    .catch(error => console.error("Error fetching data:", error));
