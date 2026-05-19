import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;
const PORT = process.env.PORT || 5050;

app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Повідомлення порожнє' });
    }

    try {
        // Запит до офіційного безкоштовного API Google Gemini 1.5 Flash
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    // Передаємо історію, яку накопичує фронтенд, + нове повідомлення користувача
                    ...history,
                    { role: 'user', parts: [{ text: message }] }
                ]
            })
        });

        const data = await response.json();
        
        // Перевірка, чи Google повернув коректну відповідь
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const botReply = data.candidates[0].content.parts[0].text;
            res.json({ reply: botReply });
        } else {
            res.status(500).json({ error: 'Некоректна відповідь від API Google' });
        }

    } catch (error) {
        console.error('Помилка сервера:', error);
        res.status(500).json({ error: 'Не вдалося зв’язатися з ШІ' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Бекенд ШІ-асистента запущено на порту ${PORT}`);
});