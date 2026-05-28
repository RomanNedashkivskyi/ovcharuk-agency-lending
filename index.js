(function () {
    const header = document.querySelector(".main-header");
    if (!header) return;
    const setScrolled = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", setScrolled, { passive: true });
    setScrolled();
})();

/* === Back to top button === */
(function () {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    const toggle = () => {
        btn.classList.toggle('is-visible', window.scrollY > 600);
    };
    window.addEventListener('scroll', toggle, { passive: true });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    toggle();
})();

/* === Mobile navigation (hamburger dropdown) === */
(function () {
    const header = document.querySelector('.main-header');
    const toggle = header && header.querySelector('.mobile-toggle');
    const nav = header && header.querySelector('.nav-menu');
    if (!header || !toggle || !nav) return;

    function closeNav() { header.classList.remove('nav-open'); }

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        header.classList.toggle('nav-open');
    });

    // Close when a link is tapped
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Close when tapping outside the header
    document.addEventListener('click', (e) => {
        if (header.classList.contains('nav-open') && !header.contains(e.target)) {
            closeNav();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeNav();
    });
})();

/* === Theme toggle (light / dark) === */
(function () {
    const STORAGE_KEY = 'oa-theme';
    const root = document.documentElement;
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        btn.title = theme === 'light'
            ? 'Перемкнути на темну тему'
            : 'Перемкнути на світлу тему';
    }

    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* noop */ }
    applyTheme(saved === 'light' || saved === 'dark' ? saved : (root.getAttribute('data-theme') || 'dark'));

    btn.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.classList.add('theme-switching');
        applyTheme(next);
        try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* noop */ }
        window.clearTimeout(btn._themeT);
        btn._themeT = window.setTimeout(() => {
            root.classList.remove('theme-switching');
        }, 500);
    });
})();

const phoneInput = document.getElementById('phone-input');
if (phoneInput) {
    phoneInput.addEventListener('focus', function () {
        if (this.value === '') {
            this.value = '+380';
        }
    });

    phoneInput.addEventListener('blur', function () {
        if (this.value === '+380') {
            this.value = '';
        }
    });

    phoneInput.addEventListener('input', function () {
        if (!this.value.startsWith('+380')) {
            this.value = '+380';
        }
    });
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.card').forEach(card => observer.observe(card));

function showOrderNotification() {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <span class="toast-mark">(!)</span>
        <span class="toast-msg">Дані успішно передані!</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = '0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.reviews-track');
    const cards = document.querySelectorAll('.review-card');
    const nextBtn = document.querySelector('.next-arrow');
    const prevBtn = document.querySelector('.prev-arrow');
    if (!track || !cards.length || !nextBtn || !prevBtn) return;

    let currentIndex = 0;

    function updateSlider() {
        const gap = parseFloat(getComputedStyle(track).gap) || 30;
        const cardWidth = cards[0].offsetWidth + gap;
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - 3) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = cards.length - 3;
        }
        updateSlider();
    });

    window.addEventListener('resize', updateSlider);

    // Mobile Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe Left -> Next
            nextBtn.click();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe Right -> Prev
            prevBtn.click();
        }
    }
});

const workflowSteps = document.querySelectorAll('.workflow-step');
const workflowObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0) scale(1)";
            }, index * 200);
        }
    });
}, { threshold: 0.1 });

workflowSteps.forEach(step => {
    step.style.opacity = "0";
    step.style.transform = "translateY(20px) scale(0.9)";
    step.style.transition = "all 0.6s ease-out";
    workflowObserver.observe(step);
});

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const currentItem = button.parentElement;
        const isOpen = currentItem.classList.contains('active');

        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        if (!isOpen) {
            currentItem.classList.add('active');
        }
    });
});

/* ── Bento stats counter animation ── */
(function () {
    function animateCount(el) {
        if (el.classList.contains('counted')) return;
        el.classList.add('counted');

        const target = parseInt(el.dataset.target, 10);
        const duration = 1200; // Slightly longer for better feel
        const startTime = performance.now();

        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(tick);
    }

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.bento-count');
                counters.forEach(animateCount);
            }
        });
    }, { threshold: 0.2 });

    // Observe all cards and results sections that might have counters
    document.querySelectorAll('.bento-card, .case-results, .pricing-card').forEach(el => {
        if (el.querySelector('.bento-count')) {
            countObserver.observe(el);
        }
    });
})();

/* === TELEGRAM SETTINGS === */
// Токен та Chat ID перенесені на бекенд для безпеки, щоб їх неможливо було вкрасти з браузера!
async function sendToTelegram(message) {
    const url = `http://127.0.0.1:5050/api/send-lead`;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    if (!response.ok) {
        throw new Error("Не вдалося відправити лід через сервер.");
    }
    return response.json();
}

/* === FORM HANDLER === */
document.querySelector(".order-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const inputs = document.querySelectorAll(".order-form input");
    const service = document.querySelector(".order-form select").value;

    const fullName = inputs[0].value.trim();
    const phone = inputs[1].value.trim();
    const instagram = inputs[2].value.trim();

    const msg =
        `📩 <b>Нова заявка з сайту</b>\n\n` +
        `👤 Ім'я: ${fullName}\n` +
        `📞 Телефон: ${phone}\n` +
        `📸 Instagram: ${instagram}\n` +
        `🛠 Послуга: ${service}\n\n` +
        `🌐 Джерело: сайт агенції`;

    try {
        await sendToTelegram(msg);
        showOrderNotification();
    } catch (err) {
        console.error("Помилка Telegram:", err);
        alert("Помилка відправки. Спробуйте пізніше.");
    }
});

