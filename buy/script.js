const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Advanced Particle System
const particleCount = 1500;
const particles = new THREE.BufferGeometry();
const posArray = new Float32Array(particleCount * 3);
const colorArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 2000;
    colorArray[i] = Math.random() * 0.5 + 0.5; // Vary brightness
}
particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particles.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.3
});
const particleSystem = new THREE.Points(particles, material);
scene.add(particleSystem);

camera.position.z = 500;

function animate() {
    requestAnimationFrame(animate);
    particleSystem.rotation.y += 0.0007;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// GSAP Animations
gsap.from(".hero", { duration: 1.5, y: 50, opacity: 0, ease: "power3.out" });
gsap.from(".courses", { duration: 1.5, y: 50, opacity: 0, delay: 0.5, ease: "power3.out" });
gsap.from(".registration", { duration: 1.5, y: 50, opacity: 0, delay: 1, ease: "power3.out" });
gsap.from(".similar-courses", { duration: 1.5, y: 50, opacity: 0, delay: 1.5, ease: "power3.out" });

// Form handling
const form = document.getElementById("courseForm");
const payBtn = document.getElementById("payBtn");

// Auto-fill Buying Time and IP Address
const buyingTimeInput = document.getElementById("buying_time");
buyingTimeInput.value = new Date().toISOString();

fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        document.getElementById("ip_address").value = data.ip;
    })
    .catch(error => {
        document.getElementById("ip_address").value = "Unable to fetch IP";
        console.error('Error fetching IP:', error);
    });

const validationRules = {
    name: { pattern: /^.{2,}$/, message: "Please enter a valid name (2+ characters)" },
    dob: { pattern: /^\d{4}-\d{2}-\d{2}$/, message: "Please enter a valid date of birth" },
    phone: { pattern: /^[0-9]{10}$/, message: "Please enter a valid 10-digit phone number" },
    email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address" },
    address: { pattern: /.+/, message: "Please enter your address" },
    product_id: { pattern: /.+/, message: "Product ID is required" },
    buying_time: { pattern: /.+/, message: "Buying time is required" },
    ip_address: { pattern: /.+/, message: "IP address is required" }
};

function validateInput(input) {
    const rule = validationRules[input.name];
    const isValid = rule.pattern.test(input.value);
    input.classList.toggle('error', !isValid);
    const errorMessage = input.nextElementSibling;
    errorMessage.textContent = isValid ? '' : rule.message;
    return isValid;
}

form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => validateInput(input));
    input.addEventListener('blur', () => validateInput(input));
});

payBtn.onclick = () => {
    let isValid = true;
    form.querySelectorAll('input').forEach(input => {
        if (!validateInput(input)) isValid = false;
    });

    if (!isValid) return;

    payBtn.classList.add('loading');
    payBtn.textContent = 'Processing...';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const options = {
        key: "rzp_live_i5o6AxHTDMTQoT",
        amount: 100, // ₹1 in paise
        currency: "INR",
        name: "FFBYIIUO",
        image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg0wjmyM4jjwHVlu4gJO0mKuIiycxz_ERcphWdTk1hOOpkGljjXXwN00jecw-FBwkmQ2SEXJ6oC2uHG0pknh3cRDK2ht2WhXf9gwMDIbbhAv9lczk9wxB3mwLcRoEtz9YqPtbzpVJ-MYe2yVXKez72onsAJ1irPGkWt7pHAYL43xb_WLKcg7sjW-86U11OX/s512-rw/It%20Is%20Unique%20Official.png",
        description: "Course Enrollment Fee",
        handler: function (response) {
            const message = `
🏆 New Course Enrollment:
👤 Name: ${data.name}
🎂 Date of Birth: ${data.dob}
📱 Phone: ${data.phone}
📧 Email: ${data.email}
🏠 Address: ${data.address}
🆔 Product ID: ${data.product_id}
⏰ Buying Time: ${data.buying_time}
🌐 IP Address: ${data.ip_address}
💳 Payment ID: ${response.razorpay_payment_id}
            `.trim();

            fetch(`https://api.telegram.org/bot6784154796:AAG9E0I8iZcgd-g0ZYzHa9H3782WsYWs0vs/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: "-4881147781",
                    text: message
                })
            }).then(() => {
                payBtn.classList.remove('loading');
                payBtn.textContent = '✅ Success!';
                gsap.fromTo(payBtn, { scale: 1 }, { scale: 1.1, duration: 0.3, yoyo: true, repeat: 1 });
                setTimeout(() => {
                    payBtn.textContent = 'Pay ₹999 & Enroll';
                }, 2000);
                alert("✅ Enrollment successful! Check your email for confirmation.");
            }).catch(error => {
                payBtn.classList.remove('loading');
                payBtn.textContent = 'Pay ₹999 & Enroll';
                alert("❌ Enrollment failed. Please try again.");
                console.error('Error:', error);
            });
        },
        prefill: {
            name: data.name,
            email: data.email,
            contact: data.phone
        },
        theme: {
            color: "#ff4646"
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();
};

form.onsubmit = (e) => {
    e.preventDefault();
    payBtn.click();
};