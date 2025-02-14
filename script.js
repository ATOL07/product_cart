// Declare variables
let cart = [];
let subtotal = 0;
let itemCount = 0;
let vat = 0;
let total = 0;
let currentPage = 1;
const productsPerPage = 15; // 15 products per page
let allProducts = []; // Store all products fetched from the API

// Fetch product data from API
let url2 = "https://fakestoreapi.in/api/products";
fetch(url2)
  .then((response) => response.json())
  .then((data) => {
    allProducts = data.products; // Store all products
    renderProducts(currentPage); // Render the first page
    renderPagination(); // Render pagination buttons
  });

// Render products for a specific page
function renderProducts(page) {
  const productGrid = document.getElementById("productGrid");
  productGrid.innerHTML = ""; // Clear existing products

  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToDisplay = allProducts.slice(startIndex, endIndex);

  productsToDisplay.forEach((product) => {
    let title = product.title;
    let escapedTitle = title.replace(/['"]/g, ""); // Clean the title

    // Product card template
    const productCard = `
      <div class="flex flex-col h-full bg-white shadow-lg rounded-lg overflow-hidden">
          <img src="${product.image}" class="w-full h-auto object-contain" alt="${escapedTitle}">
          <div class="p-4 flex flex-col flex-grow">
              <h5 class="text-lg font-semibold">${escapedTitle}</h5>
              <p class="text-sm text-gray-600">${product.description}</p>
              <p class="font-semi-bold text-lg mt-2"> Price: $${product.price}</p>
              <p class="font-semi-bold text-lg mt-2"> Brand: ${product.brand}</p>
              <p class="font-semi-bold text-lg mt-2"> Model: ${product.model}</p>
              <p class="font-semi-bold text-lg mt-2"> Color: ${product.color}</p>
              <p class="font-semi-bold text-lg mt-2"> Category: ${product.category}</p>
              <p class="font-semi-bold text-lg mt-2"> Discount: $${product.discount}</p>
              <div class="mt-auto">
                  <button class="bg-orange-600 text-white px-4 py-2 rounded w-full" onclick="addToCart(${product.id}, '${escapedTitle}', ${product.price}, '${product.image}')">Add to Cart</button>
              </div>
          </div>
      </div>
    `;
    productGrid.innerHTML += productCard;
  });
}

// Render pagination buttons
function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = ""; // Clear existing buttons

  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.className = `px-4 py-2 bg-blue-600 text-white rounded-full ${i === currentPage ? "bg-blue-800" : ""}`;
    button.addEventListener("click", () => {
      currentPage = i;
      renderProducts(currentPage);
      renderPagination(); // Re-render pagination to update active button
    });
    pagination.appendChild(button);
  }
}

// Add item to cart
function addToCart(productId, productTitle, productPrice, productImage) {
  const existingProductIndex = cart.findIndex((item) => item.id === productId);
  if (existingProductIndex === -1) {
    cart.push({
      id: productId,
      title: productTitle,
      price: productPrice,
      image: productImage,
      quantity: 1,
    });
  } else {
    cart[existingProductIndex].quantity += 1;
  }

  updateCart();
  showToast();
}

// Update cart display
function updateCart() {
  const cartItemsList = document.getElementById("cartItems");
  const subtotalPrice = document.getElementById("subtotalPrice");
  const itemCountDisplay = document.getElementById("itemCount");
  const vatDisplay = document.getElementById("vat");
  const totalPrice = document.getElementById("total");
  cartItemsList.innerHTML = "";

  subtotal = 0;
  itemCount = 0;
  vat = 0;
  total = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
    itemCount += item.quantity;
    cartItemsList.innerHTML += `
      <div class="flex items-center space-x-4 mb-4">
          <img src="${item.image}" class="w-16 h-16 object-contain" alt="${item.title}">
          
              <div class="text-sm font-semibold">${item.title}</div> 
              <div class="text-gray-600">$${item.price.toFixed(2)}</div>
          </div>
          <div class="flex items-center space-x-2">
              <button class="px-2 py-1 bg-gray-200 rounded-full" onclick="changeQuantity(${item.id}, 'decrease')">−</button>
              <span class="text-lg">${item.quantity}</span>
              <button class="px-2 py-1 bg-gray-200 rounded-full" onclick="changeQuantity(${item.id}, 'increase')">+</button>
              <button class="px-2 py-1 bg-red-500 text-white rounded-full" onclick="removeFromCart(${item.id})">Remove</button>
          </div>
      </div>
    `;
  });

  vat = subtotal * 0.1; // VAT = 10% of subtotal
  total = subtotal + vat;

  // Update the UI with the calculated values
  subtotalPrice.textContent = subtotal.toFixed(2);
  vatDisplay.textContent = vat.toFixed(2);
  totalPrice.textContent = total.toFixed(2);
  itemCountDisplay.textContent = itemCount;
}

// Change the quantity of a cart item
function changeQuantity(productId, action) {
  const productIndex = cart.findIndex((item) => item.id === productId);
  if (productIndex !== -1) {
    if (action === "increase") {
      cart[productIndex].quantity += 1;
    } else if (action === "decrease" && cart[productIndex].quantity > 1) {
      cart[productIndex].quantity -= 1;
    }

    updateCart();
  }
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCart();
}

// Toggle cart sidebar
function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar");
  if (cartSidebar.style.width === "0px" || cartSidebar.style.width === "") {
    cartSidebar.style.width = "400px";
  } else {
    cartSidebar.style.width = "0";
  }
}

// Checkout function
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty. Add items before checking out.");
    return;
  }
  alert(`Proceeding to checkout with total $${total.toFixed(2)}`);
}

// Show toast notification
function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}