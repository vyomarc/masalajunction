// Complete menu with all items
const menuItems = {
  // Veg Starters
  'veg-momo': { name: 'Veg Momo', price: 100, category: 'veg' },
  'paneer-chilli': { name: 'Paneer Chilli', price: 225, category: 'veg' },
  'paneer-schezwan': { name: 'Paneer Schezwan', price: 225, category: 'veg' },
  'baby-corn': { name: 'Baby Corn', price: 225, category: 'veg' },
  'mushroom-chilly': { name: 'Mushroom Chilly', price: 225, category: 'veg' },
  'veg-manchurian': { name: 'Veg Manchurian', price: 200, category: 'veg' },
  'honey-chilli-potato': { name: 'Honey Chilli Potato', price: 175, category: 'veg' },
  'spring-roll': { name: 'Spring Roll', price: 175, category: 'veg' },
  
  // Chicken Starters
  'chicken-lollipop': { name: 'Chicken Lollipop', price: 225, category: 'chicken' },
  'crispy-chicken': { name: 'Crispy Chicken', price: 275, category: 'chicken' },
  'chicken-chilly': { name: 'Chicken Chilly', price: 275, category: 'chicken' },
  'chicken-salt-pepper': { name: 'Chicken Salt & Pepper', price: 325, category: 'chicken' },
  'chicken-manchurian': { name: 'Chicken Manchurian', price: 275, category: 'chicken' }
};

let orderItems = [];
let itemCounter = 0;

// Function to add new item
function addNewItem(selectedValue = '', quantity = 1) {
  const container = document.getElementById('orderItemsContainer');
  const emptyMessage = document.getElementById('emptyCartMessage');
  if (emptyMessage) emptyMessage.style.display = 'none';
  
  const itemId = `item_${itemCounter++}`;
  const itemDiv = document.createElement('div');
  itemDiv.className = 'order-item';
  itemDiv.id = itemId;
  
  itemDiv.innerHTML = `
    <div class="item-header">
      <span class="item-title">Item ${orderItems.length + 1}</span>
      <button type="button" class="remove-item" onclick="removeItem('${itemId}')">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="item-controls">
      <select class="item-select" onchange="updateItemPrice('${itemId}')">
        <option value="">Select a dish</option>
        <optgroup label="🥗 Veg Starters">
          <option value="veg-momo" ${selectedValue === 'veg-momo' ? 'selected' : ''}>Veg Momo - ₹100</option>
          <option value="paneer-chilli" ${selectedValue === 'paneer-chilli' ? 'selected' : ''}>Paneer Chilli - ₹225</option>
          <option value="paneer-schezwan" ${selectedValue === 'paneer-schezwan' ? 'selected' : ''}>Paneer Schezwan - ₹225</option>
          <option value="baby-corn" ${selectedValue === 'baby-corn' ? 'selected' : ''}>Baby Corn - ₹225</option>
          <option value="mushroom-chilly" ${selectedValue === 'mushroom-chilly' ? 'selected' : ''}>Mushroom Chilly - ₹225</option>
          <option value="veg-manchurian" ${selectedValue === 'veg-manchurian' ? 'selected' : ''}>Veg Manchurian - ₹200</option>
          <option value="honey-chilli-potato" ${selectedValue === 'honey-chilli-potato' ? 'selected' : ''}>Honey Chilli Potato - ₹175</option>
          <option value="spring-roll" ${selectedValue === 'spring-roll' ? 'selected' : ''}>Spring Roll - ₹175</option>
        </optgroup>
        <optgroup label="🍗 Chicken Starters">
          <option value="chicken-lollipop" ${selectedValue === 'chicken-lollipop' ? 'selected' : ''}>Chicken Lollipop - ₹225</option>
          <option value="crispy-chicken" ${selectedValue === 'crispy-chicken' ? 'selected' : ''}>Crispy Chicken - ₹275</option>
          <option value="chicken-chilly" ${selectedValue === 'chicken-chilly' ? 'selected' : ''}>Chicken Chilly - ₹275</option>
          <option value="chicken-salt-pepper" ${selectedValue === 'chicken-salt-pepper' ? 'selected' : ''}>Chicken Salt & Pepper - ₹325</option>
          <option value="chicken-manchurian" ${selectedValue === 'chicken-manchurian' ? 'selected' : ''}>Chicken Manchurian - ₹275</option>
        </optgroup>
      </select>
      <div class="quantity-control">
        <button type="button" class="quantity-btn" onclick="updateQuantity('${itemId}', -1)">-</button>
        <input type="number" class="quantity-input" id="${itemId}_qty" value="${quantity}" min="1" onchange="updateItemPrice('${itemId}')">
        <button type="button" class="quantity-btn" onclick="updateQuantity('${itemId}', 1)">+</button>
      </div>
      <div class="item-price" id="${itemId}_price">₹0</div>
    </div>
  `;
  
  container.appendChild(itemDiv);
  
  // Store item data
  orderItems.push({
    id: itemId,
    itemKey: selectedValue,
    quantity: quantity
  });
  
  if (selectedValue) {
    updateItemPrice(itemId);
  }
  
  updateOrderSummary();
  updateSubmitButton();
}

