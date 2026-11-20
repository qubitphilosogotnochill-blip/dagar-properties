/**
 * Dagar Properties - Official Website Script
 * Vanilla JavaScript for navigation, category filtering, contextual pre-filling, and form validation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DOM Element References
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const propertyCards = document.querySelectorAll('.property-card');
  const enquiryForm = document.getElementById('enquiryForm');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const backToTopBtn = document.getElementById('backToTop');

  // Form input references
  const nameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');
  const serviceInput = document.getElementById('serviceType');
  const categoryInput = document.getElementById('propertyCategory');
  const locationInput = document.getElementById('preferredLocation');
  const messageInput = document.getElementById('message');

  // Form error elements
  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');
  const emailError = document.getElementById('emailError');
  const serviceError = document.getElementById('serviceError');

  // 2. Header Scroll Shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // 3. Mobile Navigation Drawer Toggle
  const openDrawer = () => {
    mobileDrawer.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', openDrawer);
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  // Close drawer when clicking any link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileDrawer.classList.contains('open') && 
        !mobileDrawer.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      closeDrawer();
    }
  });

  // 4. Active Navigation State on Scroll
  const sections = document.querySelectorAll('section[id]');
  const highlightCurrentSection = () => {
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightCurrentSection, { passive: true });

  // 5. Property Categories Filter Tabs
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      // Filter property cards
      propertyCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Contextual Pre-Fill from Property / Location Enquiry Buttons
  document.querySelectorAll('[data-enquiry]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const enquiryTarget = btn.getAttribute('data-enquiry');
      if (categoryInput) {
        if (enquiryTarget.includes('Residential')) categoryInput.value = 'Residential';
        else if (enquiryTarget.includes('Commercial')) categoryInput.value = 'Commercial';
        else if (enquiryTarget.includes('Plots')) categoryInput.value = 'Plots & Land';
        else if (enquiryTarget.includes('Rental')) categoryInput.value = 'Rental';
      }
    });
  });

  document.querySelectorAll('[data-location]').forEach(link => {
    link.addEventListener('click', () => {
      const locationTarget = link.getAttribute('data-location');
      if (locationInput) {
        const matchingOption = Array.from(locationInput.options).find(opt => opt.value.toLowerCase() === locationTarget.toLowerCase());
        if (matchingOption) {
          locationInput.value = matchingOption.value;
        }
      }
    });
  });

  // 7. Client-Side Enquiry Form Validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    // Allows standard Indian & international format strings
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    return cleaned.length >= 8 && cleaned.length <= 15;
  };

  const clearFormErrors = () => {
    [nameError, phoneError, emailError, serviceError].forEach(el => {
      if (el) el.textContent = '';
    });
    [nameInput, phoneInput, emailInput, serviceInput].forEach(input => {
      if (input) input.classList.remove('input-error');
    });
  };

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFormErrors();

      let isValid = true;

      // Full Name Validation
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameError.textContent = 'Please provide your full name (at least 2 characters).';
        nameInput.classList.add('input-error');
        isValid = false;
      }

      // Phone Validation
      if (!phoneInput.value.trim() || !validatePhone(phoneInput.value.trim())) {
        phoneError.textContent = 'Please enter a valid phone number.';
        phoneInput.classList.add('input-error');
        isValid = false;
      }

      // Email Validation
      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        emailInput.classList.add('input-error');
        isValid = false;
      }

      // Service Required Validation
      if (!serviceInput.value) {
        serviceError.textContent = 'Please select the required service.';
        serviceInput.classList.add('input-error');
        isValid = false;
      }

      if (!isValid) return;

      // Form is valid: display success modal
      if (modalBackdrop) {
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      // Reset form
      enquiryForm.reset();
    });
  }

  // 8. Modal Close Handlers
  const closeModal = () => {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // 9. Back to Top Smooth Scroll
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
