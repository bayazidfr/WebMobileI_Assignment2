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

  function displayProducts(products) {
    // Clear the container before adding new products
    container.innerHTML = "";

    // Filter products based on search input and category filter
    const filteredProducts = filterProducts(products);

    // Determine the range of products to display for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

    // Iterate through the filtered products and create product cards
    productsToDisplay.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      const thumbnail = document.createElement("img");
      thumbnail.src = product.thumbnail;
      thumbnail.alt = product.title;
      thumbnail.classList.add("product-thumbnail");

      const details = document.createElement("div");
      details.classList.add("product-details");
      details.innerHTML = `
        <h3>${product.title}</h3>
        <p>Price: $${product.price}</p>
        <p>Discount: ${product.discountPercentage}%</p>
        <p>Category: ${product.category}</p>
      `;

      card.appendChild(thumbnail);
      card.appendChild(details);

      card.addEventListener("click", () => openProductModal(product));

      container.appendChild(card);
    });
  }

  function openProductModal(product) {
    modalContent.innerHTML = `
      <h2>${product.title}</h2>
      <img src="${product.thumbnail}" alt="${product.title}" class="modal-thumbnail">
      <p>Price: $${product.price}</p>
      <p>Discount: ${product.discountPercentage}%</p>
      <p>Category: ${product.category}</p>
      <p>Stock: ${product.stock}</p>
      <p>Rating: ${product.rating}</p>
      <p>Brand: ${product.brand}</p>
      <!-- Add more details and gallery here as needed -->
    `;

    productModal.style.display = "flex";

    document.addEventListener("click", closeModalOutsideClick);
  }

  function closeModalOutsideClick(event) {
    // Check if the clicked element is outside the modal
    if (!event.target.closest(".modal-content") && !event.target.closest(".product-card")) {
      closeModal();
      // Remove the event listener to avoid interference with other clicks
      document.removeEventListener("click", closeModalOutsideClick);
    }
  }

  function closeModal() {
    productModal.style.display = "none";
  }