// Function to remove item
window.removeItem = function(itemId) {
  const itemIndex = orderItems.findIndex(item => item.id === itemId);
  if (itemIndex !== -1) {
    orderItems.splice(itemIndex, 1);
    const itemElement = document.getElementById(itemId);
    if (itemElement) itemElement.remove();
    
    // Update item titles
    const items = document.querySelectorAll('.order-item');
    items.forEach((item, idx) => {
      const title = item.querySelector('.item-title');
      if (title) title.textContent = `Item ${idx + 1}`;
    });
    
    if (orderItems.length === 0) {
      const emptyMessage = document.getElementById('emptyCartMessage');
      if (emptyMessage) emptyMessage.style.display = 'block';
      document.getElementById('orderSummary').style.display = 'none';
    }
    
    updateOrderSummary();
    updateSubmitButton();
  }
};

// Function to update quantity
window.updateQuantity = function(itemId, change) {
  const qtyInput = document.getElementById(`${itemId}_qty`);
  if (qtyInput) {
    let newQty = parseInt(qtyInput.value) + change;
    if (newQty < 1) newQty = 1;
    if (newQty > 50) newQty = 50;
    qtyInput.value = newQty;
    
    const item = orderItems.find(i => i.id === itemId);
    if (item) {
      item.quantity = newQty;
      updateItemPrice(itemId);
    }
  }
};

// Function to update item price
window.updateItemPrice = function(itemId) {
  const select = document.querySelector(`#${itemId} .item-select`);
  const qtyInput = document.getElementById(`${itemId}_qty`);
  const priceDisplay = document.getElementById(`${itemId}_price`);
  
  if (select && qtyInput && priceDisplay) {
    const selectedValue = select.value;
    const quantity = parseInt(qtyInput.value) || 1;
    
    const item = orderItems.find(i => i.id === itemId);
    if (item) {
      item.itemKey = selectedValue;
      item.quantity = quantity;
    }
    
    if (selectedValue && menuItems[selectedValue]) {
      const totalPrice = menuItems[selectedValue].price * quantity;
      priceDisplay.textContent = `₹${totalPrice}`;
    } else {
      priceDisplay.textContent = `₹0`;
    }
    
    updateOrderSummary();
  }
};

// Function to update order summary
function updateOrderSummary() {
  const summaryDiv = document.getElementById('summaryItems');
  const grandTotalSpan = document.getElementById('grandTotal');
  const orderSummary = document.getElementById('orderSummary');
  
  let grandTotal = 0;
  let summaryHTML = '';
  let hasValidItems = false;
  
  orderItems.forEach((item, index) => {
    const select = document.querySelector(`#${item.id} .item-select`);
    const qtyInput = document.getElementById(`${item.id}_qty`);
    
    if (select && select.value && menuItems[select.value]) {
      hasValidItems = true;
      const menuItem = menuItems[select.value];
      const quantity = parseInt(qtyInput?.value) || 1;
      const itemTotal = menuItem.price * quantity;
      grandTotal += itemTotal;
      
      summaryHTML += `
        <div class="summary-row">
          <span>${index + 1}. ${menuItem.name} x ${quantity}</span>
          <span>₹${itemTotal}</span>
        </div>
      `;
    }
  });
  
  if (hasValidItems && grandTotal > 0) {
    orderSummary.style.display = 'block';
    summaryDiv.innerHTML = summaryHTML;
    grandTotalSpan.textContent = `₹${grandTotal}`;
  } else {
    orderSummary.style.display = 'none';
  }
  
  return grandTotal;
}

// Function to update submit button state
function updateSubmitButton() {
  const submitBtn = document.getElementById('submitOrderBtn');
  const name = document.getElementById('name')?.value;
  const phone = document.getElementById('phone')?.value;
  const address = document.getElementById('address')?.value;
  
  let hasValidItems = false;
  orderItems.forEach(item => {
    const select = document.querySelector(`#${item.id} .item-select`);
    if (select && select.value && menuItems[select.value]) {
      hasValidItems = true;
    }
  });
  
  if (submitBtn) {
    submitBtn.disabled = !(name && phone && address && hasValidItems);
  }
}

