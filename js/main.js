/* ============================================
   SignalRadar - Main JavaScript
   ============================================ */

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// Navbar shadow on scroll
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.scrollY > 10
            ? '0 2px 12px rgba(0,0,0,0.08)'
            : 'none';
    });
}

// ============================================
// Forecast Comparison Chart
// Matches the original site's chart style:
// - 3 lines: blue (Your), green (Market Signal), purple (News)
// - "NOW" dashed vertical line
// - Legend at top with colored line indicators
// - Time axis unlabeled, values on Y
// ============================================
const chartCanvas = document.getElementById('forecastChart');
if (chartCanvas && typeof Chart !== 'undefined') {
    // Data points: history (left of NOW) + forecast (right of NOW)
    // NOW is at index 5 (~35% from left, matching original chart)
    const labels = ['', '', '', '', '', 'NOW', '', '', '', '', '', '', '', '', ''];
    const nowIndex = 5;

    // Your Internal Forecast - zigzag variation, trending slightly up (blue)
    const internalForecast = [
        2340, 2355, 2330, 2360, 2345, 2350,
        2370, 2340, 2380, 2355, 2395, 2370, 2400, 2385, 2393.84
    ];

    // Market Signal Enhanced Forecast - smoother, slightly lower, trending up (green/teal dashed)
    const marketForecast = [
        2340, 2345, 2335, 2350, 2340, 2345,
        2340, 2335, 2345, 2340, 2350, 2345, 2355, 2350, 2360
    ];

    // News Enhanced Forecast - smooth, between the other two, trending up (purple)
    const newsForecast = [
        2340, 2350, 2332, 2355, 2342, 2348,
        2355, 2350, 2365, 2360, 2375, 2370, 2380, 2378, 2385
    ];

    // Register annotation plugin if available
    const annotationPlugin = window['chartjs-plugin-annotation'] || (Chart.registry && Chart.registry.getPlugin('annotation'));

    // Set chart canvas background to match the gray container
    const chartBgPlugin = {
        id: 'chartBg',
        beforeDraw: (chart) => {
            const { ctx: c, chartArea } = chart;
            c.save();
            c.fillStyle = 'rgb(247, 247, 249)';
            c.fillRect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
            c.restore();
        }
    };

    const ctx = chartCanvas.getContext('2d');
    new Chart(ctx, {
        plugins: [chartBgPlugin],
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Your Forecast',
                    data: internalForecast,
                    borderColor: '#60A5FA',
                    backgroundColor: 'transparent',
                    borderWidth: 2.5,
                    fill: false,
                    tension: 0.2,
                    pointRadius: 3,
                    pointBackgroundColor: '#60A5FA',
                    pointBorderColor: '#60A5FA',
                    pointHoverRadius: 5,
                },
                {
                    label: 'Market Signal Forecast',
                    data: marketForecast,
                    borderColor: '#34D399',
                    backgroundColor: 'transparent',
                    borderWidth: 2.5,
                    fill: false,
                    tension: 0.2,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    borderDash: [6, 3],
                },
                {
                    label: 'News Forecast',
                    data: newsForecast,
                    borderColor: '#7C3AED',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.2,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 3.5,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'start',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'line',
                        font: { size: 12, family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
                        }
                    }
                },
                annotation: {
                    annotations: {
                        nowLine: {
                            type: 'line',
                            xMin: nowIndex,
                            xMax: nowIndex,
                            borderColor: '#374151',
                            borderWidth: 2,
                            borderDash: [6, 4],
                            label: {
                                display: true,
                                content: 'NOW',
                                position: 'start',
                                backgroundColor: 'transparent',
                                color: '#374151',
                                font: { size: 12, weight: 'bold', family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
                                yAdjust: -10,
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        display: false,
                    },
                    border: { display: false }
                },
                y: {
                    grid: { color: '#F3F4F6' },
                    ticks: {
                        font: { size: 11, family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
                        color: '#9CA3AF',
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    },
                    border: { display: false }
                }
            }
        }
    });
}
