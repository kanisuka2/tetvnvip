// Fireworks and Falling Items System
class FireworkSystem {
    constructor() {
        this.canvas = document.getElementById('backgroundFireworks');
        this.fallingCanvas = document.getElementById('fallingItems');
        this.ctx = this.canvas.getContext('2d');
        this.fallingCtx = this.fallingCanvas.getContext('2d');
        
        this.fireworks = [];
        this.particles = [];
        this.fallingItems = [];
        
        this.hue = 120;
        this.timerTick = 0;
        this.timerTotal = 80;
        
        this.init();
    }
    
    init() {
        // Set canvas dimensions
        this.resizeCanvases();
        window.addEventListener('resize', () => this.resizeCanvases());
        
        // Create initial falling items
        this.createFallingItems();
        
        // Start animation loop
        this.loop();
    }
    
    resizeCanvases() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.fallingCanvas.width = window.innerWidth;
        this.fallingCanvas.height = window.innerHeight;
    }
    
    // Create falling items (gold, coins, envelopes)
    createFallingItems() {
        const itemTypes = ['coin', 'gold', 'envelope'];
        
        for (let i = 0; i < 30; i++) {
            this.fallingItems.push({
                x: Math.random() * this.fallingCanvas.width,
                y: Math.random() * this.fallingCanvas.height,
                type: itemTypes[Math.floor(Math.random() * itemTypes.length)],
                size: Math.random() * 20 + 10,
                speed: Math.random() * 2 + 1,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.05
            });
        }
    }
    
    // Draw falling items
    drawFallingItems() {
        this.fallingCtx.clearRect(0, 0, this.fallingCanvas.width, this.fallingCanvas.height);
        
        this.fallingItems.forEach(item => {
            // Update position
            item.y += item.speed;
            item.x += Math.sin(Date.now() * 0.001 + item.x) * 0.5; // Gentle sway
            item.rotation += item.rotationSpeed;
            
            // Reset if off screen
            if (item.y > this.fallingCanvas.height) {
                item.y = -item.size;
                item.x = Math.random() * this.fallingCanvas.width;
            }
            
            // Draw based on type
            this.fallingCtx.save();
            this.fallingCtx.translate(item.x, item.y);
            this.fallingCtx.rotate(item.rotation);
            
            switch (item.type) {
                case 'coin':
                    this.drawCoin(item);
                    break;
                case 'gold':
                    this.drawGold(item);
                    break;
                case 'envelope':
                    this.drawFallingEnvelope(item);
                    break;
            }
            
            this.fallingCtx.restore();
        });
    }
    
    drawCoin(item) {
        this.fallingCtx.fillStyle = '#FFD700';
        this.fallingCtx.strokeStyle = '#B8860B';
        this.fallingCtx.lineWidth = 2;
        
        // Coin circle
        this.fallingCtx.beginPath();
        this.fallingCtx.arc(0, 0, item.size / 2, 0, Math.PI * 2);
        this.fallingCtx.fill();
        this.fallingCtx.stroke();
        
        // Coin text
        this.fallingCtx.fillStyle = '#B8860B';
        this.fallingCtx.font = `${item.size / 3}px Arial`;
        this.fallingCtx.textAlign = 'center';
        this.fallingCtx.textBaseline = 'middle';
        this.fallingCtx.fillText('₫', 0, 0);
    }
    
    drawGold(item) {
        // Gold bar
        this.fallingCtx.fillStyle = 'linear-gradient(45deg, #FFD700, #FFA500)';
        const gradient = this.fallingCtx.createLinearGradient(
            -item.size / 2, -item.size / 4,
            item.size / 2, item.size / 4
        );
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(1, '#FFA500');
        
        this.fallingCtx.fillStyle = gradient;
        this.fallingCtx.fillRect(-item.size / 2, -item.size / 4, item.size, item.size / 2);
        
        // Gold bar details
        this.fallingCtx.fillStyle = '#B8860B';
        this.fallingCtx.fillRect(-item.size / 2 + 5, -item.size / 4 + 3, item.size - 10, 2);
        this.fallingCtx.fillRect(-item.size / 2 + 5, -item.size / 4 + 7, item.size - 10, 2);
    }
    
    drawFallingEnvelope(item) {
        // Envelope body
        this.fallingCtx.fillStyle = '#DC143C';
        this.fallingCtx.fillRect(-item.size / 2, -item.size / 3, item.size, item.size * 0.67);
        
        // Envelope flap
        this.fallingCtx.beginPath();
        this.fallingCtx.moveTo(-item.size / 2, -item.size / 3);
        this.fallingCtx.lineTo(0, -item.size / 1.5);
        this.fallingCtx.lineTo(item.size / 2, -item.size / 3);
        this.fallingCtx.closePath();
        this.fallingCtx.fill();
        
        // Gold border
        this.fallingCtx.strokeStyle = '#FFD700';
        this.fallingCtx.lineWidth = 2;
        this.fallingCtx.strokeRect(-item.size / 2, -item.size / 3, item.size, item.size * 0.67);
        
        // Text
        this.fallingCtx.fillStyle = '#FFD700';
        this.fallingCtx.font = `${item.size / 3}px Arial`;
        this.fallingCtx.textAlign = 'center';
        this.fallingCtx.textBaseline = 'middle';
        this.fallingCtx.fillText('Lì xì', 0, 0);
    }
    
    // Firework system[citation:3][citation:7]
    createFirework(sx, sy, tx, ty, color) {
        this.fireworks.push(new Firework(sx, sy, tx, ty, color));
    }
    
    drawFireworks() {
        // Clear with fade effect
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.globalCompositeOperation = 'lighter';
        
        // Update and draw fireworks
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            this.fireworks[i].update();
            this.fireworks[i].draw(this.ctx);
            
            if (this.fireworks[i].done) {
                this.fireworks.splice(i, 1);
            }
        }
        
        // Update and draw particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            this.particles[i].draw(this.ctx);
            
            if (this.particles[i].done) {
                this.particles.splice(i, 1);
            }
        }
        
        // Auto-launch fireworks
        if (this.timerTick >= this.timerTotal) {
            this.createFirework(
                this.canvas.width / 2,
                this.canvas.height,
                Math.random() * this.canvas.width,
                Math.random() * (this.canvas.height / 2),
                `hsl(${Math.random() * 360}, 100%, 50%)`
            );
            this.timerTick = 0;
        } else {
            this.timerTick++;
        }
    }
    
    loop() {
        this.drawFireworks();
        this.drawFallingItems();
        requestAnimationFrame(() => this.loop());
    }
}

