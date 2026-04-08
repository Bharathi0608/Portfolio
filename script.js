// Typing effect
const typingContainer = document.querySelector('.typing-container');
const cursor = document.querySelector('.cursor');

if (typingContainer && cursor) {
    const textNode = document.createTextNode('');
    typingContainer.insertBefore(textNode, cursor);
    
    const roles = ["Full Stack Developer", "Software Engineer", "Problem Solver"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            textNode.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textNode.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 30 : 80;

        if (!isDeleting && charIndex === currentRole.length) {
            speed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 500;
        }
        setTimeout(typeEffect, speed);
    }
    setTimeout(typeEffect, 1000);
}

// Auto-attach reveal class to elements for scroll animation
document.querySelectorAll('.section > div, .section > h2, .section > h3, .section-title, .center-heading, .card, .timeline-item, .skill-card, .project-card, .cert-card, .contact-card').forEach(el => {
    if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
    }
});

// Scroll Reveal Arrays
function reveal() {
    var reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 50;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);
reveal(); // Trigger once on load

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    });
});

// Interactive mouse follow glow for cards
document.querySelectorAll('.card, .skill-card, .project-card, .cert-card, .contact-card, .timeline-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouseX', `${x}px`);
        card.style.setProperty('--mouseY', `${y}px`);
    });
});


// ----------------------------------------------------
// FULLY INTERACTIVE BACKGROUND PARTICLE SYSTEM
// ----------------------------------------------------
const canvas = document.createElement('canvas');
canvas.id = 'interactive-bg';
document.body.prepend(canvas);

Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: '-1'
});

const ctx = canvas.getContext('2d');
let width, height, particles;

function initParticles() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    // Adjust density based on screen size
    const particleCount = Math.floor(width / 30);
    for(let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8
        });
    }
}

let mouse = { x: null, y: null };
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
window.addEventListener('resize', initParticles);

function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
    
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Bounce off walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Handle click explosion particles
        if (p.life !== undefined) {
            p.life--;
            p.radius *= 0.95;
            if (p.life <= 0) {
                particles.splice(particles.indexOf(p), 1);
                return;
            }
        }
        
        // Connect dots to mouse
        if (mouse.x != null) {
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            
            // If near mouse, draw connecting line
            if (distance < 160) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 240, 255, ${0.3 - (distance/160) * 0.3})`;
                ctx.lineWidth = 1;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
                
                // Slight magnetic pull
                p.x += dx * 0.001;
                p.y += dy * 0.001;
            }
        }
    });
    requestAnimationFrame(drawParticles);
}

initParticles();
drawParticles();

// ----------------------------------------------------
// 3D TILT EFFECT INITIATOR
// ----------------------------------------------------
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".card, .skill-card, .project-card, .cert-card, .contact-card"), {
        max: 8,
        speed: 400,
        glare: true,
        "max-glare": 0.1,
        scale: 1.02
    });
}

// ----------------------------------------------------
// NAVBAR ACTIVE HIGHLIGHTING ON SCROLL
// ----------------------------------------------------
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ----------------------------------------------------
// SCROLL PROGRESS BAR
// ----------------------------------------------------
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const bar = document.getElementById("myBar");
    if(bar) bar.style.width = scrolled + "%";
});

// ----------------------------------------------------
// MAGNETIC BUTTONS
// ----------------------------------------------------
const magnets = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-hire, .social-icons a');

magnets.forEach(magnet => {
    magnet.addEventListener('mousemove', function(e) {
        const position = magnet.getBoundingClientRect();
        const x = e.pageX - position.left - position.width / 2;
        const y = e.pageY - position.top - window.scrollY - position.height / 2;
        
        magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        magnet.style.transition = 'all 0s ease';
    });

    magnet.addEventListener('mouseleave', function() {
        magnet.style.transform = 'translate(0px, 0px)';
        magnet.style.transition = 'all 0.5s ease';
    });
});

// ----------------------------------------------------
// PARTICLE EXPLOSION ON CLICK
// ----------------------------------------------------
window.addEventListener('click', (e) => {
    if(typeof particles !== 'undefined') {
        for(let i=0; i<12; i++) {
            particles.push({
                x: e.clientX,
                y: e.clientY,
                radius: Math.random() * 3 + 1,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 100
            });
        }
    }
});




