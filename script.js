const ctx = document.getElementById('lineChart').getContext('2d');

function processData(data) {
    const yearGradeCount = {};

    data.forEach(row => {
        const year = row.year;
        const grade = row.grade;
        const id = row["International number ID"];

        if (!yearGradeCount[year]) {
            yearGradeCount[year] = {};
        }
        if (!yearGradeCount[year][grade]) {
            yearGradeCount[year][grade] = new Set();
        }

        yearGradeCount[year][grade].add(id);
    });

    return yearGradeCount;
}

function prepareChartData(data) {
    const yearGradeCount = processData(data);
    const labels = Object.keys(yearGradeCount).sort();
    const grades = [...new Set(data.map(row => row.grade))];

    const datasets = grades.map(grade => {
        const data = labels.map(year => yearGradeCount[year][grade] ? yearGradeCount[year][grade].size : 0);
        return {
            label: grade,
            data: data,
            borderColor: getRandomColor(),
            fill: false
        };
    });

    return { labels, datasets };
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function drawChart(chartData) {
    new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Typhoons'
                    }
                }
            }
        }
    });
}

Papa.parse('typhoon_data.csv', {
    download: true,
    header: true,
    complete: function (results) {
        const data = results.data;
        const chartData = prepareChartData(data);
        drawChart(chartData);
    }
});
