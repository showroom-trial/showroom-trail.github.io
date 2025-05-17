// DOM Elements
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const toggleSidebarIcon = document.querySelector('.toggle-sidebar-icon');
const toggleSidebarText = document.querySelector('.toggle-sidebar-text');
const mainContent = document.getElementById('mainContent');
const mobileNavToggle = document.getElementById('mobileNavToggle');
const navLinks = document.querySelectorAll('.nav-link');
const locationSelect = document.getElementById('locationSelect');
const sections = document.querySelectorAll('.dashboard-section');

// Charts storage
let charts = {};

// Toggle sidebar collapse state
function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    
    if (sidebar.classList.contains('collapsed')) {
        toggleSidebarIcon.textContent = '▶';
        toggleSidebarText.textContent = 'Expand';
    } else {
        toggleSidebarIcon.textContent = '◀';
        toggleSidebarText.textContent = 'Collapse';
    }
}

// Toggle mobile navigation
function toggleMobileNav() {
    sidebar.classList.toggle('mobile-active');
}

// Handle section navigation
function navigateToSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active-section');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active-section');
        
        // Scroll to top of page
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Close mobile nav if open
    if (sidebar.classList.contains('mobile-active')) {
        sidebar.classList.remove('mobile-active');
    }
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

// Handle location change
function handleLocationChange() {
    // Get selected location value
    const selectedLocation = locationSelect.value;
    console.log(`Location changed to: ${selectedLocation}`);
    
    // Reset to dashboard overview
    navigateToSection('dashboard');
    
    // Update charts with new location data
    updateChartsForLocation(selectedLocation);
}

// Create and update charts
function initializeCharts() {
    // Load Chart.js from CDN if not already loaded
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = createCharts;
        document.head.appendChild(script);
    } else {
        createCharts();
    }
}

