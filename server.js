const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Load environment variables
dotenv.config();

const app = express();
const port = 3000;

// Hugging Face API configuration
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;
const HF_API_URL = "https://api-inference.huggingface.co/models/";
const MODEL_NAME = "gpt2"; // Using GPT2 model which is publicly accessible

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/generate', async (req, res) => {
    try {
        const { content, platforms, style, tone = 'engaging' } = req.body;

        if (!content || !platforms || platforms.length === 0) {
            return res.status(400).json({
                error: 'Content and at least one platform are required'
            });
        }

        const captions = {};
        
        for (const platform of platforms) {
            try {
                // Create a simpler prompt format that works better with GPT2
                let prompt = '';
                if (platform.toLowerCase() === 'tiktok') {
                    prompt = `TikTok Caption: Create a ${style} and ${tone} caption about ${content}. Make it viral and trendy with emojis: `;
                } else if (platform.toLowerCase() === 'instagram') {
                    prompt = `Instagram Caption: Write a ${style} and ${tone} caption about ${content}. Add emojis and make it engaging: `;
                } else {
                    prompt = `Social Media Caption: Generate a ${style} and ${tone} caption about ${content} with emojis: `;
                }

                console.log(`Generating caption for ${platform} with prompt:`, prompt);
                
                const response = await fetch(`${HF_API_URL}${MODEL_NAME}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${HF_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inputs: prompt,
                        parameters: {
                            max_length: 100,
                            temperature: 0.9,
                            top_k: 50,
                            top_p: 0.95,
                            do_sample: true,
                            num_return_sequences: 1,
                            return_full_text: false,
                            stop: ["\n", ".", "!"]
                        }
                    })
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`API Error for ${platform}:`, {
                        status: response.status,
                        statusText: response.statusText,
                        error: errorText
                    });
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }
                
                const result = await response.json();
                console.log(`API Response for ${platform}:`, result);
                
                let caption;
                if (Array.isArray(result) && result.length > 0) {
                    caption = result[0].generated_text || result[0];
                } else if (typeof result === 'string') {
                    caption = result;
                } else {
                    console.error(`Unexpected response format for ${platform}:`, result);
                    throw new Error('Unexpected response format from API');
                }

                // Clean up and format the caption
                caption = caption.trim()
                    .replace(/^(TikTok|Instagram|Social Media) Caption:\s*/i, '')
                    .replace(/^Write |^Create |^Generate /i, '')
                    .trim();

                // Add hashtags based on content and platform
                const hashtags = generateHashtags(content, platform);
                caption = `${caption}\n\n${hashtags}`;
                
                captions[platform] = caption;
                
            } catch (error) {
                console.error(`Detailed error for ${platform}:`, {
                    message: error.message,
                    stack: error.stack
                });
                captions[platform] = `Error: ${error.message}`;
            }
        }
        
        res.json({ captions });
    } catch (error) {
        console.error('Server error:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
});

// Helper function to generate relevant hashtags
function generateHashtags(content, platform) {
    const words = content.toLowerCase().split(/\W+/).filter(word => word.length > 3);
    const platformTag = platform.toLowerCase();
    let hashtags = [`#${platformTag}`, `#${platformTag}viral`, `#trending`];
    
    // Add content-specific hashtags
    words.forEach(word => {
        if (!hashtags.includes(`#${word}`)) {
            hashtags.push(`#${word}`);
        }
    });

    // Add platform-specific hashtags
    if (platformTag === 'tiktok') {
        hashtags.push('#fyp', '#foryou', '#foryoupage', '#viral');
    } else if (platformTag === 'instagram') {
        hashtags.push('#instagood', '#instagram', '#photooftheday');
    }

    return hashtags.join(' ');
}

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy' });
});

app.get('/api/platforms', (req, res) => {
    res.json({
        platforms: [
            'instagram',
            'twitter',
            'tiktok',
            'youtube'
        ]
    });
});

// Start server
app.listen(port, '127.0.0.1', () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
});
