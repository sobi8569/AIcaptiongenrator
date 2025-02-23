// Background animation metrics
const metrics = [
    { text: '1.2M', icon: 'fas fa-heart', color: '#ff4d4d' },
    { text: '847K', icon: 'fas fa-share', color: '#3498db' },
    { text: '234K', icon: 'fas fa-comment', color: '#2ecc71' },
    { text: '56.2K', icon: 'fas fa-retweet', color: '#1da1f2' },
    { text: '12K', icon: 'fas fa-envelope', color: '#e74c3c' },
    { text: '987K', icon: 'fas fa-chart-line', color: '#9b59b6' },
    { text: '45.3K', icon: 'fas fa-bookmark', color: '#f1c40f' },
    { text: '92%', icon: 'fas fa-chart-bar', color: '#1abc9c' },
    { text: '500K', icon: 'fas fa-users', color: '#e67e22' }
];

// Background animation
function createFloatingNumber() {
    const number = document.createElement('div');
    number.className = 'number';
    
    // Random starting position in the center area
    const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 100;
    const startY = window.innerHeight / 2 + (Math.random() - 0.5) * 100;
    
    // Random angle for movement direction
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.min(window.innerWidth, window.innerHeight) * 0.4;
    
    const xOffset = Math.cos(angle) * distance;
    const yOffset = Math.sin(angle) * distance;
    
    number.style.left = `${startX}px`;
    number.style.top = `${startY}px`;
    number.style.setProperty('--x-offset', `${xOffset}px`);
    number.style.setProperty('--y-offset', `${yOffset}px`);
    
    const metric = metrics[Math.floor(Math.random() * metrics.length)];
    number.innerHTML = `<i class="${metric.icon}" style="color: ${metric.color}"></i> ${metric.text}`;
    
    document.getElementById('bgNumbers').appendChild(number);
    
    setTimeout(() => number.remove(), 4000);
}

// Create background numbers
setInterval(createFloatingNumber, 300);

// Initial creation of numbers
for (let i = 0; i < 10; i++) {
    setTimeout(() => createFloatingNumber(), i * 200);
}

// Caption Generator Functionality
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const captionResults = document.getElementById('captionResults');
    const platformCheckboxes = document.querySelectorAll('input[name="platform"]');
    const contentInput = document.querySelector('.content-input textarea');
    const styleSelect = document.getElementById('captionStyle');

    const API_URL = 'http://127.0.0.1:3000';  

    async function generateCaptions(content, platforms, style) {
        try {
            const response = await fetch(`${API_URL}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    platforms,
                    style,
                    tone: 'engaging'
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to generate captions');
            }

            const data = await response.json();
            return data.captions;
        } catch (error) {
            console.error('Error generating captions:', error);
            throw error;
        }
    }

    function createCaptionCard(platform, caption) {
        return `
            <div class="caption-card" style="opacity: 0; transform: translateY(20px);">
                <div class="caption-platform">
                    <i class="fab fa-${platform}"></i> ${platform.charAt(0).toUpperCase() + platform.slice(1)}
                </div>
                <div class="caption-text">
                    ${caption}
                </div>
                <button class="copy-btn" data-caption="${caption.replace(/"/g, '&quot;')}">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
        `;
    }

    generateBtn.addEventListener('click', async () => {
        const selectedPlatforms = Array.from(platformCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        const content = contentInput.value.trim();
        const style = styleSelect.value;

        if (!content) {
            showError('Please enter content description or keywords');
            return;
        }

        if (selectedPlatforms.length === 0) {
            showError('Please select at least one platform');
            return;
        }

        // Show loading state
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        captionResults.innerHTML = '<div class="loading">Generating AI captions...</div>';

        try {
            // Generate captions using AI
            const captions = await generateCaptions(content, selectedPlatforms, style);
            
            // Clear previous results
            captionResults.innerHTML = '';
            
            // Display each caption with animation
            Object.entries(captions).forEach(([platform, caption], index) => {
                captionResults.insertAdjacentHTML('beforeend', createCaptionCard(platform, caption));
                
                // Animate each card
                setTimeout(() => {
                    const card = captionResults.children[index];
                    card.style.transition = 'all 0.5s ease-out';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        } catch (error) {
            showError(error.message || 'Failed to generate captions. Please try again.');
        } finally {
            // Reset button state
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Captions';
        }
    });

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        captionResults.innerHTML = '';
        captionResults.appendChild(errorDiv);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            setTimeout(() => errorDiv.remove(), 500);
        }, 5000);
    }

    // Add copy button functionality with animation
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.copy-btn');
        if (!btn) return;
        
        const caption = btn.dataset.caption;
        navigator.clipboard.writeText(caption).then(() => {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            btn.classList.add('copied');
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('copied');
            }, 2000);
        });
    });
});