// Format order items for WhatsApp
function formatOrderItemsForWhatsApp() {
  let orderDetails = '';
  let grandTotal = 0;
  let itemNumber = 1;
  
  orderItems.forEach(item => {
    const select = document.querySelector(`#${item.id} .item-select`);
    const qtyInput = document.getElementById(`${item.id}_qty`);
    
    if (select && select.value && menuItems[select.value]) {
      const menuItem = menuItems[select.value];
      const quantity = parseInt(qtyInput?.value) || 1;
      const itemTotal = menuItem.price * quantity;
      grandTotal += itemTotal;
      orderDetails += `${itemNumber}. ${menuItem.name} x ${quantity} = Rs.${itemTotal}\n`;
      itemNumber++;
    }
  });
  
  return { orderDetails, grandTotal };
}

// Reset form
function resetOrderForm() {
  while(orderItems.length > 0) {
    window.removeItem(orderItems[0].id);
  }
  const form = document.getElementById('orderForm');
  if (form) form.reset();
  const submitBtn = document.getElementById('submitOrderBtn');
  if (submitBtn) submitBtn.disabled = true;
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Add initial empty item
  addNewItem();
  
  // Add item button
  const addItemBtn = document.getElementById('addItemBtn');
  if (addItemBtn) {
    addItemBtn.addEventListener('click', () => {
      addNewItem();
    });
  }
  
  // Real-time validation for form fields
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const addressInput = document.getElementById('address');
  
  if (nameInput) nameInput.addEventListener('input', updateSubmitButton);
  if (phoneInput) phoneInput.addEventListener('input', updateSubmitButton);
  if (addressInput) addressInput.addEventListener('input', updateSubmitButton);
  
  // Form submission
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const address = document.getElementById('address').value.trim();
      const instructions = document.getElementById('instructions').value.trim();
      
      // Validate name
      if (!name) {
        alert('Please enter your name');
        return;
      }
      
      // Validate phone number
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        alert('Please enter a valid 10-digit Indian phone number (starts with 6,7,8,9)');
        document.getElementById('phone').focus();
        return;
      }
      
      // Validate address
      if (!address || address.length < 10) {
        alert('Please enter your complete delivery address');
        document.getElementById('address').focus();
        return;
      }
      
      // Get order items
      const { orderDetails, grandTotal } = formatOrderItemsForWhatsApp();
      
      if (grandTotal === 0 || !orderDetails) {
        alert('Please add at least one item to your order');
        return;
      }
      
      // Create message with emojis (using Unicode emojis directly)
      // Using actual emoji characters instead of encoded versions
      const message = `*MASALA JUNCTION - NEW ORDER*%0a%0a` +
        `ORDER DETAILS%0a` +
        `━━━━━━━━━━━━━━━━━━━━━%0a` +
        `Order Date: ${new Date().toLocaleDateString('en-IN')}%0a` +
        `Order Time: ${new Date().toLocaleTimeString()}%0a` +
        `━━━━━━━━━━━━━━━━━━━━━%0a%0a` +
        `CUSTOMER INFORMATION%0a` +
        `Name: ${name}%0a` +
        `Phone: ${phone}%0a` +
        `Delivery Address: ${address}%0a%0a` +
        `ORDER ITEMS%0a` +
        `━━━━━━━━━━━━━━━━━━━━━%0a` +
        `${orderDetails.replace(/\n/g, '%0a')}%0a` +
        `━━━━━━━━━━━━━━━━━━━━━%0a%0a` +
        `TOTAL AMOUNT: Rs.${grandTotal}%0a%0a`;
      
      let finalMessage = message;
      
      if (instructions) {
        finalMessage += `SPECIAL INSTRUCTIONS%0a${instructions.replace(/\n/g, '%0a')}%0a%0a`;
      }
      
      finalMessage += `ORDER CONFIRMATION%0a` +
        `Please confirm my order and provide%0a` +
        `estimated delivery time.%0a%0a` +
        `Thank you!`;
      
      // WhatsApp number
      const whatsappNumber = '918252702699';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${finalMessage}`;
      
      // Track order event
      if (window.MasalaJunction) {
        window.MasalaJunction.trackEvent('order_submit', 'delivery_order');
      }
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Show success message
      alert('Order placed! Redirecting to WhatsApp...');
      
      // Reset form after 3 seconds
      setTimeout(() => {
        resetOrderForm();
      }, 3000);
    });
  }
});