document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const resultDiv = document.getElementById('result');

    function showLoader() {
        loader.style.display = 'block';
        resultDiv.textContent = '';
    }

    function hideLoader() {
        loader.style.display = 'none';
    }

    function checkNumber(num) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (num > 10) {
                    resolve("Число більше 10");
                } else {
                    reject("Число менше або дорівнює 10");
                }
            }, 1000);
        });
    }

    document.getElementById('btn-task2-success').addEventListener('click', () => {
        showLoader();

        checkNumber(15)
            .then((message) => {
                resultDiv.innerHTML = `<span class="success-text">Успішно: ${message} (num = 15)</span>`;
                console.log("Успішно:", message);
            })
            .catch((error) => {
                resultDiv.innerHTML = `<span class="error-text">Помилка: ${error}</span>`;
                console.log("Помилка:", error);
            })
            .finally(() => {
                hideLoader();
            });
    });

    document.getElementById('btn-task2-fail').addEventListener('click', () => {
        showLoader();

        checkNumber(5)
            .then((message) => {
                resultDiv.innerHTML = `<span class="success-text">Успішно: ${message}</span>`;
                console.log("Успішно:", message);
            })
            .catch((error) => {
                resultDiv.innerHTML = `<span class="error-text">Помилка: ${error} (num = 5)</span>`;
                console.log("Помилка:", error);
            })
            .finally(() => {
                hideLoader();
            });
    });

    function randomNumber() {
        return new Promise((resolve) => {
            const randomDelay = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;

            const randomValue = Math.floor(Math.random() * 100) + 1;

            setTimeout(() => {
                resolve({
                    number: randomValue,
                    delayInSeconds: (randomDelay / 1000).toFixed(2)
                });
            }, randomDelay);
        });
    }

    document.getElementById('btn-task3').addEventListener('click', () => {
        showLoader();

        randomNumber()
            .then((data) => {
                resultDiv.innerHTML = `<span class="success-text">Отримано число: ${data.number} | Час роботи: ${data.delayInSeconds} сек.</span>`;
                console.log(`Число: ${data.number}, Час: ${data.delayInSeconds} с`);
            })
            .catch((error) => {
                resultDiv.innerHTML = `<span class="error-text">Помилка: ${error}</span>`;
                console.log("Помилка:", error);
            })
            .finally(() => {
                hideLoader();
            });
    });
});