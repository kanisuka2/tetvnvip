// Main Application Controller
class TetLixiApp {
    constructor() {
        this.envelopes = [];
        this.totalMoney = 0;
        this.collectedEnvelopes = 0;
        this.envelopeValues = this.generateEnvelopeValues();
        this.isAnimating = false;
        
        // DOM Elements
        this.treeContainer = document.getElementById('peachTree');
        this.totalMoneyDisplay = document.getElementById('totalMoney');
        this.envelopeCountDisplay = document.getElementById('envelopeCount');
        this.moneyNotification = document.getElementById('moneyNotification');
        this.currentAmountDisplay = document.getElementById('currentAmount');
        this.finalAmountDisplay = document.getElementById('finalAmount');
        this.celebrationOverlay = document.getElementById('celebrationOverlay');
        
        // Buttons
        this.endButton = document.getElementById('endBtn');
        this.musicToggle = document.getElementById('musicToggle');
        this.restartButton = document.getElementById('restartBtn');
        
        // Audio
        this.tetMusic = document.getElementById('tetMusic');
        
        this.init();
    }
    
    // Generate envelope values based on distribution
    generateEnvelopeValues() {
        const values = [];
        
        // 1 x 100k
        values.push(100000);
        
        // 5 x 50k
        for (let i = 0; i < 5; i++) values.push(50000);
        
        // 20 x 20k
        for (let i = 0; i < 20; i++) values.push(20000);
        
        // 20 x 10k
        for (let i = 0; i < 20; i++) values.push(10000);
        
        // 5 x 5k
        for (let i = 0; i < 5; i++) values.push(5000);
        
        // Shuffle the values
        return values.sort(() => Math.random() - 0.5);
    }
    
    init() {
        this.createPeachTree();
        this.attachEventListeners();
        this.createFallingItems();
        this.startBackgroundFireworks();
        
        // Auto-play music (with user interaction requirement)
        this.musicToggle.addEventListener('click', () => {
            if (this.tetMusic.paused) {
                this.tetMusic.play().catch(e => console.log("Audio play failed:", e));
                this.musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i> Tắt Nhạc';
            } else {
                this.tetMusic.pause();
                this.musicToggle.innerHTML = '<i class="fas fa-volume-up"></i> Bật Nhạc';
            }
        });
        
        // Enable music on first user interaction
        document.addEventListener('click', () => {
            if (this.tetMusic.paused) {
                this.tetMusic.play().catch(e => console.log("Audio requires user interaction"));
            }
        }, { once: true });
    }
    
    // Create SVG Peach Tree with hanging envelopes[citation:1][citation:10]
    createPeachTree() {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", "0 0 800 600");
        svg.classList.add("peach-tree-svg");
        
        // Tree trunk
        const trunk = document.createElementNS(svgNS, "path");
        trunk.setAttribute("d", "M400,550 L400,350 Q450,300 400,250 Q350,200 400,150 L400,100");
        trunk.setAttribute("fill", "none");
        trunk.setAttribute("stroke", "#8B4513");
        trunk.setAttribute("stroke-width", "25");
        trunk.setAttribute("stroke-linecap", "round");
        svg.appendChild(trunk);
        
        // Main branches
        const branches = [
            {d: "M400,250 Q300,200 250,150", width: 15},
            {d: "M400,250 Q500,200 550,150", width: 15},
            {d: "M400,350 Q300,300 250,250", width: 12},
            {d: "M400,350 Q500,300 550,250", width: 12},
            {d: "M400,450 Q350,400 300,350", width: 10},
            {d: "M400,450 Q450,400 500,350", width: 10}
        ];
        
        branches.forEach(branch => {
            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("d", branch.d);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "#8B4513");
            path.setAttribute("stroke-width", branch.width);
            path.setAttribute("stroke-linecap", "round");
            svg.appendChild(path);
        });
        
        // Create peach blossoms (flowers)
        const flowerPositions = [
            {x: 350, y: 180}, {x: 450, y: 180}, {x: 300, y: 220},
            {x: 500, y: 220}, {x: 320, y: 280}, {x: 480, y: 280},
            {x: 280, y: 320}, {x: 520, y: 320}, {x: 340, y: 380},
            {x: 460, y: 380}, {x: 380, y: 420}, {x: 420, y: 420}
        ];
        
