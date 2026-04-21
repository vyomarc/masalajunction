document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('bookingForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form
      const isValid = window.MasalaJunction.validateForm('bookingForm');
      
      if (isValid) {
        // Collect form data
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const guests = document.getElementById('guests').value;
        const menuItem = document.getElementById('menuItem').value;
        const specialRequests = document.getElementById('specialRequests').value;
        
        // Format WhatsApp message
        const message = `*Table Booking Request - Masala Junction*%0A%0A` +
          `*Name:* ${name}%0A` +
          `*Phone:* ${phone}%0A` +
          `*Date:* ${date}%0A` +
          `*Time:* ${time}%0A` +
          `*Number of Guests:* ${guests}%0A` +
          `*Preferred Dish:* ${menuItem || 'Not specified'}%0A` +
          `*Special Requests:* ${specialRequests || 'None'}%0A%0A` +
          `*Please confirm my booking. Thank you!*`;
        
        // WhatsApp number (replace with actual restaurant number)
        const whatsappNumber = '918252702699';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
        
        // Track booking event
        window.MasalaJunction.trackEvent('book_table_submit', 'booking_form');
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Show success message
        window.MasalaJunction.showNotification('Redirecting to WhatsApp...', 'success');
        
        // Reset form after 2 seconds
        setTimeout(() => {
          form.reset();
        }, 2000);
      }
    });
  }
  
  // Set minimum date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
});