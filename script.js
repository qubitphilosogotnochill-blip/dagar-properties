/**
 * Dagar Properties - Official Website Script
 * All Devices Friendly • Buy & Sell Intent Orchestration • Form Validation
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
  const quickListBtn = document.getElementById('quickListBtn');

  // Form input references
  const nameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');
  const serviceInput = document.getElementById('serviceType');
  const categoryInput = document.getElementById('propertyCategory');
  const locationInput = document.getElementById('preferredLocation');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');
  const formHeaderTitle = document.getElementById('formHeaderTitle');
  const formHeaderDesc = document.getElementById('formHeaderDesc');

  // Intent pills
  const intentPills = document.querySelectorAll('.intent-pill');

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
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      propertyCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Buy / Sell Intent Switching Logic
  const setIntent = (intentType) => {
    // Update pills active state
    intentPills.forEach(pill => {
      if (pill.getAttribute('data-intent').toLowerCase() === intentType.toLowerCase()) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Update service select value
    if (serviceInput) {
      if (intentType.toLowerCase().includes('sell')) {
        serviceInput.value = 'Selling';
        if (submitBtn) submitBtn.innerHTML = '<span>Submit Property for Sale</span>';
        if (formHeaderTitle) formHeaderTitle.textContent = 'List Your Property for Sale';
        if (formHeaderDesc) formHeaderDesc.textContent = 'Share your property details for verified buyer matching and free market valuation.';
        if (messageInput) messageInput.placeholder = 'Provide details: Sector/Locality, size (sq yds/BHK), property floor, expected price range...';
      } else if (intentType.toLowerCase().includes('buy')) {
        serviceInput.value = 'Buying';
        if (submitBtn) submitBtn.innerHTML = '<span>Submit Purchase Enquiry</span>';
        if (formHeaderTitle) formHeaderTitle.textContent = 'Submit Your Property Purchase Enquiry';
        if (formHeaderDesc) formHeaderDesc.textContent = 'Tell us your budget, preferred location, and flat/plot requirements.';
        if (messageInput) messageInput.placeholder = 'Mention budget, preferred BHK, sector in Dwarka/Najafgarh, or specific amenities required...';
      } else if (intentType.toLowerCase().includes('rent')) {
        serviceInput.value = 'Renting';
        if (submitBtn) submitBtn.innerHTML = '<span>Submit Rental Enquiry</span>';
        if (formHeaderTitle) formHeaderTitle.textContent = 'Rental & Leasing Enquiry';
        if (formHeaderDesc) formHeaderDesc.textContent = 'Let us know if you want to rent a flat/office or rent out your property.';
      } else {
        serviceInput.value = 'Consultation';
        if (submitBtn) submitBtn.innerHTML = '<span>Book Property Consultation</span>';
        if (formHeaderTitle) formHeaderTitle.textContent = 'Schedule Property Consultation';
        if (formHeaderDesc) formHeaderDesc.textContent = 'Speak with a senior advisor regarding property documentation, titles, or planning.';
      }
    }
  };

  // Click on intent pills
  intentPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const intent = pill.getAttribute('data-intent');
      setIntent(intent);
    });
  });

  // Sync when service dropdown changes manually
  if (serviceInput) {
    serviceInput.addEventListener('change', (e) => {
      setIntent(e.target.value);
    });
  }

  // 7. Contextual Action Handlers (Dual Buy / Sell Buttons)
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const category = btn.getAttribute('data-category');

      if (action === 'sell') {
        setIntent('Selling');
      } else if (action === 'buy') {
        setIntent('Buying');
      } else if (action === 'rent' || action === 'rent-out') {
        setIntent('Renting');
      } else if (action === 'consultation') {
        setIntent('Consultation');
      }

      if (category && categoryInput) {
        const option = Array.from(categoryInput.options).find(opt => opt.value.toLowerCase().includes(category.toLowerCase()));
        if (option) categoryInput.value = option.value;
      }
    });
  });

  if (quickListBtn) {
    quickListBtn.addEventListener('click', () => {
      setIntent('Selling');
      const contactSec = document.getElementById('contact');
      if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Location card shortcut links
  document.querySelectorAll('[data-location]').forEach(link => {
    link.addEventListener('click', () => {
      const locationTarget = link.getAttribute('data-location');
      if (locationInput) {
        const matchingOption = Array.from(locationInput.options).find(opt => opt.value.toLowerCase().includes(locationTarget.toLowerCase()));
        if (matchingOption) {
          locationInput.value = matchingOption.value;
        }
      }
    });
  });

  // 8. Client-Side Enquiry Form Validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
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
      setIntent('Buying');
    });
  }

  // 9. Modal Close Handlers
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

  // 10. Back to Top Smooth Scroll
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 11. URL Parameters Pre-fill (for cross-page actions)
  const urlParams = new URLSearchParams(window.location.search);
  const actionParam = urlParams.get('action');
  const categoryParam = urlParams.get('category');
  const locationParam = urlParams.get('location');

  if (actionParam) {
    const actionLower = actionParam.toLowerCase();
    if (actionLower === 'sell') setIntent('Selling');
    else if (actionLower === 'buy') setIntent('Buying');
    else if (actionLower.includes('rent')) setIntent('Renting');
    else if (actionLower === 'consultation') setIntent('Consultation');
  }

  if (categoryParam && categoryInput) {
    const opt = Array.from(categoryInput.options).find(o => o.value.toLowerCase().includes(categoryParam.toLowerCase()));
    if (opt) categoryInput.value = opt.value;
  }

  if (locationParam && locationInput) {
    const opt = Array.from(locationInput.options).find(o => o.value.toLowerCase().includes(locationParam.toLowerCase()));
    if (opt) locationInput.value = opt.value;
  }

  // 12. Active Navigation Highlight based on Page URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
  if (bottomNavItems.length > 0) {
    bottomNavItems.forEach(item => {
      const itemHref = item.getAttribute('href');
      if (itemHref === currentPath || (currentPath === '' && itemHref === 'index.html')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  if (currentPath !== 'index.html' && currentPath !== '') {
    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref === currentPath) {
        link.classList.add('active');
      }
    });
  }
});