        flowerPositions.forEach(pos => {
            const flower = document.createElementNS(svgNS, "g");
            flower.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
            
            // Flower petals
            for (let i = 0; i < 5; i++) {
                const angle = (i * 72) * Math.PI / 180;
                const petal = document.createElementNS(svgNS, "ellipse");
                petal.setAttribute("rx", "8");
                petal.setAttribute("ry", "12");
                petal.setAttribute("transform", `rotate(${i * 72})`);
                petal.setAttribute("fill", "#ff69b4");
                petal.setAttribute("opacity", "0.9");
                flower.appendChild(petal);
            }
            
            // Flower center
            const center = document.createElementNS(svgNS, "circle");
            center.setAttribute("r", "5");
            center.setAttribute("fill", "#ffd700");
            flower.appendChild(center);
            
            svg.appendChild(flower);
        });
        
        // Create hanging envelope positions
        const envelopePositions = [
            {x: 380, y: 200}, {x: 420, y: 200}, {x: 350, y: 240},
            {x: 450, y: 240}, {x: 320, y: 300}, {x: 480, y: 300},
            {x: 300, y: 340}, {x: 500, y: 340}, {x: 360, y: 400},
            {x: 440, y: 400}, {x: 340, y: 440}, {x: 460, y: 440}
        ];
        
        // Create envelope groups (will be filled with actual envelopes)
        envelopePositions.forEach((pos, index) => {
            const envelopeGroup = document.createElementNS(svgNS, "g");
            envelopeGroup.setAttribute("class", "envelope-hanger");
            envelopeGroup.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
            envelopeGroup.setAttribute("data-index", index);
            
            // String to branch
            const string = document.createElementNS(svgNS, "line");
            string.setAttribute("x1", "0");
            string.setAttribute("y1", "-20");
            string.setAttribute("x2", "0");
            string.setAttribute("y2", "0");
            string.setAttribute("stroke", "#ffd700");
            string.setAttribute("stroke-width", "2");
            string.setAttribute("stroke-dasharray", "5,5");
            envelopeGroup.appendChild(string);
            
            // Envelope placeholder (will be replaced with HTML element)
            const envelopePlaceholder = document.createElementNS(svgNS, "rect");
            envelopePlaceholder.setAttribute("x", "-30");
            envelopePlaceholder.setAttribute("y", "0");
            envelopePlaceholder.setAttribute("width", "60");
            envelopePlaceholder.setAttribute("height", "40");
            envelopePlaceholder.setAttribute("fill", "transparent");
            envelopePlaceholder.setAttribute("data-index", index);
            envelopeGroup.appendChild(envelopePlaceholder);
            
            svg.appendChild(envelopeGroup);
        });
        
        // Clear placeholder and add SVG
        this.treeContainer.innerHTML = '';
        this.treeContainer.appendChild(svg);
        
