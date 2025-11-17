/**
 * Глобальна змінна для зберігання обраної користувачем кінцевої дати.
 * @type {Date|null}
 */
let userSelectedDate = null;

// --- Посилання на елементи DOM ---
const datetimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const timerFields = {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
};

// Змінна для зберігання ID інтервалу таймера
let timerIntervalId = null;

// --- 1. Функції-утиліти ---

/**
 * Додає нуль попереду, якщо число менше 10.
 * @param {number} value
 * @returns {string} Відформатоване значення.
 */
function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

/**
 * Конвертує мілісекунди в об'єкт з днями, годинами, хвилинами та секундами.
 * @param {number} ms - Різниця в мілісекундах.
 * @returns {{days: number, hours: number, minutes: number, seconds: number}}
 */
function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

// --- 2. Об'єкт параметрів Flatpickr ---
const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];
        const currentTime = Date.now();

        if (selectedDate.getTime() < currentTime) {
            // Дата в минулому
            iziToast.error({
                title: 'Помилка',
                message: 'Please choose a date in the future',
                position: 'topRight'
            });
            startButton.disabled = true;
            userSelectedDate = null;
        } else {
            // Валідна дата в майбутньому
            startButton.disabled = false;
            userSelectedDate = selectedDate;
        }
    },
};

// Ініціалізація Flatpickr
flatpickr(datetimePicker, options);


// --- 3. Функції логіки таймера ---

/**
 * Оновлює інтерфейс таймера відповідно до об'єкта часу.
 * @param {{days: number, hours: number, minutes: number, seconds: number}} time
 */
function updateTimerDisplay({ days, hours, minutes, seconds }) {
    timerFields.days.textContent = addLeadingZero(days);
    timerFields.hours.textContent = addLeadingZero(hours);
    timerFields.minutes.textContent = addLeadingZero(minutes);
    timerFields.seconds.textContent = addLeadingZero(seconds);
}

/**
 * Зупиняє таймер і розблоковує поле вибору дати.
 */
function stopTimer() {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
    datetimePicker.disabled = false;
    startButton.disabled = true; // Кнопка залишається неактивною після зупинки
    
    // Повідомлення про завершення
    iziToast.success({
        title: 'Завершено!',
        message: 'Countdown has finished.',
        position: 'bottomRight'
    });
}

/**
 * Запускає зворотний відлік.
 */
function startCountdown() {
    if (!userSelectedDate || timerIntervalId) return;

    // Блокування інтерфейсу
    startButton.disabled = true;
    datetimePicker.disabled = true;

    // Встановлення інтервалу
    timerIntervalId = setInterval(() => {
        const msRemaining = userSelectedDate.getTime() - Date.now();

        if (msRemaining <= 0) {
            // Час вичерпано
            stopTimer();
            // Встановлюємо нулі, якщо таймер зупинився
            updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
        }

        // Обчислення та оновлення інтерфейсу
        const time = convertMs(msRemaining);
        updateTimerDisplay(time);

    }, 1000);
}

// --- 4. Обробник події кліку на кнопку Start ---
startButton.addEventListener('click', startCountdown);