(function () {
    const header = document.querySelector(".main-header");
    if (!header) return;
    const setScrolled = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", setScrolled, { passive: true });
    setScrolled();
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

    // Observe all bento cards that might have counters
    document.querySelectorAll('.bento-card').forEach(card => {
        if (card.querySelector('.bento-count')) {
            countObserver.observe(card);
        }
    });
})();