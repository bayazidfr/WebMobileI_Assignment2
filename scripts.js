document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("product-container");
  const paginationContainer = document.getElementById("pagination-container");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const productModal = document.getElementById("productModal");
  const modalContent = document.getElementById("modalContent");
  const itemsPerPage = 10;
  let currentPage = 1;
  let allProducts = [];

  fetchProductsData();

  function fetchProductsData() {
    fetch("https://dummyjson.com/products?limit=0&skip=0")
      .then(response => response.json())
      .then(data => {
        allProducts = data.products;
        displayProducts(allProducts);
        populateCategoryFilter(allProducts);
        renderPagination(allProducts.length);
      })
      .catch(error => console.error("Error fetching data:", error));
  }

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
    let currentImageIndex = 0;

    modalContent.innerHTML = `
    <h2>${product.title}</h2>
    <div class="modal-gallery">
      <img src="${product.images[currentImageIndex]}" alt="${product.title}" class="gallery-image">
    </div>
    <div class="modal-thumbnail-container">
      <img src="${product.thumbnail}" alt="${product.title}" class="modal-thumbnail">
    </div>
    <p>Description: $${product.description}</p>
    <p>Price: $${product.price}</p>
    <p>Discount: ${product.discountPercentage}%</p>
    <p>Category: ${product.category}</p>
    <p>Stock: ${product.stock}</p>
    <p>Rating: ${product.rating}</p>
    <p>Brand: ${product.brand}</p>
  `;

    const galleryContainer = document.querySelector(".modal-gallery");
    const thumbnailContainer = document.querySelector(".modal-thumbnail-container");

    // Add event listeners for thumbnail clicks
    thumbnailContainer.addEventListener("click", () => {
      currentImageIndex = (currentImageIndex + 1) % product.images.length;
      updateGalleryImage();
    });

    document.addEventListener("click", closeModalOutsideClick);

    function updateGalleryImage() {
      const currentImage = product.images[currentImageIndex];
      galleryContainer.innerHTML = `<img src="${currentImage}" alt="${product.title}" class="gallery-image">`;
    }

    productModal.style.display = "flex";
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

  function renderPagination(totalItems) {
    // Clear pagination container before rendering
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement("a");
      pageLink.textContent = i;
      pageLink.href = "#";
      pageLink.addEventListener("click", () => handlePaginationClick(i));

      if (i === currentPage) {
        pageLink.classList.add("active");
      }

      paginationContainer.appendChild(pageLink);
    }
  }

  function handlePaginationClick(pageNumber) {
    currentPage = pageNumber;
    fetchProducts();
  }

  function fetchProducts() {
    // No need to fetch products again; use the global allProducts array
    const productsToDisplay = filterProducts(allProducts);

    // Display the filtered products
    displayProducts(productsToDisplay);

    // Render pagination based on the total number of products
    renderPagination(productsToDisplay.length);
  }

  function populateCategoryFilter(products) {
    // Extract unique categories from products
    const categories = [...new Set(products.map(product => product.category))];

    // Add options to the category filter select box
    categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });

    // Add event listener for category filter change
    categoryFilter.addEventListener("change", fetchProducts);
  }

  function filterProducts(products) {
    // Apply search filter
    const searchTerm = searchInput.value.toLowerCase();
    const filteredBySearch = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );

    // Apply category filter
    const selectedCategory = categoryFilter.value;
    const filteredByCategory = selectedCategory
      ? filteredBySearch.filter(product => product.category === selectedCategory)
      : filteredBySearch;

    return filteredByCategory;
  }

  // Add event listener for search input change
  searchInput.addEventListener("input", fetchProducts);
});