// Firework class[citation:3]
class Firework {
    constructor(sx, sy, tx, ty, color) {
        this.x = sx;
        this.y = sy;
        this.sx = sx;
        this.sy = sy;
        this.tx = tx;
        this.ty = ty;
        this.color = color;
        
        this.distance = this.calculateDistance(sx, sy, tx, ty);
        this.traveled = 0;
        this.coordinates = [];
        this.coordinateCount = 3;
        
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        
        this.angle = Math.atan2(ty - sy, tx - sx);
        this.speed = 2;
        this.acceleration = 1.05;
        this.brightness = Math.random() * 20 + 50;
        this.targetRadius = 1;
        this.done = false;
    }
    
    calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    
    update() {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        
        if (this.targetRadius < 8) {
            this.targetRadius += 0.3;
        } else {
            this.targetRadius = 1;
        }
        
        this.speed *= this.acceleration;
        
        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;
        
        this.traveled = this.calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);
        
        if (this.traveled >= this.distance) {
            this.createParticles();
            this.done = true;
        } else {
            this.x += vx;
            this.y += vy;
        }
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], 
                  this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    createParticles() {
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            window.fireworkSystem.particles.push(new Particle(this.tx, this.ty, this.color));
        }
    }
}

// Particle class[citation:3]
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.coordinates = [];
        this.coordinateCount = 5;
        
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 5 + 1;
        this.friction = 0.95;
        this.gravity = 0.2;
        this.hue = parseInt(color.split('(')[1]) || Math.random() * 360;
        this.brightness = Math.random() * 20 + 50;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.015;
        this.done = false;
    }
    
    update() {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
        
        if (this.alpha <= this.decay) {
            this.done = true;
        }
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0],
                  this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// Global function to create fireworks
function createFirework(x, y, color) {
    if (!window.fireworkSystem) {
        window.fireworkSystem = new FireworkSystem();
    }
    
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight;
    
    window.fireworkSystem.createFirework(startX, startY, x, y, color);
}

// Initialize firework system
document.addEventListener('DOMContentLoaded', () => {
    window.fireworkSystem = new FireworkSystem();
});
