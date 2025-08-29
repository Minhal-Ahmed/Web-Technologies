
    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
      e.preventDefault();

      // Clear all error messages
      document.querySelectorAll('.error').forEach(el => el.textContent = '');
      document.getElementById('success').textContent = '';

      let isValid = true;

      const name = document.getElementById('name');
      if (!/^[A-Za-z\s]+$/.test(name.value)) {
        document.getElementById('nameError').textContent = "Only alphabets allowed.";
        isValid = false;
      }

      const email = document.getElementById('email');
      if (!email.checkValidity()) {
        document.getElementById('emailError').textContent = "Enter a valid email address.";
        isValid = false;
      }

      const phone = document.getElementById('phone');
      if (!/^\d{10,12}$/.test(phone.value)) {
        document.getElementById('phoneError').textContent = "Enter 10-12 digit phone number.";
        isValid = false;
      }

      const address = document.getElementById('address');
      if (!address.value.trim()) {
        document.getElementById('addressError').textContent = "Address is required.";
        isValid = false;
      }

      const card = document.getElementById('card');
      if (!/^\d{16}$/.test(card.value)) {
        document.getElementById('cardError').textContent = "Enter a 16-digit card number.";
        isValid = false;
      }

      const expiry = document.getElementById('expiry');
      const currentMonth = new Date().toISOString().slice(0, 7);
      if (expiry.value <= currentMonth) {
        document.getElementById('expiryError').textContent = "Expiry must be a future date.";
        isValid = false;
      }

      const cvv = document.getElementById('cvv');
      if (!/^\d{3}$/.test(cvv.value)) {
        document.getElementById('cvvError').textContent = "Enter a 3-digit CVV.";
        isValid = false;
      }

      if (isValid) {
        document.getElementById('success').textContent = "Form submitted successfully!";
        this.reset();
      }
    });
 