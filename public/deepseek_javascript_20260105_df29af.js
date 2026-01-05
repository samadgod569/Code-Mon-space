// Theme Manager
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    document.documentElement.setAttribute('data-theme', this.theme);
    
    document.getElementById('themeToggle').addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
    
    showNotification(`Switched to ${this.theme} mode`, 'success');
  }
}

// Scroll Animation Manager
class ScrollManager {
  constructor() {
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => {
      observer.observe(el);
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 100) {
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.backgroundColor = 'rgba(10, 10, 15, 0.98)';
      } else {
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.backgroundColor = 'rgba(10, 10, 15, 0.95)';
      }
    });
  }
}

// Button Handlers
class ButtonManager {
  constructor() {
    this.init();
  }

  init() {
    // Dashboard button
    document.getElementById('dashboardBtn').addEventListener('click', () => {
      showNotification('Opening Dashboard...', 'info');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 500);
    });

    // Get Started button
    document.getElementById('getStartedBtn').addEventListener('click', () => {
      showNotification('Redirecting to generator...', 'info');
      setTimeout(() => {
        window.location.href = 'generate.html';
      }, 500);
    });

    // Learn More button
    document.getElementById('learnMoreBtn').addEventListener('click', () => {
      document.getElementById('features').scrollIntoView({ 
        behavior: 'smooth' 
      });
    });

    // Try Now buttons
    document.querySelectorAll('.try-btn:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.target.getAttribute('data-type');
        switch(type) {
          case 'website':
            showNotification('Launching Website Hosting...', 'success');
            setTimeout(() => {
              window.location.href = 'hosting/website.html';
            }, 800);
            break;
          case 'app':
            showNotification('Launching App Hosting...', 'success');
            setTimeout(() => {
              window.location.href = 'hosting/app.html';
            }, 800);
            break;
          case 'database':
            showNotification('Launching Database Hosting...', 'success');
            setTimeout(() => {
              window.location.href = 'hosting/database.html';
            }, 800);
            break;
          default:
            showNotification('Feature coming soon!', 'info');
        }
      });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if(target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize managers
  new ThemeManager();
  new ScrollManager();
  new ButtonManager();

  // Add welcome notification
  setTimeout(() => {
    showNotification('Welcome to Code Mon! 🚀', 'success');
  }, 1000);

  // Add loading state to buttons
  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', function() {
      if(this.classList.contains('loading')) return;
      
      const originalHTML = this.innerHTML;
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
      this.classList.add('loading');
      
      // Reset button after 2 seconds if not redirected
      setTimeout(() => {
        this.innerHTML = originalHTML;
        this.classList.remove('loading');
      }, 2000);
    });
  });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + T to toggle theme
  if((e.ctrlKey || e.metaKey) && e.key === 't') {
    e.preventDefault();
    document.getElementById('themeToggle').click();
  }
  
  // Ctrl/Cmd + D for dashboard
  if((e.ctrlKey || e.metaKey) && e.key === 'd') {
    e.preventDefault();
    document.getElementById('dashboardBtn').click();
  }
  
  // Escape to clear notifications
  if(e.key === 'Escape') {
    document.querySelectorAll('.notification').forEach(notification => {
      notification.remove();
    });
  }
});

// Add CSS for loading state
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
  .loading {
    opacity: 0.8;
    cursor: not-allowed !important;
  }
  
  .fa-spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(loadingStyle);