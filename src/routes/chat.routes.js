const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({
        reply: "Please enter a message."
      });
    }

    // 1️⃣ Lấy sản phẩm còn hàng
    const products = await Product.find({ stock: { $gt: 0 } })
      .sort({ createdAt: -1 })
      .limit(12);

    if (!products.length) {
      return res.json({
        reply: "Sorry, there are no available products at the moment."
      });
    }

    // 2️⃣ Chuẩn hóa dữ liệu cho AI
    const productList = products
      .map(p => {
        return `
Product name: ${p.name}
Category: ${p.category}
Brand: ${p.brand}
Price: $${p.price}
Description: ${p.description || "No description"}
Stock: ${p.stock}
        `;
      })
      .join("\n");

    // 3️⃣ Prompt bán hàng chuyên nghiệp
    const prompt = `
You are a professional sales assistant for an online audio equipment store.

Available products:
${productList}

Rules:
- Only recommend products listed above
- Do NOT invent new products
- Prioritize products that match the customer's needs
- Ask follow-up questions if needed
- Be friendly, clear, and concise
- Answer in English

Customer question:
${message}
`;

    // 4️⃣ Gọi Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.json({
        reply: "Sorry, I cannot answer right now."
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't find a suitable product.";

    return res.json({ reply });
  } catch (error) {
    console.error("Chatbot Mongo error:", error);
    return res.json({
      reply: "Server error. Please try again later."
    });
  }
});

module.exports = router;
