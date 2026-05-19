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

// Оптимізована та ультра-коротка системна інструкція з конкретними цінами
const systemPrompt = `Ти — ШІ-Асистент агенції Ovcharuk Agency на ім'я Ovcharuk AI.
Ти спілкуєшся з клієнтами ВИКЛЮЧНО українською мовою.

КРИТИЧНО ВАЖЛИВІ ПРАВИЛА:
1. Твої відповіді мають бути УЛЬТРА-КОРОТКИМИ та ЛАКOНІЧНИМИ. Максимум 2-4 коротких речення (до 50 слів на всю відповідь!). Жодної води, довгих вступів та розлогих привітань. Відповідай миттєво та по суті.
2. Ціни мають бути абсолютно КОНКРЕТНИМИ. Якщо запитують про вартість, ціни чи тарифи, пиши тільки це:
   • Тариф "Оптимальний старт" (30 роликів/міс: 15 Reels + 15 TikTok) — $750/міс.
   • Тариф "Максимальний ріст" (60 роликів/міс: 30 Reels + 30 TikTok) — $1050/міс.
   • Інші послуги (ШІ для Direct, Блогери) — прораховуються індивідуально.
3. У кожній відповіді закликай заповнити форму замовлення нижче ("Замовити безкоштовну консультацію") або написати нам в Instagram @ovcharuk_agency.
4. Ніколи не згадуй Google. Ти розроблений командою Ovcharuk Agency.

Приклад ідеальної відповіді на питання про ціну:
"У нас є два чітких тарифи на Reels & TikTok Production: 
• 'Оптимальний старт' (30 роликів) — $750/міс.
• 'Максимальний ріст' (60 роликів) — $1050/міс.
ШІ-асистенти та блогери прораховуються під ваш запит. Заповніть коротку форму під цим чатом, і ми проведемо безкоштовний аудит вашого профілю! 👇"`;

app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Повідомлення порожнє' });
    }

    try {
        console.log(`[${new Date().toLocaleTimeString()}] Отримано запит: "${message}"`);
        
        // Запит до офіційного безкоштовного API Google Gemini 2.5 Flash
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    ...history,
                    { role: 'user', parts: [{ text: message }] }
                ],
                systemInstruction: {
                    parts: [
                        { text: systemPrompt }
                    ]
                }
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const botReply = data.candidates[0].content.parts[0].text;
            console.log(`[${new Date().toLocaleTimeString()}] ✅ Успішна відповідь.`);
            res.json({ reply: botReply });
        } else {
            console.error("❌ Помилка Google Gemini API!");
            res.status(500).json({ error: 'Некоректна відповідь від API Google' });
        }

    } catch (error) {
        console.error('❌ Помилка сервера:', error);
        res.status(500).json({ error: 'Не вдалося зв’язатися з ШІ' });
    }
});

app.post('/api/send-lead', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Повідомлення порожнє' });
    }

    try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        console.log(`[${new Date().toLocaleTimeString()}] Відправка нового ліда в Telegram...`);

        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`[${new Date().toLocaleTimeString()}] ✅ Лід успішно відправлений в Telegram.`);
            res.json({ success: true });
        } else {
            console.error("❌ Помилка Telegram API:", data);
            res.status(500).json({ error: 'Помилка при відправці в Telegram' });
        }
    } catch (error) {
        console.error('❌ Помилка відправки ліда:', error);
        res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Бекенд ШІ-асистента запущено на порту ${PORT}`);
});
