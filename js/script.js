document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero');
    const prevBtn = document.querySelector('.hero-nav.prev');
    const nextBtn = document.querySelector('.hero-nav.next');
    
    // Hero images for slider
    const heroImages = [
        'images/hevenpic3.jpg',
        'images/hevenpic4.jpg',
        'images/hevenpic5.jpg',
        'images/hevenpic6.jpg',
        'images/hevenpic8.jpg'
    ];
    
    let currentHeroIndex = 0;
    const cartButton = document.querySelector('.cart a');
    const cartModal = document.getElementById('cart-modal');
    const productModal = document.getElementById('product-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeButtons = document.querySelectorAll('.close');
    const viewButtons = document.querySelectorAll('.view-button');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const addToCartDetailButton = document.querySelector('.add-to-cart-detail');
    const checkoutButton = document.getElementById('checkout-button');
    const placeOrderButton = document.querySelector('.place-order-button');
    const sizeButtons = document.querySelectorAll('.size-button');
    const quantityInput = document.querySelector('.quantity-input');
    const quantityMinus = document.querySelector('.quantity-button.minus');
    const quantityPlus = document.querySelector('.quantity-button.plus');
    
    // Cart data
    let cart = [];
    let selectedSize = '';
    
    // Initialize elements that might not exist yet
    initializeElements();
    
    // Hero slider functionality
    if (prevBtn && nextBtn) {
        // Previous image
        prevBtn.addEventListener('click', function() {
            currentHeroIndex = (currentHeroIndex === 0) ? 
                heroImages.length - 1 : currentHeroIndex - 1;
            updateHeroImage();
        });
        
        // Next image
        nextBtn.addEventListener('click', function() {
            currentHeroIndex = (currentHeroIndex === heroImages.length - 1) ? 
                0 : currentHeroIndex + 1;
            updateHeroImage();
        });
        
        // Update hero image function
        function updateHeroImage() {
            heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${heroImages[currentHeroIndex]}')`;
        }
    }
    
    // Product gallery functionality
    const viewGalleryBtn = document.querySelector('.view-gallery');
    const productGallery = document.querySelector('.product-gallery');
    const mainProductImage = document.querySelector('.product-details-image img');
    const galleryThumbnails = document.querySelectorAll('.gallery-thumbnail');
    
    if (viewGalleryBtn && productGallery) {
        viewGalleryBtn.addEventListener('click', function() {
            productGallery.classList.toggle('active');
            this.textContent = productGallery.classList.contains('active') ? 'Hide images' : 'View more images';
        });
    }
    
    if (galleryThumbnails.length > 0 && mainProductImage) {
        galleryThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const newImageSrc = this.getAttribute('src');
                mainProductImage.src = newImageSrc;
                
                // Add active class to selected thumbnail
                galleryThumbnails.forEach(thumb => thumb.classList.remove('active-thumbnail'));
                this.classList.add('active-thumbnail');
            });
        });
    }
    
    // Mobile navigation toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Modal functionality
    if (cartButton) {
        cartButton.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(cartModal);
        });
    }
    
    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside content
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Quick view product
    if (viewButtons.length > 0) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                openModal(productModal);
            });
        });
    }
    
    // Add to cart from product listing
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const productName = this.getAttribute('data-name');
                const productPrice = parseFloat(this.getAttribute('data-price'));
                
            addToCart(productId, productName, productPrice, 1, 'L', 'images/hevenshirtfront.jpg'); // Default size L
                updateCartDisplay();
                
                // Show a nice notification
                showNotification(`${productName} added to cart`);
            });
        });
    }
    
    // Size selection
    if (sizeButtons.length > 0) {
        sizeButtons.forEach(button => {
            button.addEventListener('click', function() {
                sizeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                selectedSize = this.textContent;
            });
        });
        
        // Default select the Medium size
        const mediumSizeButton = Array.from(sizeButtons).find(button => button.textContent === 'M');
        if (mediumSizeButton) {
            mediumSizeButton.click();
        }
    }
    
    // Quantity adjustment
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            }
        });
    }
    
    if (quantityMinus) {
        quantityMinus.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
    }
    
    if (quantityPlus) {
        quantityPlus.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            quantityInput.value = value + 1;
        });
    }
    
    // Add to cart from product detail
    if (addToCartDetailButton) {
        addToCartDetailButton.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const quantity = parseInt(quantityInput.value);
            
            if (!selectedSize) {
                showNotification('Please select a size', true);
                return;
            }
            
            addToCart(productId, productName, productPrice, quantity, selectedSize, 'images/hevenshirtfront.jpg');
            updateCartDisplay();
            closeModal(productModal);
            
            // Show a nice notification
            showNotification(`${quantity} × ${productName} added to cart`);
        });
    }
    
    // Proceed to checkout
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty', true);
                return;
            }
            
            displayCheckoutItems();
            closeModal(cartModal);
            openModal(checkoutModal);
        });
    }
    
    // Place order
    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const form = document.getElementById('shipping-form');
            if (form.checkValidity()) {
                // In a real site, this would submit the form data to a server
                // For our demo, we'll just show a success message and clear the cart
                cart = [];
                updateCartDisplay();
                closeModal(checkoutModal);
                showNotification('Thank you for your order! We will process it shortly.', false, 5000);
                
                // Reset form
                form.reset();
            } else {
                showNotification('Please fill in all required fields', true);
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#' && this.getAttribute('href') !== '#cart') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (hamburger && hamburger.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        navLinks.classList.remove('active');
                    }
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Functions
    function initializeElements() {
        // This function will be called after any DOM manipulation 
        // that might add new elements we need to interact with
    }
    
    function openModal(modal) {
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }
    
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
    
    function addToCart(id, name, price, quantity, size, image = 'images/hevenshirtfront.jpg') {
        // Check if product already exists in cart with same size
        const existingItemIndex = cart.findIndex(item => 
            item.id === id && item.size === size
        );
        
        if (existingItemIndex !== -1) {
            // Update quantity if product already in cart
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            cart.push({
                id: id,
                name: name,
                price: price,
                quantity: quantity,
                size: size,
                image: image
            });
        }
        
        // Update cart count and localStorage
        updateCartCount();
        saveCart();
    }
    
    function removeFromCart(index) {
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            updateCartDisplay();
            saveCart();
        }
    }
    
    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }
    
    function updateCartDisplay() {
        updateCartCount();
        
        const cartItemsContainer = document.getElementById('cart-items');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTotal = document.getElementById('cart-total');
        
        if (cartItemsContainer && cartSubtotal && cartTotal) {
            // Clear cart items container
            cartItemsContainer.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
                cartSubtotal.textContent = '$0.00';
                cartTotal.textContent = '$5.00'; // Just shipping cost
                return;
            }
            
            let subtotal = 0;
            
            // Add cart items
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-meta">Size: ${item.size} | Quantity: ${item.quantity}</div>
                    </div>
                    <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                    <button class="cart-item-remove" data-index="${index}">&times;</button>
                `;
                
                cartItemsContainer.appendChild(cartItemElement);
            });
            
            // Update totals
            const shipping = 5.00; // Fixed shipping cost
            const total = subtotal + shipping;
            
            cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
            cartTotal.textContent = `$${total.toFixed(2)}`;
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.cart-item-remove').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    removeFromCart(index);
                });
            });
        }
    }
    
    function displayCheckoutItems() {
        const checkoutItemsContainer = document.getElementById('checkout-items');
        const checkoutSubtotal = document.getElementById('checkout-subtotal');
        const checkoutTotal = document.getElementById('checkout-total');
        
        if (checkoutItemsContainer && checkoutSubtotal && checkoutTotal) {
            // Clear container
            checkoutItemsContainer.innerHTML = '';
            
            let subtotal = 0;
            
            // Add checkout items
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                const checkoutItemElement = document.createElement('div');
                checkoutItemElement.className = 'checkout-item';
                checkoutItemElement.innerHTML = `
                    <div class="checkout-item-name">${item.quantity} × ${item.name} (${item.size})</div>
                    <div class="checkout-item-price">$${itemTotal.toFixed(2)}</div>
                `;
                
                checkoutItemsContainer.appendChild(checkoutItemElement);
            });
            
            // Update totals
            const shipping = 5.00; // Fixed shipping cost
            const total = subtotal + shipping;
            
            checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
            checkoutTotal.textContent = `$${total.toFixed(2)}`;
        }
    }
    
    function showNotification(message, isError = false, duration = 3000) {
        // Check if notification container exists, create if not
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
            
            // Add styles if not already in CSS
            const style = document.createElement('style');
            style.textContent = `
                .notification-container {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    z-index: 9999;
                }
                .notification {
                    background-color: #222;
                    color: #fff;
                    padding: 12px 20px;
                    margin-bottom: 10px;
                    border-radius: 4px;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                    transform: translateX(100%);
                    opacity: 0;
                    transition: all 0.3s ease;
                    font-family: 'Montserrat', sans-serif;
                }
                .notification.show {
                    transform: translateX(0);
                    opacity: 1;
                }
                .notification.success {
                    border-left: 4px solid #4CAF50;
                }
                .notification.error {
                    border-left: 4px solid #F44336;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${isError ? 'error' : 'success'}`;
        notification.textContent = message;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after duration
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }
    
    function saveCart() {
        localStorage.setItem('hevenCart', JSON.stringify(cart));
    }
    
    function loadCart() {
        const savedCart = localStorage.getItem('hevenCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartDisplay();
        }
    }
    
    // Load cart from localStorage
    loadCart();
});