/* ========================================================
   === ШІ ЧАТ-БОТ (ПІДКЛЮЧЕННЯ ДО БЕКЕНДУ) ===
   ======================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const chatToggleBtn = document.getElementById("chat-toggle-btn");
    const openChatServiceBtn = document.getElementById("open-ai-chat-service");
    const closeChatBtn = document.getElementById("close-chat");
    const chatWindow = document.getElementById("ai-chat-window");
    const chatOverlay = document.getElementById("chat-overlay");
    const chatMessages = document.getElementById("chat-messages");
    const chatUserInput = document.getElementById("chat-user-input");
    const sendChatBtn = document.getElementById("send-chat-btn");

    if (!chatWindow || !chatMessages || !chatUserInput) return;

    let chatHistory = []; // Історія для Gemini API (формат: { role, parts: [{ text }] })

    // Відкрити чат
    function openChat(e) {
        if (e) e.preventDefault();
        chatWindow.classList.remove("hidden");
        chatOverlay.classList.remove("hidden");
        chatUserInput.focus();
        scrollToBottom();
    }

    // Закрити чат
    function closeChat() {
        chatWindow.classList.add("hidden");
        chatOverlay.classList.add("hidden");
    }

    if (chatToggleBtn) chatToggleBtn.addEventListener("click", openChat);
    if (openChatServiceBtn) openChatServiceBtn.addEventListener("click", openChat);
    if (closeChatBtn) closeChatBtn.addEventListener("click", closeChat);
    if (chatOverlay) chatOverlay.addEventListener("click", closeChat);

    // Прокрутка до кінця
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Створення HTML повідомлення
    function appendMessage(sender, text, isUser = false) {
        const msgGroup = document.createElement("div");
        msgGroup.className = `msg-group ${isUser ? "user-group" : "bot-group"}`;

        const senderLabel = document.createElement("span");
        senderLabel.className = "msg-sender";
        senderLabel.textContent = sender;

        const msgDiv = document.createElement("div");
        msgDiv.className = `msg ${isUser ? "user-msg" : "bot-msg"}`;
        msgDiv.textContent = text;

        msgGroup.appendChild(senderLabel);
        msgGroup.appendChild(msgDiv);
        chatMessages.appendChild(msgGroup);

        scrollToBottom();
    }

    // Додавання індикатора набору тексту
    function showTypingIndicator() {
        const typingGroup = document.createElement("div");
        typingGroup.className = "msg-group bot-group typing-indicator-group";
        typingGroup.id = "chat-typing-indicator";

        const senderLabel = document.createElement("span");
        senderLabel.className = "msg-sender";
        senderLabel.textContent = "ШІ Асистент";

        const msgDiv = document.createElement("div");
        msgDiv.className = "msg bot-msg typing-msg";
        msgDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;

        typingGroup.appendChild(senderLabel);
        typingGroup.appendChild(msgDiv);
        chatMessages.appendChild(typingGroup);
        scrollToBottom();
    }

    // Видалення індикатора набору тексту
    function removeTypingIndicator() {
        const indicator = document.getElementById("chat-typing-indicator");
        if (indicator) {
            indicator.remove();
        }
    }

    // Відправка повідомлення
    async function handleSendMessage() {
        const messageText = chatUserInput.value.trim();
        if (!messageText) return;

        // 1. Додаємо повідомлення користувача на екран
        appendMessage("Ви", messageText, true);
        chatUserInput.value = "";

        // 2. Показуємо анімацію "ШІ пише..."
        showTypingIndicator();

        try {
            // 3. Відправляємо запит на бекенд
            const response = await fetch("http://127.0.0.1:5050/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: messageText,
                    history: chatHistory
                })
            });

            const data = await response.json();
            removeTypingIndicator();

            if (response.ok && data.reply) {
                // 4. Додаємо відповідь ШІ на екран
                appendMessage("ШІ Асистент", data.reply, false);

                // 5. Оновлюємо історію діалогу для наступних запитів
                chatHistory.push({ role: "user", parts: [{ text: messageText }] });
                chatHistory.push({ role: "model", parts: [{ text: data.reply }] });
            } else {
                // Граціозний вивід помилки від API
                appendMessage(
                    "ШІ Асистент",
                    "Вибачте, виникла помилка при обробці запиту ШІ. Спробуйте пізніше або перевірте налаштування API. ⚙️",
                    false
                );
            }
        } catch (error) {
            console.error("Помилка зв'язку з сервером чату:", error);
            removeTypingIndicator();
            appendMessage(
                "ШІ Асистент",
                "Не вдалося з'єднатися з сервером ШІ. Переконайтеся, що бекенд запущено на порту 5050. 🔌",
                false
            );
        }
    }

    // Слухачі подій для відправки
    if (sendChatBtn) {
        sendChatBtn.addEventListener("click", handleSendMessage);
    }

    if (chatUserInput) {
        chatUserInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                handleSendMessage();
            }
        });
    }

    // Quick-reply chips — prefill and send
    const quickReplies = document.getElementById("chat-quick-replies");
    if (quickReplies) {
        quickReplies.querySelectorAll(".chat-quick-chip").forEach((chip) => {
            chip.addEventListener("click", () => {
                chatUserInput.value = chip.dataset.msg || chip.textContent.trim();
                handleSendMessage();
                quickReplies.classList.add("is-hidden");
            });
        });
    }
});