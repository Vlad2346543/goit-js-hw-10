// --- Посилання на елементи DOM ---
const form = document.querySelector('.form');

/**
 * Створює проміс, який виконується або відхиляється після заданої затримки.
 *
 * @param {number} delay - Затримка в мілісекундах.
 * @param {string} state - Стан промісу ('fulfilled' або 'rejected').
 * @returns {Promise<number>} Проміс, що повертає або відхиляє значення затримки.
 */
function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    // Встановлюємо таймер на задану затримку
    setTimeout(() => {
      if (state === 'fulfilled') {
        // Проміс успішно виконується (resolve)
        resolve(delay);
      } else {
        // Проміс відхиляється (reject)
        reject(delay);
      }
    }, delay);
  });
}

// --- Обробник події сабміту форми ---
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Запобігаємо стандартній відправці форми

  // Отримання значень з полів форми
  const delayInput = event.currentTarget.elements.delay.value;
  const stateInput = event.currentTarget.elements.state.value;

  // Конвертуємо затримку в число
  const delay = Number(delayInput);

  // Створюємо та обробляємо проміс
  createPromise(delay, stateInput)
    .then((delayValue) => {
      //  Проміс успішно виконано (Fulfilled)
      
      // Виведення у консоль
      console.log(` Fulfilled promise in ${delayValue}ms`);

      // Відображення iziToast
      iziToast.success({
        title: 'OK',
        message: `Fulfilled promise in ${delayValue}ms`,
        position: 'topRight',
        timeout: 3000 // Показувати 3 секунди
      });
    })
    .catch((delayValue) => {
      // Проміс відхилено (Rejected)

      // Виведення у консоль
      console.log(` Rejected promise in ${delayValue}ms`);

      // Відображення iziToast
      iziToast.error({
        title: 'Error',
        message: `Rejected promise in ${delayValue}ms`,
        position: 'topRight',
        timeout: 3000 // Показувати 3 секунди
      });
    });
    
});