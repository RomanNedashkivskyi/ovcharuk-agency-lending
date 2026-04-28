const phoneInput = document.getElementById('phone-input');

phoneInput.addEventListener('focus', function() {
    if (this.value === '') {
        this.value = '+380';
    }
});

phoneInput.addEventListener('blur', function() {
    if (this.value === '+380') {
        this.value = '';
    }
});

phoneInput.addEventListener('input', function() {
    if (!this.value.startsWith('+380')) {
        this.value = '+380';
    }
});

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
        <span style="color:#8a2be2; font-weight:bold; font-size:18px">(!)</span>
        <span style="color:#fff; font-size:14px; font-weight:bold">Дані успішно передані!</span>
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

    let currentIndex = 0;

    function updateSlider() {
        const cardWidth = cards[0].offsetWidth + 30; 
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