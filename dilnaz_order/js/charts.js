// Charts - Data visualization using Chart.js
document.addEventListener('DOMContentLoaded', async function () {
    let salesData = [];
    let productsMap = {};

    // Load sales data
    try {
        const response = await fetch('assets/data/sales-data.json');
        const data = await response.json();

        salesData = data.salesData;
        productsMap = data.products.reduce((acc, product) => {
            acc[product.id] = product;
            return acc;
        }, {});

        createTrendChart();
        createAccuracyChart();

    } catch (error) {
        console.error('Error loading chart data:', error);
    }

    // Trend Chart - Comparing seasonal patterns
    function createTrendChart() {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Get 2024 data for each product
        const datasets = [];
        const colors = [
            { border: '#2563eb', bg: 'rgba(37, 99, 235, 0.1)' },
            { border: '#0891b2', bg: 'rgba(8, 145, 178, 0.1)' },
            { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' }
        ];

        let colorIndex = 0;
        salesData.forEach(item => {
            if (item.year === 2024) {
                const actualData = item.data.map(d => d.actual);
                const forecastData = item.data.map(d => d.forecast);
                const productInfo = productsMap[item.product];
                const color = colors[colorIndex % colors.length];

                datasets.push({
                    label: `${productInfo.name} - Actual`,
                    data: actualData,
                    borderColor: color.border,
                    backgroundColor: color.bg,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                });

                datasets.push({
                    label: `${productInfo.name} - Forecast`,
                    data: forecastData,
                    borderColor: color.border,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: false
                });

                colorIndex++;
            }
        });

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                family: 'Inter'
                            }
                        }
                    },
                    title: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            family: 'Inter',
                            size: 14
                        },
                        bodyFont: {
                            family: 'Inter',
                            size: 13
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return value.toLocaleString();
                            },
                            font: {
                                family: 'Inter'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter'
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    // Accuracy Chart - Forecast accuracy by product
    function createAccuracyChart() {
        const ctx = document.getElementById('accuracyChart');
        if (!ctx) return;

        // Calculate accuracy for each product
        const accuracyData = [];
        const productNames = [];

        // Group by product
        const productGroups = {};
        salesData.forEach(item => {
            if (!productGroups[item.product]) {
                productGroups[item.product] = [];
            }
            productGroups[item.product].push(...item.data);
        });

        // Calculate accuracy
        Object.keys(productGroups).forEach(productId => {
            const productData = productGroups[productId];
            let totalError = 0;

            productData.forEach(monthData => {
                const error = Math.abs((monthData.actual - monthData.forecast) / monthData.forecast);
                totalError += error;
            });

            const accuracy = (1 - (totalError / productData.length)) * 100;
            accuracyData.push(accuracy);
            productNames.push(productsMap[productId].name);
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: productNames,
                datasets: [{
                    label: 'Forecast Accuracy (%)',
                    data: accuracyData,
                    backgroundColor: [
                        'rgba(37, 99, 235, 0.7)',
                        'rgba(8, 145, 178, 0.7)',
                        'rgba(245, 158, 11, 0.7)'
                    ],
                    borderColor: [
                        '#2563eb',
                        '#0891b2',
                        '#f59e0b'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            family: 'Inter',
                            size: 14
                        },
                        bodyFont: {
                            family: 'Inter',
                            size: 13
                        },
                        callbacks: {
                            label: function (context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            },
                            font: {
                                family: 'Inter'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter'
                            }
                        }
                    }
                }
            }
        });
    }
});
