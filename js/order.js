document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('orderForm');
  let totalPrice = 0;
  
  // Menu items with prices
  const menuItems = {
    'veg-momo': 100,
    'paneer-chilli': 225,
    'paneer-schezwan': 225,
    'baby-corn': 225,
    'mushroom-chilly': 225,
    'veg-manchurian': 200,
    'honey-chilli-potato': 175,
    'spring-roll': 175,
    'chicken-lollipop': 225,
    'crispy-chicken': 275,
    'chicken-chilly': 275,
    'chicken-salt-pepper': 325,
    'chicken-manchurian': 275
  };
  
  // Update total when item is selected
  const menuSelect = document.getElementById('menuItem');
  const quantityInput = document.getElementById('quantity');
  const totalDisplay = document.getElementById('totalPrice');
  
  function updateTotal() {
    if (menuSelect && quantityInput) {
      const item = menuSelect.value;
      const quantity = parseInt(quantityInput.value) || 0;
      const price = menuItems[item] || 0;
      totalPrice = price * quantity;
      if (totalDisplay) {
        totalDisplay.textContent = `₹${totalPrice}`;
      }
    }
  }
  
  if (menuSelect) menuSelect.addEventListener('change', updateTotal);
  if (quantityInput) quantityInput.addEventListener('input', updateTotal);
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form
      const isValid = window.MasalaJunction.validateForm('orderForm');
      
      if (isValid) {
        // Collect form data
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const menuItem = document.getElementById('menuItem').value;
        const quantity = document.getElementById('quantity').value;
        const instructions = document.getElementById('instructions').value;
        
        // Get item name from select
        const itemName = menuSelect.options[menuSelect.selectedIndex]?.text || menuItem;
        
        // Format WhatsApp message
        const message = `*New Order - Masala Junction*%0A%0A` +
          `*Name:* ${name}%0A` +
          `*Phone:* ${phone}%0A` +
          `*Delivery Address:* ${address}%0A` +
          `*Item:* ${itemName}%0A` +
          `*Quantity:* ${quantity}%0A` +
          `*Total Price:* ₹${totalPrice}%0A` +
          `*Special Instructions:* ${instructions || 'None'}%0A%0A` +
          `*Please confirm my order. Thank you!*`;
        
        // WhatsApp number
        const whatsappNumber = '918252702699';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
        
        // Track order event
        window.MasalaJunction.trackEvent('order_submit', 'delivery_order');
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Show success message
        window.MasalaJunction.showNotification('Order placed! Redirecting to WhatsApp...', 'success');
        
        // Reset form
        setTimeout(() => {
          form.reset();
          if (totalDisplay) totalDisplay.textContent = '₹0';
        }, 2000);
      }
    });
  }
});