        // Create HTML envelopes
        this.createHangingEnvelopes(envelopePositions);
    }
    
    // Create HTML lucky money envelopes
    createHangingEnvelopes(positions) {
        positions.forEach((pos, index) => {
            const envelope = document.createElement('div');
            envelope.className = 'lucky-envelope';
            envelope.dataset.index = index;
            envelope.dataset.value = this.envelopeValues[index] || 0;
            envelope.dataset.collected = 'false';
            
            // Position relative to tree container
            const rect = this.treeContainer.getBoundingClientRect();
            envelope.style.left = `${(pos.x / 800) * 100}%`;
            envelope.style.top = `${(pos.y / 600) * 100}%`;
            
            // Envelope content
            envelope.innerHTML = `
                <div class="envelope-front">
                    <div class="envelope-flap"></div>
                    <div class="envelope-text">Lộc</div>
                </div>
            `;
            
            // Click event
            envelope.addEventListener('click', (e) => {
                e.stopPropagation();
                if (envelope.dataset.collected === 'false' && !this.isAnimating) {
                    this.collectEnvelope(envelope, index);
                }
            });
            
            this.treeContainer.appendChild(envelope);
            this.envelopes.push(envelope);
        });
    }
    
    // Collect an envelope
    async collectEnvelope(envelope, index) {
        this.isAnimating = true;
        envelope.dataset.collected = 'true';
        
        // Shake the tree[citation:10]
        this.shakeTree();
        
        // Animate envelope falling
        await this.animateEnvelopeFall(envelope);
        
        // Show money value
        const value = parseInt(envelope.dataset.value);
        this.showMoneyNotification(value);
        
        // Update totals
        this.totalMoney += value;
        this.collectedEnvelopes++;
        
        this.totalMoneyDisplay.textContent = this.formatMoney(this.totalMoney);
        this.envelopeCountDisplay.textContent = this.collectedEnvelopes;
        
        // Trigger fireworks[citation:3][citation:7]
        this.triggerFireworks();
        
        // Check if all envelopes collected
        if (this.collectedEnvelopes >= this.envelopeValues.length) {
            setTimeout(() => this.showFinalCelebration(), 1000);
        }
        
        this.isAnimating = false;
    }
    
    // Shake tree animation[citation:10]
    shakeTree() {
        const tree = this.treeContainer.querySelector('.peach-tree-svg');
        if (!tree) return;
        
        tree.style.transition = 'transform 0.1s';
        
        const shake = () => {
            tree.style.transform = 'translateX(-10px) rotate(-2deg)';
            setTimeout(() => {
                tree.style.transform = 'translateX(10px) rotate(2deg)';
                setTimeout(() => {
                    tree.style.transform = 'translateX(-5px) rotate(-1deg)';
                    setTimeout(() => {
                        tree.style.transform = 'translateX(5px) rotate(1deg)';
                        setTimeout(() => {
                            tree.style.transform = 'translateX(0) rotate(0deg)';
                        }, 50);
                    }, 50);
                }, 50);
            }, 50);
        };
        
        shake();
    }
    
    // Animate envelope falling
    animateEnvelopeFall(envelope) {
        return new Promise(resolve => {
            const startX = parseFloat(envelope.style.left);
            const startY = parseFloat(envelope.style.top);
            
            envelope.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
            envelope.style.transform = 'rotate(720deg) scale(1.2)';
            envelope.style.left = `${startX}%`;
            envelope.style.top = `calc(${startY}% + 200px)`;
            envelope.style.opacity = '0.5';
            
            // Open envelope effect
            setTimeout(() => {
                const front = envelope.querySelector('.envelope-front');
                if (front) {
                    front.style.transform = 'rotateX(90deg)';
                    front.style.transition = 'transform 0.5s';
                }
            }, 400);
            
            setTimeout(() => {
                envelope.remove();
                resolve();
            }, 1000);
        });
    }
    
    // Show money notification
    showMoneyNotification(amount) {
        this.currentAmountDisplay.textContent = this.formatMoney(amount);
        this.moneyNotification.style.display = 'block';
        
        // Animation
        this.moneyNotification.style.animation = 'none';
        setTimeout(() => {
            this.moneyNotification.style.animation = 'bounceIn 0.5s';
        }, 10);
        
        // Hide after delay
        setTimeout(() => {
            this.moneyNotification.style.display = 'none';
        }, 2000);
    }
    
    // Trigger celebration fireworks[citation:3]
    triggerFireworks() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createFirework(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight / 2,
                    color
                );
            }, i * 100);
        }
    }
    
    // Create falling items (gold, coins, envelopes)[citation:3]
    createFallingItems() {
        // This will be implemented in firework.js for Canvas-based falling items
    }
    
    // Start background fireworks[citation:7]
    startBackgroundFireworks() {
        // Auto-launch fireworks periodically
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance
                createFirework(
                    Math.random() * window.innerWidth,
                    window.innerHeight,
                    ['#ff0000', '#00ff00', '#0000ff', '#ffff00'][Math.floor(Math.random() * 4)]
                );
            }
        }, 1000);
    }
    
    // Show final celebration
    showFinalCelebration() {
        this.finalAmountDisplay.textContent = this.formatMoney(this.totalMoney) + ' VND';
        this.celebrationOverlay.style.display = 'flex';
        
        // Trigger massive fireworks
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                createFirework(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)]
                );
            }, i * 100);
        }
    }
    
    // Format money for display
    formatMoney(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    // Attach event listeners
    attachEventListeners() {
        // Tree click for shaking
        this.treeContainer.addEventListener('click', (e) => {
            if (e.target === this.treeContainer || e.target.classList.contains('tree-placeholder')) {
                this.shakeTree();
            }
        });
        
        // End button
        this.endButton.addEventListener('click', () => {
            this.showFinalCelebration();
        });
        
        // Restart button
        this.restartButton.addEventListener('click', () => {
            location.reload();
        });
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TetLixiApp();
    window.tetApp = app; // Make accessible for debugging
});