function createCharts() {
    // Define a colorful palette
    const colorPalette = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#F15BB5'
    ];
    
    // Vehicle sold by model chart
    const vehicleCtx = document.getElementById('vehiclesSoldChart');
    if (vehicleCtx) {
        charts.vehiclesSold = new Chart(vehicleCtx, {
            type: 'bar',
            data: {
                labels: ['Seltos', 'Sonet', 'Carens', 'EV6', 'Carnival'],
                datasets: [{
                    label: 'Units Sold',
                    data: [45, 36, 28, 8, 7],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(255, 99, 132, 0.7)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Enquiries vs Conversions chart
    const enquiriesCtx = document.getElementById('enquiriesConversionsChart');
    if (enquiriesCtx) {
        charts.enquiriesConversions = new Chart(enquiriesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Enquiries',
                        data: [150, 165, 170, 162, 175, 182],
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Conversions',
                        data: [90, 110, 115, 108, 118, 124],
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Revenue chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        charts.revenue = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
                datasets: [{
                    label: 'Revenue (in ₹ Millions)',
                    data: [4.2, 4.5, 4.8, 4.6, 4.9, 5.2],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    // Location-based targets chart
    const locationTargetsCtx = document.getElementById('locationTargetsChart');
    if (locationTargetsCtx) {
        charts.locationTargets = new Chart(locationTargetsCtx, {
            type: 'bar',
            data: {
                labels: ['Shivamogga', 'Chitradurga', 'Chikmangaluru', 'Davanagere'],
                datasets: [
                    {
                        label: 'Target',
                        data: [25, 20, 18, 22],
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Achieved',
                        data: [22, 18, 15, 20],
                        backgroundColor: 'rgba(255, 99, 132, 0.7)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Units'
                        }
                    }
                }
            }
        });
    }

    // Enquiries vs Sales Conversion chart
    const enquiriesSalesCtx = document.getElementById('enquiriesSalesChart');
    if (enquiriesSalesCtx) {
        charts.enquiriesSales = new Chart(enquiriesSalesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Converted', 'In Process', 'Lost'],
                datasets: [{
                    data: [68, 22, 10],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 99, 132, 0.7)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Department-wise target achievement chart
    const departmentTargetsCtx = document.getElementById('departmentTargetsChart');
    if (departmentTargetsCtx) {
        charts.departmentTargets = new Chart(departmentTargetsCtx, {
            type: 'bar',
            data: {
                labels: ['Sales', 'Service', 'Accessories', 'Insurance', 'Extended Warranty'],
                datasets: [{
                    label: 'Target Achievement (%)',
                    data: [88, 96, 93, 85, 91],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                }
            }
        });
    }

    // Target progress chart
    const targetProgressCtx = document.getElementById('targetProgressChart');
    if (targetProgressCtx) {
        charts.targetProgress = new Chart(targetProgressCtx, {
            type: 'bar',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [
                    {
                        label: 'Target',
                        data: [225, 240, 250, 260],
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Projected',
                        data: [215, 235, 245, 255],
                        backgroundColor: 'rgba(255, 159, 64, 0.7)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Achieved',
                        data: [205, 0, 0, 0],
                        backgroundColor: 'rgba(75, 192, 192, 0.7)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Units'
                        }
                    }
                }
            }
        });
    }

    // Add-ons Revenue Chart
    const addonsCtx = document.getElementById('addonsChart');
    if (addonsCtx) {
        charts.addons = new Chart(addonsCtx, {
            type: 'pie',
            data: {
                labels: ['Protection Plans', 'Electronics', 'Interior Accessories', 'Exterior Accessories', 'Service Packages'],
                datasets: [{
                    data: [51.9, 21.6, 12.8, 9.3, 4.4],
                    backgroundColor: colorPalette,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Add-ons Revenue by Category (%)'
                    }
                }
            }
        });
    }

    // Sales by Vehicle Type Chart
    const vehicleTypeCtx = document.getElementById('vehicleTypeChart');
    if (vehicleTypeCtx) {
        charts.vehicleType = new Chart(vehicleTypeCtx, {
            type: 'bar',
            data: {
                labels: ['SUV', 'Crossover', 'Sedan', 'Electric', 'Hybrid'],
                datasets: [{
                    label: 'Units Sold',
                    data: [138, 92, 57, 46, 23],
                    backgroundColor: colorPalette.slice(0, 5),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Sales by Vehicle Type'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Service Types Distribution Chart
    const serviceTypeCtx = document.getElementById('serviceTypeChart');
    if (serviceTypeCtx) {
        charts.serviceType = new Chart(serviceTypeCtx, {
            type: 'doughnut',
            data: {
                labels: ['Regular Maintenance', 'Repairs', 'Warranty Work', 'Upgrades', 'Recalls'],
                datasets: [{
                    data: [42, 28, 16, 10, 4],
                    backgroundColor: colorPalette.slice(5, 10),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Service Types Distribution (%)'
                    }
                }
            }
        });
    }

    // Market Share Comparison Chart
    // Market Share Comparison Chart
    const marketShareCtx = document.getElementById('marketShareChart');
    if (marketShareCtx) {
        charts.marketShare = new Chart(marketShareCtx, {
            type: 'bar',
            data: {
                labels: ['KIA', 'Competitor A', 'Competitor B', 'Competitor C', 'Competitor D'],
                datasets: [{
                    label: 'Market Share (%)',
                    data: [8.2, 11.4, 9.8, 7.1, 9.2],
                    backgroundColor: colorPalette,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    title: {
                        display: true,
                        text: 'Market Share Comparison'
                    }
                }
            }
        });
    }

    // Customer Satisfaction Chart
    // Customer Satisfaction Chart - Changed to a bar chart for better comparison
const satisfactionCtx = document.getElementById('satisfactionChart');
if (satisfactionCtx) {
    charts.satisfaction = new Chart(satisfactionCtx, {
        type: 'bar',  // Changed from radar to bar
        data: {
            labels: ['Product Quality', 'Customer Service', 'Price Value', 'Brand Image', 'After-Sales'],
            datasets: [
                {
                    label: 'KIA',
                    data: [4.8, 4.7, 4.6, 4.5, 4.8],
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Competitors Avg',
                    data: [4.5, 4.4, 4.3, 4.6, 4.2],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 4.0,
                    max: 5.0,
                    ticks: {
                        stepSize: 0.2
                    },
                    title: {
                        display: true,
                        text: 'Rating (out of 5)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Satisfaction Categories'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Customer Satisfaction Comparison',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + '/5';
                        }
                    }
                }
            },
            barPercentage: 0.8,
            categoryPercentage: 0.7
        }
    });
}

    // Pricing Competitiveness Chart
    const pricingCtx = document.getElementById('pricingChart');
    if (pricingCtx) {
        charts.pricing = new Chart(pricingCtx, {
            type: 'bar',
            data: {
                labels: ['Compact', 'Mid-size', 'SUV', 'Electric', 'Luxury'],
                datasets: [
                    {
                        label: 'KIA',
                        data: [22800, 28500, 34200, 42000, 48500],
                        backgroundColor: 'rgba(255, 99, 132, 0.7)',
                        borderWidth: 1
                    },
                    {
                        label: 'Market Average',
                        data: [24300, 30100, 36400, 45000, 52000],
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Pricing Comparison by Category ($)'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Forecast Chart
    const forecastCtx = document.getElementById('forecastChart');
    if (forecastCtx) {
        charts.forecast = new Chart(forecastCtx, {
            type: 'line',
            data: {
                labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                datasets: [
                    {
                        label: 'Expected Sales',
                        data: [128, 142, 156, 168, 172, 180],
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Previous Year',
                        data: [118, 125, 140, 148, 152, 158],
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Sales Forecast (Next 6 Months)'
                    }
                }
            }
        });
    }

    // Update the heatmap to use actual colors instead of grayscale
    const heatmapCells = document.querySelectorAll('.heatmap-cell');
    if (heatmapCells.length > 0) {
        const heatColors = [
            '#FEF0D9', '#FDCC8A', '#FC8D59', '#E34A33', '#B30000', // Orange-red
            '#EDF8E9', '#BAE4B3', '#74C476', '#31A354', '#006D2C'  // Green
        ];
        
        heatmapCells.forEach((cell) => {
            // Remove the heat-X class
            cell.classList.remove('heat-1', 'heat-2', 'heat-3', 'heat-4', 'heat-5', 'heat-6', 'heat-7', 'heat-8');
            
            // Get the growth value
            const growthText = cell.querySelector('.heatmap-value').textContent;
            const growthValue = parseInt(growthText);
            
            // Determine color based on growth percentage
            let colorIndex = Math.min(Math.floor(growthValue / 5), heatColors.length - 1);
            
            // Apply the color
            cell.style.backgroundColor = heatColors[colorIndex];
            cell.style.color = colorIndex > 2 ? '#fff' : '#333';
        });
    }
}

// Update charts based on location
function updateChartsForLocation(location) {
    // Only update if charts exist
    if (!charts.vehiclesSold) return;
    
    // Default data (All locations)
    let vehicleSoldData = [45, 36, 28, 8, 7];
    let revenueData = [4.2, 4.5, 4.8, 4.6, 4.9, 5.2];
    let enquiriesData = [150, 165, 170, 162, 175, 182];
    let conversionsData = [90, 110, 115, 108, 118, 124];
    
    // Location specific data (simplified for example)
    if (location === 'shivamogga') {
        vehicleSoldData = [15, 12, 8, 3, 2];
        revenueData = [1.5, 1.6, 1.7, 1.6, 1.7, 1.8];
        enquiriesData = [48, 52, 55, 50, 54, 58];
        conversionsData = [30, 35, 38, 34, 37, 40];
    } else if (location === 'chitradurga') {
        vehicleSoldData = [10, 8, 7, 2, 1];
        revenueData = [1.0, 1.1, 1.2, 1.1, 1.2, 1.3];
        enquiriesData = [35, 38, 40, 36, 39, 42];
        conversionsData = [20, 25, 26, 22, 27, 28];
    } else if (location === 'chikmangaluru') {
        vehicleSoldData = [8, 6, 5, 1, 1];
        revenueData = [0.8, 0.9, 0.9, 0.8, 0.9, 1.0];
        enquiriesData = [30, 32, 33, 32, 35, 36];
        conversionsData = [18, 20, 22, 19, 23, 24];
    } else if (location === 'davanagere') {
        vehicleSoldData = [12, 10, 8, 2, 3];
        revenueData = [1.1, 1.2, 1.3, 1.2, 1.3, 1.4];
        enquiriesData = [37, 40, 42, 38, 41, 44];
        conversionsData = [22, 27, 29, 25, 28, 30];
    }
    
    // Update charts with new data
    charts.vehiclesSold.data.datasets[0].data = vehicleSoldData;
    charts.vehiclesSold.update();
    
    charts.revenue.data.datasets[0].data = revenueData;
    charts.revenue.update();
    
    charts.enquiriesConversions.data.datasets[0].data = enquiriesData;
    charts.enquiriesConversions.data.datasets[1].data = conversionsData;
    charts.enquiriesConversions.update();
    
    // Update the target charts if they exist and we're on that section
    if (charts.locationTargets) {
        const locationTargetData = location === 'all' ? 
            [[25, 20, 18, 22], [22, 18, 15, 20]] : 
            location === 'shivamogga' ? 
                [[25, 0, 0, 0], [22, 0, 0, 0]] : 
            location === 'chitradurga' ? 
                [[0, 20, 0, 0], [0, 18, 0, 0]] : 
            location === 'chikmangaluru' ? 
                [[0, 0, 18, 0], [0, 0, 15, 0]] : 
                [[0, 0, 0, 22], [0, 0, 0, 20]];
                
        charts.locationTargets.data.datasets[0].data = locationTargetData[0];
        charts.locationTargets.data.datasets[1].data = locationTargetData[1];
        charts.locationTargets.update();
    }
    
    if (charts.departmentTargets) {
        let departmentData;
        switch(location) {
            case 'shivamogga':
                departmentData = [88, 96, 90, 87, 92];
                break;
            case 'chitradurga':
                departmentData = [90, 94, 93, 86, 90];
                break;
            case 'chikmangaluru':
                departmentData = [83, 93, 95, 82, 89];
                break;
            case 'davanagere':
                departmentData = [91, 95, 94, 88, 93];
                break;
            default:
                departmentData = [88, 96, 93, 85, 91];
        }
        
        charts.departmentTargets.data.datasets[0].data = departmentData;
        charts.departmentTargets.update();
    }
    if(charts.forecast){
        // 12. Forecast Chart
        const forecastCtx = document.getElementById('forecastChart').getContext('2d');
        new Chart(forecastCtx, {
            type: 'line',
            data: {
                labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                datasets: [
                    {
                        label: 'Expected Sales',
                        data: [128, 142, 156, 168, 172, 180],
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Previous Year',
                        data: [118, 125, 140, 148, 152, 158],
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Sales Forecast (Next 6 Months)'
                    }
                }
            }
        });

        // Update the heatmap to use actual colors instead of grayscale
        const heatmapCells = document.querySelectorAll('.heatmap-cell');
        const heatColors = [
            '#FEF0D9', '#FDCC8A', '#FC8D59', '#E34A33', '#B30000', // Orange-red
            '#EDF8E9', '#BAE4B3', '#74C476', '#31A354', '#006D2C'  // Green
        ];
        
        heatmapCells.forEach((cell, index) => {
            // Remove the heat-X class
            cell.classList.remove('heat-1', 'heat-2', 'heat-3', 'heat-4', 'heat-5', 'heat-6', 'heat-7', 'heat-8');
            
            // Get the growth value
            const growthText = cell.querySelector('.heatmap-value').textContent;
            const growthValue = parseInt(growthText);
            
            // Determine color based on growth percentage
            let colorIndex = Math.min(Math.floor(growthValue / 5), heatColors.length - 1);
            
            // Apply the color
            cell.style.backgroundColor = heatColors[colorIndex];
            cell.style.color = colorIndex > 2 ? '#fff' : '#333';
        });
    
    }
    
    if (charts.enquiriesSales) {
        let conversionData;
        switch(location) {
            case 'shivamogga':
                conversionData = [70, 20, 10];
                break;
            case 'chitradurga':
                conversionData = [68, 22, 10];
                break;
            case 'chikmangaluru':
                conversionData = [65, 25, 10];
                break;
            case 'davanagere':
                conversionData = [69, 21, 10];
                break;
            default:
                conversionData = [68, 22, 10];
        }
        
        charts.enquiriesSales.data.datasets[0].data = conversionData;
        charts.enquiriesSales.update();
    }
    
    if (charts.targetProgress) {
        let progressData;
        switch(location) {
            case 'shivamogga':
                progressData = [
                    [60, 65, 68, 70],
                    [58, 63, 66, 68],
                    [55, 0, 0, 0]
                ];
                break;
            case 'chitradurga':
                progressData = [
                    [55, 58, 60, 65],
                    [53, 56, 58, 63],
                    [50, 0, 0, 0]
                ];
                break;
            case 'chikmangaluru':
                progressData = [
                    [50, 53, 55, 58],
                    [48, 51, 54, 56],
                    [45, 0, 0, 0]
                ];
                break;
            case 'davanagere':
                progressData = [
                    [60, 63, 65, 68],
                    [58, 61, 64, 66],
                    [55, 0, 0, 0]
                ];
                break;
            default:
                progressData = [
                    [225, 240, 250, 260],
                    [215, 235, 245, 255],
                    [205, 0, 0, 0]
                ];
        }
        
        charts.targetProgress.data.datasets[0].data = progressData[0];
        charts.targetProgress.data.datasets[1].data = progressData[1];
        charts.targetProgress.data.datasets[2].data = progressData[2];
        charts.targetProgress.update();
    }
   
    
    // Update additional charts if they exist
    if (charts.addons) {
        // You could add location-specific data for these charts as well
        charts.addons.update();
    }
    
    if (charts.vehicleType) {
        charts.vehicleType.update();
    }
    
    if (charts.serviceType) {
        charts.serviceType.update();
    }
    
    if (charts.marketShare) {
        charts.marketShare.update();
    }
    
    if (charts.satisfaction) {
        charts.satisfaction.update();
    }
    
    if (charts.pricing) {
        charts.pricing.update();
    }
    
    if (charts.forecast) {
        charts.forecast.update();
    }
    const forecastCtx = document.getElementById('forecastChart').getContext('2d');
        new Chart(forecastCtx, {
            type: 'line',
            data: {
                labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                datasets: [
                    {
                        label: 'Expected Sales',
                        data: [128, 142, 156, 168, 172, 180],
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Previous Year',
                        data: [118, 125, 140, 148, 152, 158],
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Sales Forecast (Next 6 Months)'
                    }
                }
            }
        });

        // Update the heatmap to use actual colors instead of grayscale
        const heatmapCells = document.querySelectorAll('.heatmap-cell');
        const heatColors = [
            '#FEF0D9', '#FDCC8A', '#FC8D59', '#E34A33', '#B30000', // Orange-red
            '#EDF8E9', '#BAE4B3', '#74C476', '#31A354', '#006D2C'  // Green
        ];
        
        heatmapCells.forEach((cell, index) => {
            // Remove the heat-X class
            cell.classList.remove('heat-1', 'heat-2', 'heat-3', 'heat-4', 'heat-5', 'heat-6', 'heat-7', 'heat-8');
            
            // Get the growth value
            const growthText = cell.querySelector('.heatmap-value').textContent;
            const growthValue = parseInt(growthText);
            
            // Determine color based on growth percentage
            let colorIndex = Math.min(Math.floor(growthValue / 5), heatColors.length - 1);
            
            // Apply the color
            cell.style.backgroundColor = heatColors[colorIndex];
            cell.style.color = colorIndex > 2 ? '#fff' : '#333';
        });
    
}


// Responsive design adjustments
// Responsive design adjustments
function handleResponsiveness() {
    // Handle sidebar display based on window width
    const windowWidth = window.innerWidth;
    if (windowWidth < 768) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    } else {
        // On larger screens, restore to default state if previously set
        if (sidebar.classList.contains('mobile-active')) {
            sidebar.classList.remove('mobile-active');
        }
    }
    
    // Update chart layouts if charts exist
    if (charts.vehiclesSold) {
        // Resize all charts
        Object.values(charts).forEach(chart => {
            chart.resize();
        });
    }
}

// Initialize the dashboard
function initializeDashboard() {
    // Set up event listeners
    toggleSidebarBtn.addEventListener('click', toggleSidebar);
    mobileNavToggle.addEventListener('click', toggleMobileNav);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });
    
    locationSelect.addEventListener('change', handleLocationChange);
    
    // Set default section
    navigateToSection('dashboard');
    
    // Initialize charts
    initializeCharts();
    
    // Handle responsive behavior
    handleResponsiveness();
    window.addEventListener('resize', handleResponsiveness);
}
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("a[href='#logout']").addEventListener("click", function(event) {
        event.preventDefault();
        window.location.href = "index.html";
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Select elements
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const sidebar = document.querySelector('.sidebar');
    const contentOverlay = document.querySelector('.content-overlay');
    const body = document.body;

    // Toggle sidebar when hamburger menu is clicked
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-visible');
            
            // If the content overlay doesn't exist, create it
            if (!contentOverlay) {
                const overlay = document.createElement('div');
                overlay.className = 'content-overlay';
                body.appendChild(overlay);
                
                // Add click event to close sidebar when overlay is clicked
                overlay.addEventListener('click', function() {
                    sidebar.classList.remove('mobile-visible');
                    overlay.classList.remove('active');
                    body.classList.remove('body-fixed');
                });
            }
            
            // Toggle overlay and body fixed class
            if (contentOverlay) {
                contentOverlay.classList.toggle('active');
            }
            
            // Toggle body fixed to prevent scrolling when sidebar is open
            body.classList.toggle('body-fixed');
        });
    }
    

    // Close sidebar when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && sidebar.classList.contains('mobile-visible')) {
            sidebar.classList.remove('mobile-visible');
            if (contentOverlay && contentOverlay.classList.contains('active')) {
                contentOverlay.classList.remove('active');
            }
            body.classList.remove('body-fixed');
        }
    });
});

// Handle section navigation
function navigateToSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active-section');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active-section');
        
        // Scroll to top of page
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Close mobile nav if open
    if (sidebar.classList.contains('mobile-active')) {
        sidebar.classList.remove('mobile-active');
    }
    
    // Also close sidebar if it has the mobile-visible class (for responsive mode)
    if (sidebar.classList.contains('mobile-visible')) {
        sidebar.classList.remove('mobile-visible');
        
        // Remove overlay if it exists
        const contentOverlay = document.querySelector('.content-overlay');
        if (contentOverlay && contentOverlay.classList.contains('active')) {
            contentOverlay.classList.remove('active');
        }
        
        // Remove body-fixed class to allow scrolling again
        document.body.classList.remove('body-fixed');
    }
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

// Make sure dropdown stays visible when scrolling
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.top-header');
    const sidebar = document.querySelector('.sidebar');
    
    // Adjust sidebar top position based on header height
    function adjustLayout() {
        const headerHeight = header.offsetHeight;
        sidebar.style.top = headerHeight + 'px';
        sidebar.style.height = `calc(100vh - ${headerHeight}px)`;
    }
    
    // Run on page load
    adjustLayout();
    
    // Run on window resize
    window.addEventListener('resize', adjustLayout);
});

// Add this to your dashboard.js file
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if(mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Sidebar toggle
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    
    if(toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            
            // Update toggle button text
            const toggleText = document.querySelector('.toggle-sidebar-text');
            const toggleIcon = document.querySelector('.toggle-sidebar-icon');
            
            if(sidebar.classList.contains('collapsed')) {
                toggleText.textContent = 'Expand';
                toggleIcon.textContent = '▶';
            } else {
                toggleText.textContent = 'Collapse';
                toggleIcon.textContent = '◀';
            }
        });
    }
    // Select mobile menu button and sidebar
    
    
    
    // Navigation menu functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.dashboard-section');
    
    navLinks.forEach(link => {
        if(!link.getAttribute('href').startsWith('#')) return;
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active-section');
            });
            
            // Show target section
            document.getElementById(targetSection).classList.add('active-section');
            
            // Update active link
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
            
            // Close mobile menu if open
            if(window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Handle scroll to hide location selector
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const locationSelector = document.querySelector('.location-selector');
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 50) {
            // Scrolling down
            locationSelector.style.opacity = '0';
            locationSelector.style.visibility = 'hidden';
            locationSelector.style.transition = 'opacity 0.3s, visibility 0.3s';
        } else {
            // Scrolling up
            locationSelector.style.opacity = '1';
            locationSelector.style.visibility = 'visible';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Toggle sidebar collapse
    const toggleSidebar = document.getElementById('toggleSidebar');
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            
            // Update toggle button text
            const toggleText = document.querySelector('.toggle-sidebar-text');
            const toggleIcon = document.querySelector('.toggle-sidebar-icon');
            
            if (sidebar.classList.contains('collapsed')) {
                toggleText.textContent = 'Expand';
                toggleIcon.textContent = '▶';
            } else {
                toggleText.textContent = 'Collapse';
                toggleIcon.textContent = '◀';
            }
        });
    }
    
    // Activate sidebar navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.dashboard-section');
    
    // Select elements
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                // Remove active class from all links and sections
                navLinks.forEach(link => link.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active-section'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Show corresponding section
                const sectionId = this.getAttribute('data-section');
                if (sectionId) {
                    const section = document.getElementById(sectionId);
                    if (section) {
                        section.classList.add('active-section');
                    }
                }
                
                // On mobile, close the sidebar after selection
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
            }
        });
    });
});


// Toggle full sidebar in mobile mode
//const mobileNavToggle = document.getElementById("mobileNavToggle");
//const sidebar = document.getElementById("sidebar");

mobileNavToggle.addEventListener("click", function () {
    sidebar.classList.toggle("mobile-active");
});

// Close sidebar when clicking outside of it (Only if it's open)
document.addEventListener("click", function (event) {
    if (sidebar.classList.contains("mobile-active") && 
        !sidebar.contains(event.target) && 
        !mobileNavToggle.contains(event.target)) {
        sidebar.classList.remove("mobile-active");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const mobileNavToggle = document.getElementById("mobileNavToggle");
    const sidebar = document.getElementById("sidebar");

    if (mobileNavToggle && sidebar) {
        // Toggle sidebar when clicking ☰ button
        mobileNavToggle.addEventListener("click", function () {
            console.log("☰ Button Clicked!"); // Debugging
            sidebar.classList.toggle("mobile-active");
        });

        // Close sidebar when clicking outside (but keep the ☰ button visible)
        document.addEventListener("click", function (event) {
            if (sidebar.classList.contains("mobile-active") &&
                !sidebar.contains(event.target) &&
                !mobileNavToggle.contains(event.target)) {
                sidebar.classList.remove("mobile-active");
            }
        });
    } else {
        console.error("MobileNavToggle or Sidebar not found!"); // Debugging
    }
});



// Start the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);
    // Update chart layouts if
