// Forecast Table - Dynamic table with filtering and sorting
document.addEventListener('DOMContentLoaded', async function () {
    let salesData = [];
    let productsMap = {};
    let filteredData = [];
    let currentSort = { column: null, ascending: true };

    // Load sales data
    try {
        const response = await fetch('assets/data/sales-data.json');
        const data = await response.json();

        salesData = data.salesData;
        productsMap = data.products.reduce((acc, product) => {
            acc[product.id] = product;
            return acc;
        }, {});

        // Initialize table
        filteredData = prepareTableData();
        renderTable(filteredData);

    } catch (error) {
        console.error('Error loading sales data:', error);
        document.getElementById('tableBody').innerHTML = '<tr><td colspan="7">Деректерді жүктеу қатесі</td></tr>';
    }

    // Prepare data for table
    function prepareTableData() {
        const tableData = [];

        salesData.forEach(item => {
            const productInfo = productsMap[item.product];
            item.data.forEach(monthData => {
                const variance = monthData.actual - monthData.forecast;
                const variancePercent = ((variance / monthData.forecast) * 100).toFixed(1);

                tableData.push({
                    product: productInfo.name,
                    productId: item.product,
                    year: item.year,
                    month: monthData.month,
                    actual: monthData.actual,
                    forecast: monthData.forecast,
                    variance: variance,
                    variancePercent: variancePercent,
                    seasonality: monthData.seasonalityIndex
                });
            });
        });

        return tableData;
    }

    // Render table
    function renderTable(data) {
        const tbody = document.getElementById('tableBody');

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Сүзгілерге сәйкес деректер жоқ</td></tr>';
            return;
        }

        tbody.innerHTML = data.map(row => `
            <tr>
                <td>${row.product}</td>
                <td>${row.year}</td>
                <td>${row.month}</td>
                <td>${row.actual.toLocaleString()}</td>
                <td>${row.forecast.toLocaleString()}</td>
                <td class="${row.variance >= 0 ? 'variance-positive' : 'variance-negative'}">
                    ${row.variance >= 0 ? '+' : ''}${row.variance.toLocaleString()} (${row.variancePercent >= 0 ? '+' : ''}${row.variancePercent}%)
                </td>
                <td>${row.seasonality.toFixed(2)}</td>
            </tr>
        `).join('');
    }

    // Filtering
    const productFilter = document.getElementById('productFilter');
    const yearFilter = document.getElementById('yearFilter');
    const resetFiltersBtn = document.getElementById('resetFilters');

    function applyFilters() {
        const productValue = productFilter.value;
        const yearValue = yearFilter.value;

        filteredData = prepareTableData().filter(row => {
            const productMatch = productValue === 'all' || row.productId === productValue;
            const yearMatch = yearValue === 'all' || row.year.toString() === yearValue;
            return productMatch && yearMatch;
        });

        // Reapply current sort if any
        if (currentSort.column) {
            sortData(currentSort.column, currentSort.ascending);
        } else {
            renderTable(filteredData);
        }
    }

    productFilter.addEventListener('change', applyFilters);
    yearFilter.addEventListener('change', applyFilters);

    resetFiltersBtn.addEventListener('click', function () {
        productFilter.value = 'all';
        yearFilter.value = 'all';
        currentSort = { column: null, ascending: true };
        applyFilters();

        // Reset sort icons
        document.querySelectorAll('.sort-icon').forEach(icon => {
            icon.textContent = '↕';
        });
    });

    // Sorting
    const tableHeaders = document.querySelectorAll('th[data-sort]');

    tableHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const sortColumn = this.getAttribute('data-sort');
            const ascending = currentSort.column === sortColumn ? !currentSort.ascending : true;

            sortData(sortColumn, ascending);
            currentSort = { column: sortColumn, ascending };

            // Update sort icons
            tableHeaders.forEach(h => {
                const icon = h.querySelector('.sort-icon');
                if (h === this) {
                    icon.textContent = ascending ? '↑' : '↓';
                } else {
                    icon.textContent = '↕';
                }
            });
        });
    });

    function sortData(column, ascending) {
        const sortedData = [...filteredData].sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];

            // Handle numeric columns
            if (typeof aVal === 'number') {
                return ascending ? aVal - bVal : bVal - aVal;
            }

            // Handle string columns
            if (typeof aVal === 'string') {
                // For months, use custom order
                if (column === 'month') {
                    const monthOrder = ['Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым',
                        'Шілде', 'Тамыз', 'Қыркүйек', 'Қазан', 'Қараша', 'Желтоқсан'];
                    aVal = monthOrder.indexOf(aVal);
                    bVal = monthOrder.indexOf(bVal);
                    return ascending ? aVal - bVal : bVal - aVal;
                }

                return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }

            return 0;
        });

        renderTable(sortedData);
    }
});
