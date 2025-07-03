/**
 * Initializes Typed.js for animated text in the hero section
 */
const typed = new Typed('#typed-text', {
  strings: ['Code in the abyss...', 'Unleash dark coding powers...', 'Master the haunted web...'],
  typeSpeed: 60,
  backSpeed: 30,
  loop: true,
  backDelay: 2000
});

/**
 * Modal controls
 */
const enrollModal = document.getElementById('enrollModal');
const openModal = () => {
  enrollModal.style.display = 'flex';
  enrollModal.querySelector('#name').focus();
};

const closeModal = () => {
  enrollModal.style.display = 'none';
  document.querySelectorAll('.error').forEach(error => error.classList.add('hidden'));
};

/**
 * Form validation and submission
 */
const validateForm = (formId, errorId, fieldId, validationFn, errorMessage) => {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (!validationFn(field.value)) {
    error.classList.remove('hidden');
    error.textContent = errorMessage;
    return false;
  }
  error.classList.add('hidden');
  return true;
};

document.getElementById('enrollForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nameValid = validateForm('enrollForm', 'nameError', 'name', value => value.trim().length > 0, 'Please enter your name.');
  const emailValid = validateForm('enrollForm', 'emailError', 'email', value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'Please enter a valid email.');
  
  if (nameValid && emailValid) {
    const submitButton = e.target.querySelector('button[type="submit"]');
    const spinner = document.getElementById('loadingSpinner');
    submitButton.disabled = true;
    spinner.classList.remove('hidden');
    
    // Simulate async submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Your soul is bound! Redirecting to payment...');
    window.location.href = 'https://example.com/enroll';
    
    submitButton.disabled = false;
    spinner.classList.add('hidden');
  }
});

document.getElementById('newsletterForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const emailValid = validateForm('newsletterForm', 'newsletterError', 'newsletterEmail', value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'Please enter a valid email.');
  
  if (emailValid) {
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Subscribed to the haunted newsletter!');
    submitButton.disabled = false;
  }
});

/**
 * GSAP Scroll Animations
 */
gsap.registerPlugin(ScrollTrigger);
document.querySelectorAll('.animate-on-scroll').forEach(el => {
  gsap.fromTo(el, 
    { opacity: 0, y: 50 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 1, 
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );
});

/**
 * Particle effect
 */
const createParticles = (containerId, count) => {
  const container = document.getElementById(containerId);
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 6}s`;
    container.appendChild(particle);
  }
};

createParticles('hero-particles', 40);
createParticles('main-particles', 30);
createParticles('footer-particles', 20);

/**
 * Sound toggle
 */
const soundToggle = document.getElementById('sound-toggle');
const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
audio.loop = true;
let isPlaying = false;

soundToggle.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
  } else {
    audio.play().catch(() => alert('Audio playback failed. Please try again.'));
    soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
  }
  isPlaying = !isPlaying;
});

/**
 * Back to Top Button
 */
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/**
 * Keyboard navigation for modal
 */
enrollModal.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});