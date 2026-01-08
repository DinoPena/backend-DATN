const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/ask', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Cấu hình model (gemini-1.5-flash là bản nhanh và miễn phí tốt nhất hiện nay)
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "You are a helpful customer support assistant for an electronics store. Answer in English. Keep answers concise. If users ask about prices/products, encourage them to check the catalog.",
        });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi xử lý chatbot" });
    }
});

module.exports = router;