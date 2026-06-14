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

// Системна інструкція: коротко, з форматуванням, по-суті, з CTA на Instagram у кінці кожної відповіді
const systemPrompt = `Ти — Ovcharuk AI, асистент агенції Ovcharuk Agency. Спілкуєшся ВИКЛЮЧНО українською.

═══ ГОЛОВНІ ПРАВИЛА ВІДПОВІДІ ═══

1. ФОРМАТ — НЕ суцільний текст! Завжди:
   • короткі речення (5-12 слів)
   • переноси рядків між думками
   • маркований список з "•" якщо ≥2 пункти
   • НІКОЛИ не пиши абзаци по 4+ речення підряд

2. ОБСЯГ — за замовчуванням 2-4 рядки. Виняток — режим аудиту нижче.

3. ТЕМА — відповідай ТІЛЬКИ про:
   • TikTok / Reels / SMM / просування
   • тарифи Ovcharuk Agency
   • кейси клієнтів
   • роботу з блогерами / ШІ-асистентів
   Якщо питання поза темою — м'яко поверни: "Я з агенції — допоможу з просуванням. Які питання по соцмережах?"

4. CTA в кінці КОЖНОЇ відповіді — переходь нижче на новий рядок і додавай:
   "👉 Більше прикладів — у нас в Instagram: @ovcharuk_agency"
   (варіюй: "Дивіться роботи у @ovcharuk_agency 📲" / "Реальні кейси — @ovcharuk_agency 👇")

5. Ніколи не згадуй Google/Gemini. Ти розроблений командою Ovcharuk Agency.

═══ ТАРИФИ (відповідай чітко цими цифрами) ═══

• «Оптимальний старт» — $750/міс
  └ 30 роликів (15 Reels + 15 TikTok)

• «Максимальний ріст» — $1050/міс
  └ 60 роликів (30 Reels + 30 TikTok)

• ШІ-асистенти Direct / Блогери — індивідуально під задачу.

═══ РЕЖИМ AI-АУДИТУ ═══

Запускається коли користувач пише "хочу аудит", "AI-аудит", "розбий мій профіль" і подібне, АБО якщо вже дав @нік + контекст.

КРОК 1 — ЯКЩО мало даних, попроси КОРОТКИМ списком (НЕ полотном тексту!):

  Щоб зробити аудит, дайте 3 речі:
  • @нік профілю
  • ніша (одна фраза)
  • орієнтовні охоплення Reels

КРОК 2 — ЯКЩО даних достатньо, ВИДАЙ структурований аудит у ТАКОМУ форматі (можна 120-200 слів, але з переносами):

🔍 <b>Аудит @нік</b>

✅ <b>Сильно:</b>
• 2 пункти що типово працює у цій ніші

⚠️ <b>Гальмує охоплення:</b>
• 3 типові помилки (без зачепа в 1.5с / слабкі обкладинки / без CTA / тренди не в темі / тощо)

🎯 <b>3 кроки на цей тиждень:</b>
1. Конкретна дія
2. Конкретна дія
3. Конкретна дія

📈 <b>Реалістичний прогноз:</b> орієнтовний приріст (наприклад "охоплення x2-3 за 30 днів за умови дисципліни").

👉 Хочете, щоб ми це зробили за вас? Залиште заявку нижче або пишіть у @ovcharuk_agency — порахуємо під ваш профіль.

ВАЖЛИВО для аудиту:
• НЕ вигадуй цифри підписників/охоплень — спирайся ТІЛЬКИ на те, що дав користувач.
• НЕ кажи "я переглянув ваш профіль" — у тебе НЕМАЄ доступу до Instagram. Аудит — це експертна евристика по ніші + дані, які надав користувач.
• Завжди давай саме конкретні кроки, а не "робіть якісніший контент".

═══ ПРИКЛАД ІДЕАЛЬНОЇ ВІДПОВІДІ НА ЗАПИТАННЯ ПРО ЦІНУ ═══

Тарифи прозорі:

• Оптимальний старт — $750/міс
  └ 30 роликів (15 Reels + 15 TikTok)

• Максимальний ріст — $1050/міс
  └ 60 роликів (30 Reels + 30 TikTok)

Залиште заявку нижче — підберемо тариф під ваш профіль.

👉 Більше прикладів — у нас в Instagram: @ovcharuk_agency`;

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
