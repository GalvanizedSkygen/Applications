const canvas = document.createElement('canvas');
canvas.id = 'particle-canvas';
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '1';
document.body.prepend(canvas);

const ctx = canvas.getContext('2d');
let width, height;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resize);
resize();

const particles = [];
const colors = ['#866043', '#7d7d7d', '#373737', '#a6a6a6', '#3c8527'];

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 200;
        this.size = Math.random() * 15 + 5;
        this.speedY = -(Math.random() * 1 + 0.5);
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y < -50) {
            this.y = height + 50;
            this.x = Math.random() * width;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        
        // draw a tiny border for minecraft feel
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.globalAlpha = this.opacity * 0.5;
        ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
        
        ctx.restore();
    }
}

for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    for (let p of particles) {
        p.update();
        p.draw();
    }
    
    requestAnimationFrame(animate);
}

animate();
