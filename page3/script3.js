document.addEventListener('DOMContentLoaded', function() {
    const currentRateSpan = document.getElementById('current-rate');
    const amountInput = document.getElementById('amount');
    const currencySelect = document.getElementById('currency');
    const convertButton = document.getElementById('convert');
    const resultSpan = document.getElementById('result');
    const chartCanvas = document.getElementById('chart').getContext('2d');
    const selectedDateRate = document.getElementById('selected-date-rate');
    let chart; 
    async function getCurrentRate() {
        try {
            const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
            const data = await response.json();
            const egpRate = data.Valute.EGP.Value;
            const rubRate = 1;

            currentRateSpan.textContent = `1 EGP = ${egpRate.toFixed(4)} RUB`;
        } catch (error) {
            console.error('Ошибка при получении курса:', error);
            currentRateSpan.textContent = 'Не удалось загрузить курс.';
        }
    }
    getCurrentRate();

    convertButton.addEventListener('click', function() {
        const amount = parseFloat(amountInput.value);
        const currency = currencySelect.value;

        if (isNaN(amount)) {
            resultSpan.textContent = 'Введите корректную сумму.';
            return;
        }

        async function convertCurrency(amount, currency) {
            try {
                const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
                const data = await response.json();
                const egpRate = data.Valute.EGP.Value;
                if (currency === 'EGP') {
                    const result = amount / egpRate;
                     resultSpan.textContent = `${amount} RUB = ${result.toFixed(2)} EGP`;
                } else if (currency === 'RUB') {
                    const result = amount * egpRate;
                    resultSpan.textContent = `${amount} EGP = ${result.toFixed(2)} RUB`;
                }
            } catch (error) {
                console.error('Ошибка при получении курса:', error);
                resultSpan.textContent = 'Не удалось конвертировать валюту.';
            }
        }

        convertCurrency(amount, currency);
    });

        async function getHistoricalData() {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);

        const endDateStr = endDate.toISOString().slice(0, 10);
        const startDateStr = startDate.toISOString().slice(0, 10);

        const dummyHistoricalData = {
            "19.04.2025": 1.20,
            "25.04.2025": 1.63,
            "26.04.2025": 1.62,
            "04.05.2025": 1.61,
            "10.05.2025": 1.6,
            "13.05.2025": 1.6,
            "16.05.2025": 1.6
        };

        const dates = Object.keys(dummyHistoricalData);
        const rates = Object.values(dummyHistoricalData);

        createChart(dates, rates);  
    }
     function destroyExistingChart() {
            if (chart) {
                chart.destroy();
            }
        }
    function createChart(labels, data) {
         destroyExistingChart();
        chart = new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Курс EGP к RUB',
                    data: data,
                    backgroundColor: '#74121d',
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        const date = labels[index];
                        const rate = data[index];
                        selectedDateRate.textContent = `Дата: ${date}, Курс: ${rate.toFixed(4)}`;
                    } else {
                        selectedDateRate.textContent = 'Щелкните по столбцу для просмотра даты и курса.';
                    }
                }
            }
        });
    }

    getHistoricalData();
});



