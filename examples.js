// examples.js — простые демонстрации промисов и async/await

// 1) Конвертация callback -> Promise
function loadScript(src, callback) {
  let script = document.createElement("script");
  script.src = src;
  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`Не удалось загрузить скрипт ${src}`));
  document.head.append(script);
}

/*
// Использование
loadScript(
  "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js",
  function (error, script) {
    if (error) {
      alert(error);
    } else {
      alert(`Здорово, скрипт ${script.src} загрузился`);
      alert(_);
    } // функция, объявленная в загруженном скрипте
  },
);
*/

/*
// Как нам загрузить два скрипта один за другим: сначала первый, а за ним второй?
loadScript(
  "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js",
  function (error, script) {
    if (error) {
      alert(error);
    } else {
      alert(`Здорово, скрипт ${script.src} загрузился`);
      alert(_); // функция, объявленная в загруженном скрипте
    }
    // вызвать loadScript ещё раз уже внутри колбэка, вот так:
    loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js",
      function (error, script) {
        if (error) {
          alert(error);
        } else {
          alert(`Здорово, скрипт ${script.src} загрузился`);
          alert(_); // функция, объявленная в загруженном скрипте
        }
      },
    );
  },
); // Это называется "callback hell" или Адская пирамида вызовов
*/

// Превращаем loadScript в версию на промисах
function loadScriptPromise(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Не удалось загрузить скрипт ${src}`));
    document.head.append(script);
  });
}

/*
// Использование
loadScriptPromise('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js')
  .then(script => {
    console.log('Скрипт загружен', script.src);
  })
  .catch(err => {
    console.error('Ошибка загрузки', err);
  });
*/

/*
// Последовательная загрузка скриптов (пропадает "callback hell")
loadScriptPromise("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js")
  .then(script => {
    alert(`Здорово, скрипт ${script.src} загрузился`);
    alert(_); // функция, объявленная в загруженном скрипте
    return loadScriptPromise("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2./lodash.js");
  })
  .then(script => {
    alert(`Здорово, скрипт ${script.src} загрузился`);
    alert(_); // функция, объявленная в загруженном скрипте
  })
  .catch(error => alert(error));
*/

// 2) Промис на setTimeout — имитация асинхронной операции
function delayedValue(ms, value) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

/*
// Параллельное ожидание с Promise.all
Promise.all([delayedValue(500, 'A'), delayedValue(300, 'B')])
  .then(results => {
    console.log('Результаты параллельно:', results); // ['A', 'B']
  });
*/

// 3) async/await — последовательный и параллельный подход
async function sequential() {
  const a = await delayedValue(1000, 'first');
  const b = await delayedValue(1000, 'second');
  console.log('Последовательно:', a, b);
}

async function parallel() {
  // Запускаем промисы одновременно, ждём оба результата
  const [a, b] = await Promise.all([delayedValue(1000, 'first'), delayedValue(1000, 'second')]);
  console.log('Параллельно:', a, b);
}

/*
// Использование
sequential();
parallel();
*/

// 4) Обработка ошибок в async/await
async function mayFail() {
  try {
    const val = await new Promise((resolve, reject) => setTimeout(() => reject(new Error('Провал')), 200));
    console.log(val);
  } catch (err) {
    console.error('Поймали ошибку:', err.message);
  }
}

/*
// Использование
mayFail();
*/