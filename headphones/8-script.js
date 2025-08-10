/**
 * Hamburger Menu JavaScript
 * Handles mobile navigation toggle functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    // Track menu state
    let isMenuOpen = false;
    
    /**
     * Toggle mobile menu open/close
     */
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            openMenu();
        } else {
            closeMenu();
        }
    }
    
    /**
     * Open mobile menu
     */
    function openMenu() {
        // Add active classes
        navToggle.classList.add('active');
        navMenu.classList.add('active');
        navMenu.classList.remove('closing');
        
        // Prevent body scroll
        body.classList.add('menu-open');
        
        // Set ARIA attributes for accessibility
        navToggle.setAttribute('aria-expanded', 'true');
        navMenu.setAttribute('aria-hidden', 'false');
        
        // Focus management for accessibility
        navMenu.focus();
        
        // Add event listener for escape key
        document.addEventListener('keydown', handleEscapeKey);
    }
    
    /**
     * Close mobile menu
     */
    function closeMenu() {
        // Add closing animation class
        navMenu.classList.add('closing');
        
        // Remove active classes after animation
        setTimeout(() => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active', 'closing');
            
            // Allow body scroll
            body.classList.remove('menu-open');
            
            // Set ARIA attributes for accessibility
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
            
            // Remove escape key listener
            document.removeEventListener('keydown', handleEscapeKey);
        }, 400); // Match CSS animation duration
    }
    
    /**
     * Handle escape key press to close menu
     */
    function handleEscapeKey(event) {
        if (event.key === 'Escape' && isMenuOpen) {
            isMenuOpen = false;
            closeMenu();
        }
    }
    
    /**
     * Handle clicks outside menu to close it
     */
    function handleOutsideClick(event) {
        if (isMenuOpen && !navMenu.contains(event.target) && !navToggle.contains(event.target)) {
            isMenuOpen = false;
            closeMenu();
        }
    }
    
    /**
     * Handle window resize to close menu on desktop
     */
    function handleResize() {
        if (window.innerWidth > 480 && isMenuOpen) {
            isMenuOpen = false;
            closeMenu();
        }
    }
    
    /**
     * Smooth scroll to section when nav link is clicked
     */
    function handleNavLinkClick(event) {
        const href = event.target.getAttribute('href');
        
        // Check if it's an internal link (starts with #)
        if (href && href.startsWith('#')) {
            event.preventDefault();
            
            const targetSection = document.querySelector(href);
            if (targetSection) {
                // Close menu if open
                if (isMenuOpen) {
                    isMenuOpen = false;
                    closeMenu();
                }
                
                // Smooth scroll to target section
                setTimeout(() => {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, isMenuOpen ? 400 : 0); // Wait for menu close animation if needed
            }
        }
    }
    
    /**
     * Add ripple effect to hamburger button
     */
    function addRippleEffect(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        // Add ripple styles
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Event Listeners
    
    // Hamburger toggle click
    navToggle.addEventListener('click', function(event) {
        event.stopPropagation();
        addRippleEffect(event);
        toggleMenu();
    });
    
    // Navigation links click
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
    
    // Click outside menu to close
    document.addEventListener('click', handleOutsideClick);
    
    // Window resize handler
    window.addEventListener('resize', handleResize);
    
    // Prevent menu clicks from closing menu
    navMenu.addEventListener('click', function(event) {
        event.stopPropagation();
    });
    
    // Initialize ARIA attributes
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-controls', 'navMenu');
    navToggle.setAttribute('aria-label', 'Toggle navigation menu');
    navMenu.setAttribute('aria-hidden', 'true');
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .nav-toggle {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
    
    // Add smooth scroll behavior for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            const targetSection = document.querySelector(href);
            
            if (targetSection && href !== '#') {
                event.preventDefault();
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Performance optimization: Throttle resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
    
    // Add loading animation for better UX
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Console log for debugging (remove in production)
    console.log('🍔 Hamburger menu initialized successfully!');
});