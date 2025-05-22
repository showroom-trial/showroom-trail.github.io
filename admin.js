document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const sidebarNavItems = document.querySelectorAll('.sidebar-nav li:not(#logout-btn)');
    const contentSections = document.querySelectorAll('.content-section');
    const viewButtons = document.querySelectorAll('.view-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const filterSelects = document.querySelectorAll('.filter select');
    const searchInputs = document.querySelectorAll('.search input');
    const actionButtons = document.querySelectorAll('.action-btn');
    const tableActions = document.querySelectorAll('.actions button');
    
    // Mobile Navigation Toggle
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            this.textContent = sidebar.classList.contains('active') ? '×' : '☰';
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isMobile = window.innerWidth <= 768;
        if (isMobile && sidebar.classList.contains('active')) {
            if (!sidebar.contains(event.target) && event.target !== mobileNavToggle) {
                sidebar.classList.remove('active');
                if (mobileNavToggle) mobileNavToggle.textContent = '☰';
            }
        }
    });

    // Sidebar Navigation
    sidebarNavItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all sidebar items
            sidebarNavItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Show selected content section
            const tabId = this.getAttribute('data-tab');
            const selectedSection = document.getElementById(tabId);
            if (selectedSection) {
                selectedSection.classList.add('active');
            }
            
            // Close mobile sidebar after selection
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                if (mobileNavToggle) mobileNavToggle.textContent = '☰';
            }
        });
    });

    // View Buttons Functionality
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const parentSection = this.closest('.content-section, .table-section');
            const viewBtns = parentSection.querySelectorAll('.view-btn');
            
            // Remove active class from all view buttons in this section
            viewBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Here you would typically change the view/display of data
            // For now, we'll just log the selected view
            console.log('View changed to:', this.getAttribute('data-view'));
            
            // Example: You could add logic to filter or change table display
            const viewType = this.getAttribute('data-view');
            const tableContainer = parentSection.querySelector('.table-container');
            
            if (tableContainer) {
                // This is where you would update the table view based on viewType
                // For example, changing sorting, grouping, or display format
            }
        });
    });

    // Search Input Functionality
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const parentSection = this.closest('.content-section, .table-section');
            const tableRows = parentSection.querySelectorAll('.data-table tbody tr');
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    });

    // Filter Select Functionality
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            const filterValue = this.value.toLowerCase();
            const filterType = this.id; // e.g., 'employee-role-filter'
            const parentSection = this.closest('.content-section, .table-section');
            const tableRows = parentSection.querySelectorAll('.data-table tbody tr');
            
            if (!filterValue) {
                // Show all rows if no filter selected
                tableRows.forEach(row => row.style.display = '');
                return;
            }
            
            tableRows.forEach(row => {
                let match = false;
                
                // Different logic based on filter type
                switch(filterType) {
                    case 'employee-role-filter':
                        match = row.cells[1].textContent.toLowerCase().includes(filterValue);
                        break;
                    case 'employee-location-filter':
                        match = row.cells[2].textContent.toLowerCase().includes(filterValue);
                        break;
                    case 'vehicle-year-filter':
                        match = row.cells[1].textContent.toLowerCase().includes(filterValue);
                        break;
                    case 'vehicle-type-filter':
                        // This would depend on how vehicle type is represented in the table
                        match = row.textContent.toLowerCase().includes(filterValue);
                        break;
                    case 'addon-category-filter':
                        match = row.cells[1].textContent.toLowerCase().includes(filterValue);
                        break;
                    case 'sales-executive-filter':
                        match = row.cells[2].textContent.toLowerCase().includes(filterValue);
                        break;
                    case 'sales-model-filter':
                        match = row.cells[1].textContent.toLowerCase().includes(filterValue);
                        break;
                    case 'enquiry-status-filter':
                        match = row.cells[6].textContent.toLowerCase().includes(filterValue);
                        break;
                    case 'enquiry-source-filter':
                        match = row.cells[4].textContent.toLowerCase().includes(filterValue);
                        break;
                    case 'followup-status-filter':
                        match = row.cells[5].textContent.toLowerCase().includes(filterValue);
                        break;
                    case 'followup-type-filter':
                        match = row.cells[2].textContent.toLowerCase().includes(filterValue);
                        break;
                    case 'region-state-filter':
                        match = row.cells[2].textContent.toLowerCase().includes(filterValue);
                        break;
                    case 'report-type-filter':
                        match = row.cells[2].textContent.toLowerCase().includes(filterValue);
                        break;
                    default:
                        match = true;
                }
                
                row.style.display = match ? '' : 'none';
            });
        });
    });

    // Date Range Filter Functionality
    const dateInputs = document.querySelectorAll('.date-range input[type="date"]');
    dateInputs.forEach(input => {
        input.addEventListener('change', function() {
            const parentSection = this.closest('.content-section, .table-section');
            const startDateInput = parentSection.querySelector('.date-range input[type="date"]:nth-child(1)');
            const endDateInput = parentSection.querySelector('.date-range input[type="date"]:nth-child(2)');
            
            if (!startDateInput.value && !endDateInput.value) {
                // Reset filter if both dates are empty
                const tableRows = parentSection.querySelectorAll('.data-table tbody tr');
                tableRows.forEach(row => row.style.display = '');
                return;
            }
            
            filterTableByDateRange(parentSection, startDateInput.value, endDateInput.value);
        });
    });

    function filterTableByDateRange(section, startDate, endDate) {
        const tableRows = section.querySelectorAll('.data-table tbody tr');
        const dateColumnIndex = findDateColumnIndex(section);
        
        if (dateColumnIndex === -1) return;
        
        const start = startDate ? new Date(startDate) : new Date(0); // If no start date, use earliest possible
        const end = endDate ? new Date(endDate) : new Date('9999-12-31'); // If no end date, use latest possible
        
        tableRows.forEach(row => {
            const dateCell = row.cells[dateColumnIndex].textContent;
            const rowDate = new Date(dateCell);
            
            if (isNaN(rowDate.getTime())) {
                // Invalid date format in table
                row.style.display = '';
                return;
            }
            
            row.style.display = (rowDate >= start && rowDate <= end) ? '' : 'none';
        });
    }

    function findDateColumnIndex(section) {
        // Find column that likely contains dates based on section ID
        const sectionId = section.id;
        let dateColumnIndex = -1;
        
        switch(sectionId) {
            case 'employee':
                dateColumnIndex = 4; // Joining Date
                break;
            case 'vehicle':
                dateColumnIndex = -1; // No date column in vehicle table
                break;
            case 'addons':
                dateColumnIndex = -1; // No date column in addons table
                break;
            case 'sales':
                dateColumnIndex = 4; // Sale Date
                break;
            case 'enquiry':
                dateColumnIndex = 5; // Date
                break;
            case 'follow-ups':
                dateColumnIndex = 4; // Due Date
                break;
            case 'region-table-section':
                dateColumnIndex = 5; // Date Added
                break;
            case 'comparison-table-section':
                dateColumnIndex = 5; // Creation Date
                break;
            default:
                // Try to find a column with 'date' in the header
                const headerRow = section.querySelector('.data-table thead tr');
                if (headerRow) {
                    const headers = headerRow.querySelectorAll('th');
                    for (let i = 0; i < headers.length; i++) {
                        if (headers[i].textContent.toLowerCase().includes('date')) {
                            dateColumnIndex = i;
                            break;
                        }
                    }
                }
        }
        
        return dateColumnIndex;
    }

    // Modal functionality for Add, Edit, View, etc.
    function createModal(title, content) {
        // Remove any existing modal
        removeModal();
        
        // Create modal elements
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = title;
        
        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', removeModal);
        
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        modalBody.innerHTML = content;
        
        // Assemble modal
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        modalContainer.appendChild(modalHeader);
        modalContainer.appendChild(modalBody);
        modalOverlay.appendChild(modalContainer);
        
        // Add to document
        document.body.appendChild(modalOverlay);
        
        // Close modal when clicking outside
        modalOverlay.addEventListener('click', function(event) {
            if (event.target === modalOverlay) {
                removeModal();
            }
        });
        
        // Prevent page scrolling when modal is open
        document.body.style.overflow = 'hidden';
    }

    function removeModal() {
        const modalOverlay = document.querySelector('.modal-overlay');
        if (modalOverlay) {
            modalOverlay.remove();
            document.body.style.overflow = '';
        }
    }

    // Action Button Events (Add, Import, Export)
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.classList.contains('add-btn') ? 'add' : 
                          this.classList.contains('import-btn') ? 'import' : 
                          this.classList.contains('export-btn') ? 'export' : 'view';
            
            const parentSection = this.closest('.content-section, .table-section');
            const sectionTitle = parentSection.querySelector('.section-title, h3').textContent;
            
            let modalTitle, modalContent;
            
            switch(action) {
                case 'add':
                    modalTitle = `Add New ${sectionTitle.replace(' Management', '')}`;
                    modalContent = createAddForm(parentSection.id);
                    break;
                case 'import':
                    modalTitle = `Import ${sectionTitle.replace(' Management', '')}`;
                    modalContent = createImportForm(parentSection.id);
                    break;
                case 'export':
                    modalTitle = `Export ${sectionTitle.replace(' Management', '')}`;
                    modalContent = createExportForm(parentSection.id);
                    break;
                case 'view':
                    modalTitle = `View ${sectionTitle.replace(' Management', '')}`;
                    modalContent = createViewDetails(parentSection.id);
                    break;
            }
            
            createModal(modalTitle, modalContent);
        });
    });

    // Table Action Events (Edit, Delete, View Details)
    tableActions.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const firstCell = row.cells[0].textContent;
            const secondCell = row.cells[1].textContent;
            const parentSection = this.closest('.content-section, .table-section');
            const sectionTitle = parentSection.querySelector('.section-title, h3').textContent;
            
            let modalTitle, modalContent;
            
            if (this.classList.contains('edit-btn')) {
                modalTitle = `Edit ${sectionTitle.replace(' Management', '')} - ${firstCell}`;
                modalContent = createEditForm(parentSection.id, row);
            } else if (this.classList.contains('delete-btn')) {
                modalTitle = `Delete ${sectionTitle.replace(' Management', '')}`;
                modalContent = `
                    <div class="delete-confirmation">
                        <p>Are you sure you want to delete ${secondCell} (${firstCell})?</p>
                        <div class="modal-actions">
                            <button class="btn btn-danger confirm-delete">Delete</button>
                            <button class="btn btn-secondary cancel-delete">Cancel</button>
                        </div>
                    </div>
                `;
            } else if (this.classList.contains('view-details-btn')) {
                modalTitle = `${secondCell} Details`;
                modalContent = createViewDetails(parentSection.id, row);
            }
            
            createModal(modalTitle, modalContent);
            
            // Add event listeners to modal buttons
            setTimeout(() => {
                const confirmDelete = document.querySelector('.confirm-delete');
                const cancelDelete = document.querySelector('.cancel-delete');
                
                if (confirmDelete) {
                    confirmDelete.addEventListener('click', function() {
                        // Here you would typically make an API call to delete the item
                        row.remove();
                        removeModal();
                        
                        // Show success notification
                        showNotification('Item deleted successfully', 'success');
                    });
                }
                
                if (cancelDelete) {
                    cancelDelete.addEventListener('click', removeModal);
                }
                
                // Add form submission handler
                const form = document.querySelector('.modal-form');
                if (form) {
                    form.addEventListener('submit', function(e) {
                        e.preventDefault();
                        // Here you would typically make an API call with form data
                        removeModal();
                        
                        // Show success notification
                        showNotification('Changes saved successfully', 'success');
                    });
                }
            }, 100);
        });
    });

    // Create form based on section ID
    function createAddForm(sectionId) {
        let formHTML = '<form class="modal-form">';
        
        switch(sectionId) {
            case 'employee':
                formHTML += `
                    <div class="form-group">
                        <label for="employee-name">Name</label>
                        <input type="text" id="employee-name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="employee-role">Role</label>
                        <select id="employee-role" name="role" required>
                            <option value="">Select Role</option>
                            <option value="General Manager">General Manager</option>
                            <option value="Sales Executive">Sales Executive</option>
                            <option value="Service Manager">Service Manager</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="employee-location">Location</label>
                        <select id="employee-location" name="location" required>
                            <option value="">Select Location</option>
                            <option value="Main Showroom">Main Showroom</option>
                            <option value="Chitradurga Branch">Chitradurga Branch</option>
                            <option value="Chikmangluru Branch">Chikmangluru Branch</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="employee-contact">Contact</label>
                        <input type="email" id="employee-contact" name="contact" required>
                    </div>
                    <div class="form-group">
                        <label for="employee-joining-date">Joining Date</label>
                        <input type="date" id="employee-joining-date" name="joiningDate" required>
                    </div>
                `;
                break;
            case 'vehicle':
                formHTML += `
                    <div class="form-group">
                        <label for="vehicle-name">Vehicle Name</label>
                        <input type="text" id="vehicle-name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="vehicle-year">Model Year</label>
                        <select id="vehicle-year" name="year" required>
                            <option value="">Select Year</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="vehicle-price">Price (₹)</label>
                        <input type="number" id="vehicle-price" name="price" min="0" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="vehicle-engine">Engine</label>
                        <input type="text" id="vehicle-engine" name="engine" required>
                    </div>
                    <div class="form-group">
                        <label for="vehicle-transmission">Transmission</label>
                        <select id="vehicle-transmission" name="transmission" required>
                            <option value="">Select Transmission</option>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                            <option value="CVT">CVT</option>
                            <option value="DCT">DCT</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="vehicle-availability">Availability</label>
                        <select id="vehicle-availability" name="availability" required>
                            <option value="Available">Available</option>
                            <option value="Out of Stock">Out of Stock</option>
                            <option value="Coming Soon">Coming Soon</option>
                        </select>
                    </div>
                `;
                break;
            case 'addons':
                formHTML += `
                    <div class="form-group">
                        <label for="addon-name">Add-on Name</label>
                        <input type="text" id="addon-name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="addon-category">Category</label>
                        <select id="addon-category" name="category" required>
                            <option value="">Select Category</option>
                            <option value="Interior">Interior</option>
                            <option value="Exterior">Exterior</option>
                            <option value="Performance">Performance</option>
                            <option value="Warranty">Warranty</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="addon-price">Price (₹)</label>
                        <input type="number" id="addon-price" name="price" min="0" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="addon-models">Applicable Models</label>
                        <select id="addon-models" name="models" multiple required>
                            <option value="All Models">All Models</option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Truck">Truck</option>
                        </select>
                        <small>Hold Ctrl/Cmd to select multiple</small>
                    </div>
                `;
                break;
            case 'sales':
                formHTML += `
                    <div class="form-group">
                        <label for="invoice-number">Invoice #</label>
                        <input type="text" id="invoice-number" name="invoiceNumber" required>
                    </div>
                    <div class="form-group">
                        <label for="vehicle-model">Vehicle Model</label>
                        <select id="vehicle-model" name="vehicleModel" required>
                            <option value="">Select Model</option>
                            <option value="Seltos">Seltos</option>
                            <option value="EV6">EV6</option>
                            <option value="Sonet">Sonet</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="sales-executive">Sales Executive</label>
                        <select id="sales-executive" name="salesExecutive" required>
                            <option value="">Select Executive</option>
                            <option value="John Smith">John Smith</option>
                            <option value="Sarah Johnson">Sarah Johnson</option>
                            <option value="Michael Wilson">Michael Wilson</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="customer-name">Customer</label>
                        <input type="text" id="customer-name" name="customerName" required>
                    </div>
                    <div class="form-group">
                        <label for="sale-date">Sale Date</label>
                        <input type="date" id="sale-date" name="saleDate" required>
                    </div>
                    <div class="form-group">
                        <label for="sale-amount">Sale Amount (₹)</label>
                        <input type="number" id="sale-amount" name="saleAmount" min="0" step="0.01" required>
                    </div>
                `;
                break;
            case 'enquiry':
                formHTML += `
                    <div class="form-group">
                        <label for="enquiry-id">Enquiry ID</label>
                        <input type="text" id="enquiry-id" name="enquiryId" required>
                    </div>
                    <div class="form-group">
                        <label for="customer-name">Customer Name</label>
                        <input type="text" id="customer-name" name="customerName" required>
                    </div>
                    <div class="form-group">
                        <label for="customer-contact">Contact</label>
                        <input type="email" id="customer-contact" name="customerContact" required>
                    </div>
                    <div class="form-group">
                        <label for="vehicle-interest">Vehicle Interest</label>
                        <select id="vehicle-interest" name="vehicleInterest" required>
                            <option value="">Select Vehicle</option>
                            <option value="Seltos">Seltos</option>
                            <option value="EV6">EV6</option>
                            <option value="Sonet">Sonet</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="enquiry-source">Source</label>
                        <select id="enquiry-source" name="enquirySource" required>
                            <option value="Website">Website</option>
                            <option value="Phone">Phone</option>
                            <option value="Walk-in">Walk-in</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="enquiry-date">Date</label>
                        <input type="date" id="enquiry-date" name="enquiryDate" required>
                    </div>
                    <div class="form-group">
                        <label for="enquiry-status">Status</label>
                        <select id="enquiry-status" name="enquiryStatus" required>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                `;
                break;
            case 'follow-ups':
                formHTML += `
                    <div class="form-group">
                        <label for="followup-id">Follow-up ID</label>
                        <input type="text" id="followup-id" name="followupId" required>
                    </div>
                    <div class="form-group">
                        <label for="customer-name">Customer Name</label>
                        <input type="text" id="customer-name" name="customerName" required>
                    </div>
                    <div class="form-group">
                        <label for="followup-type">Type</label>
                        <select id="followup-type" name="followupType" required>
                            <option value="Sales">Sales</option>
                            <option value="Service">Service</option>
                            <option value="Enquiry">Enquiry</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="assigned-to">Assigned To</label>
                        <select id="assigned-to" name="assignedTo" required>
                            <option value="">Select Employee</option>
                            <option value="John Smith">John Smith</option>
                            <option value="Sarah Johnson">Sarah Johnson</option>
                            <option value="Michael Wilson">Michael Wilson</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="due-date">Due Date</label>
                        <input type="date" id="due-date" name="dueDate" required>
                    </div>
                    <div class="form-group">
                        <label for="followup-status">Status</label>
                        <select id="followup-status" name="followupStatus" required>
                            <option value="Pending">Pending</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                `;
                break;
            case 'region-table-section':
                formHTML += `
                    <div class="form-group">
                        <label for="region-id">Region ID</label>
                        <input type="text" id="region-id" name="regionId" required>
                    </div>
                    <div class="form-group">
                        <label for="region-name">Region Name</label>
                        <input type="text" id="region-name" name="regionName" required>
                    </div>
                    <div class="form-group">
                        <label for="region-state">State</label>
                        <select id="region-state" name="regionState" required>
                            <option value="">Select State</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Maharashtra">Maharashtra</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="branch-count">Branch Count</label>
                        <input type="number" id="branch-count" name="branchCount" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="region-manager">Manager</label>
                        <input type="text" id="region-manager" name="regionManager" required>
                    </div>
                    <div class="form-group">
                        <label for="date-added">Date Added</label>
                        <input type="date" id="date-added" name="dateAdded" required>
                    </div>
                `;
                break;
            case 'comparison-table-section':
                formHTML += `
                    <div class="form-group">
                        <label for="report-id">Report ID</label>
                        <input type="text" id="report-id" name="reportId" required>
                    </div>
                    <div class="form-group">
                        <label for="report-name">Report Name</label>
                        <input type="text" id="report-name" name="reportName" required>
                    </div>
                    <div class="form-group">
                        <label for="report-type">Type</label>
                        <select id="report-type" name="reportType" required>
                            <option value="">Select Type</option>
                            <option value="Sales Comparison">Sales Comparison</option>
                            <option value="Performance Comparison">Performance Comparison</option>
                            <option value="Regional Comparison">Regional Comparison</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="time-period">Time Period</label>
                        <input type="text" id="time-period" name="timePeriod" required>
                    </div>
                    <div class="form-group">
                        <label for="created-by">Created By</label>
                        <select id="created-by" name="createdBy" required>
                            <option value="">Select Employee</option>
                            <option value="John Smith">John Smith</option>
                            <option value="Sarah Johnson">Sarah Johnson</option>
                            <option value="Michael Wilson">Michael Wilson</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="creation-date">Creation Date</label>
                        <input type="date" id="creation-date" name="creationDate" required>
                    </div>
                    `;
                break;
            default:
                formHTML += `
                    <div class="form-group">
                        <label for="item-name">Name</label>
                        <input type="text" id="item-name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="item-description">Description</label>
                        <textarea id="item-description" name="description" rows="4"></textarea>
                    </div>
                `;
        }
        
        // Add submit button to all forms
        formHTML += `
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Save</button>
                <button type="button" class="btn btn-secondary modal-close-btn">Cancel</button>
            </div>
        </form>`;
        
        return formHTML;
    }

    function createEditForm(sectionId, row) {
        // For edit forms, we'll pre-fill with data from the row
        const formHTML = createAddForm(sectionId);
        
        // After modal is created, we'll fill in the values
        setTimeout(() => {
            const form = document.querySelector('.modal-form');
            const inputs = form.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                const fieldName = input.name;
                let value = '';
                
                // Map field names to column indices
                switch(fieldName) {
                    case 'name':
                    case 'vehicleModel':
                    case 'customerName':
                    case 'regionName':
                    case 'reportName':
                        value = row.cells[1].textContent;
                        break;
                    case 'role':
                    case 'year':
                    case 'category':
                    case 'salesExecutive':
                    case 'vehicleInterest':
                    case 'followupType':
                    case 'regionState':
                    case 'reportType':
                        value = row.cells[2].textContent;
                        break;
                    case 'location':
                    case 'price':
                    case 'customerContact':
                    case 'enquirySource':
                    case 'assignedTo':
                    case 'branchCount':
                    case 'timePeriod':
                        value = row.cells[3].textContent;
                        break;
                    case 'contact':
                    case 'engine':
                    case 'invoiceNumber':
                    case 'enquiryId':
                    case 'followupId':
                    case 'regionManager':
                    case 'createdBy':
                        value = row.cells[0].textContent;
                        break;
                    case 'joiningDate':
                    case 'saleDate':
                    case 'enquiryDate':
                    case 'dueDate':
                    case 'dateAdded':
                    case 'creationDate':
                        value = row.cells[4]?.textContent;
                        break;
                    case 'transmission':
                    case 'saleAmount':
                    case 'enquiryStatus':
                    case 'followupStatus':
                        value = row.cells[5]?.textContent;
                        break;
                    case 'availability':
                        value = row.cells[6]?.textContent;
                        break;
                }
                
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = (input.value === value);
                } else if (input.tagName === 'SELECT') {
                    // For select elements, find the matching option
                    const option = Array.from(input.options).find(opt => opt.value === value);
                    if (option) {
                        option.selected = true;
                    }
                } else {
                    input.value = value;
                }
            });
        }, 100);
        
        return formHTML;
    }

    function createImportForm(sectionId) {
        return `
            <form class="modal-form">
                <div class="form-group">
                    <label for="import-file">Select File</label>
                    <input type="file" id="import-file" name="importFile" accept=".csv, .xlsx" required>
                    <small>Accepted formats: CSV, Excel</small>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="overwrite" value="1">
                        Overwrite existing records
                    </label>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Import</button>
                    <button type="button" class="btn btn-secondary modal-close-btn">Cancel</button>
                </div>
            </form>
        `;
    }

    function createExportForm(sectionId) {
        return `
            <form class="modal-form">
                <div class="form-group">
                    <label>Export Format</label>
                    <div class="radio-group">
                        <label>
                            <input type="radio" name="exportFormat" value="csv" checked>
                            CSV
                        </label>
                        <label>
                            <input type="radio" name="exportFormat" value="excel">
                            Excel (XLSX)
                        </label>
                        <label>
                            <input type="radio" name="exportFormat" value="pdf">
                            PDF
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="export-options">Data to Export</label>
                    <select id="export-options" name="exportOptions">
                        <option value="all">All Records</option>
                        <option value="filtered">Current Filtered View</option>
                        <option value="selected">Selected Records</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Export</button>
                    <button type="button" class="btn btn-secondary modal-close-btn">Cancel</button>
                </div>
            </form>
        `;
    }

    function createViewDetails(sectionId, row) {
        let detailsHTML = '<div class="details-view">';
        
        if (!row) {
            return '<p>No data available to display details.</p>';
        }
        
        switch(sectionId) {
            case 'employee':
                detailsHTML += `
                    <div class="detail-item">
                        <div class="detail-label">Employee ID:</div>
                        <div class="detail-value">${row.cells[0].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Name:</div>
                        <div class="detail-value">${row.cells[1].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Role:</div>
                        <div class="detail-value">${row.cells[2].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Location:</div>
                        <div class="detail-value">${row.cells[3].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Joining Date:</div>
                        <div class="detail-value">${row.cells[4].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Contact:</div>
                        <div class="detail-value">${row.cells[5].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Status:</div>
                        <div class="detail-value">${row.cells[6].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Performance Rating:</div>
                        <div class="detail-value">★★★★☆</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Recent Sales:</div>
                        <div class="detail-value">12 (Last 30 days)</div>
                    </div>
                `;
                break;
            case 'vehicle':
                detailsHTML += `
                    <div class="detail-item">
                        <div class="detail-label">Model ID:</div>
                        <div class="detail-value">${row.cells[0].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Name:</div>
                        <div class="detail-value">${row.cells[1].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Year:</div>
                        <div class="detail-value">${row.cells[2].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Price:</div>
                        <div class="detail-value">${row.cells[3].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Engine:</div>
                        <div class="detail-value">${row.cells[4].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Transmission:</div>
                        <div class="detail-value">${row.cells[5].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Availability:</div>
                        <div class="detail-value">${row.cells[6].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Features:</div>
                        <div class="detail-value">
                            <ul>
                                <li>360° Camera</li>
                                <li>Blind Spot Detection</li>
                                <li>Apple CarPlay & Android Auto</li>
                                <li>LED Headlights</li>
                                <li>Wireless Charging</li>
                            </ul>
                        </div>
                    </div>
                `;
                break;
            // Add more cases for other sections...
            case 'sales':
                detailsHTML += `
                    <div class="detail-item">
                        <div class="detail-label">Invoice #:</div>
                        <div class="detail-value">${row.cells[0].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Vehicle Model:</div>
                        <div class="detail-value">${row.cells[1].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Sales Executive:</div>
                        <div class="detail-value">${row.cells[2].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Customer:</div>
                        <div class="detail-value">${row.cells[3].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Sale Date:</div>
                        <div class="detail-value">${row.cells[4].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Sale Amount:</div>
                        <div class="detail-value">${row.cells[5].textContent}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Add-ons:</div>
                        <div class="detail-value">
                            <ul>
                                <li>Extended Warranty (₹45,000)</li>
                                <li>Premium Interior Package (₹28,500)</li>
                                <li>Roadside Assistance (₹12,000)</li>
                            </ul>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Payment Method:</div>
                        <div class="detail-value">Financed (HDFC Bank)</div>
                    </div>
                `;
                break;
            default:
                // Generic details view for other sections
                for (let i = 0; i < row.cells.length; i++) {
                    const headerCell = row.closest('table').querySelector(`thead th:nth-child(${i + 1})`);
                    const headerText = headerCell ? headerCell.textContent : `Column ${i + 1}`;
                    
                    detailsHTML += `
                        <div class="detail-item">
                            <div class="detail-label">${headerText}:</div>
                            <div class="detail-value">${row.cells[i].textContent}</div>
                        </div>
                    `;
                }
        }
        
        detailsHTML += '</div>';
        return detailsHTML;
    }

    // Add event listener to modal close buttons added after modal creation
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal-close-btn')) {
            removeModal();
        }
    });

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove any existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Create close button
        const closeButton = document.createElement('span');
        closeButton.className = 'notification-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', function() {
            notification.remove();
        });
        
        notification.appendChild(closeButton);
        document.body.appendChild(notification);
        
        // Automatically remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // Data Chart Setup (for dashboard)
    function setupCharts() {
        // Sales Performance Chart
        const salesChartCtx = document.getElementById('salesChart');
        if (salesChartCtx) {
            const salesChart = new Chart(salesChartCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Monthly Sales',
                        data: [12, 19, 15, 17, 22, 24],
                        backgroundColor: '#4CAF50',
                        borderColor: '#388E3C',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        
        // Vehicle Sales by Model Chart
        const modelChartCtx = document.getElementById('modelChart');
        if (modelChartCtx) {
            const modelChart = new Chart(modelChartCtx, {
                type: 'pie',
                data: {
                    labels: ['Seltos', 'EV6', 'Sonet', 'Carnival', 'Others'],
                    datasets: [{
                        data: [42, 18, 28, 7, 5],
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF'
                        ]
                    }]
                }
            });
        }
        
        // Branch Performance Chart
        const branchChartCtx = document.getElementById('branchChart');
        if (branchChartCtx) {
            const branchChart = new Chart(branchChartCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: 'Main Showroom',
                            data: [35, 40, 38, 43, 47, 50],
                            borderColor: '#FF6384',
                            fill: false
                        },
                        {
                            label: 'Chitradurga Branch',
                            data: [20, 22, 25, 23, 28, 30],
                            borderColor: '#36A2EB',
                            fill: false
                        },
                        {
                            label: 'Chikmangluru Branch',
                            data: [15, 18, 17, 20, 22, 25],
                            borderColor: '#FFCE56',
                            fill: false
                        }
                    ]
                }
            });
        }
    }

    // Initialize charts if available
    if (typeof Chart !== 'undefined') {
        setupCharts();
    } else {
        console.log('Chart.js not available');
    }

    // User Profile Menu
    const userProfileMenu = document.getElementById('userProfileMenu');
    const userMenuDropdown = document.getElementById('userMenuDropdown');

    if (userProfileMenu && userMenuDropdown) {
        userProfileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenuDropdown.classList.toggle('active');
        });

        document.addEventListener('click', function(e) {
            if (!userMenuDropdown.contains(e.target) && e.target !== userProfileMenu) {
                userMenuDropdown.classList.remove('active');
            }
        });
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // In a real application, you'd perform a logout API call here
            window.location.href = 'login.html';
        });
    }

    // Multi-select functionality
    const multiSelects = document.querySelectorAll('select[multiple]');
    multiSelects.forEach(select => {
        // Enhance multi-select UI if needed
    });

    // Add row selection functionality
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // Don't select when clicking on action buttons
            if (e.target.closest('.actions')) {
                return;
            }
            
            this.classList.toggle('selected');
            
            // Update selected count if there's a batch actions bar
            const batchActionsBar = this.closest('.content-section').querySelector('.batch-actions');
            if (batchActionsBar) {
                const selectedCount = this.closest('tbody').querySelectorAll('tr.selected').length;
                const countElement = batchActionsBar.querySelector('.selected-count');
                
                if (countElement) {
                    countElement.textContent = selectedCount;
                }
                
                batchActionsBar.style.display = selectedCount > 0 ? 'flex' : 'none';
            }
        });
    });

    // Batch action buttons
    const batchActionButtons = document.querySelectorAll('.batch-actions button');
    batchActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const parentSection = this.closest('.content-section');
            const selectedRows = parentSection.querySelectorAll('tbody tr.selected');
            
            if (selectedRows.length === 0) {
                showNotification('No items selected', 'warning');
                return;
            }
            
            switch(action) {
                case 'delete':
                    // Here you'd usually show a confirmation modal
                    createModal('Confirm Deletion', `
                        <div class="delete-confirmation">
                            <p>Are you sure you want to delete ${selectedRows.length} selected items?</p>
                            <div class="modal-actions">
                                <button class="btn btn-danger confirm-batch-delete">Delete</button>
                                <button class="btn btn-secondary cancel-delete">Cancel</button>
                            </div>
                        </div>
                    `);
                    
                    // Add event listener to confirm button
                    setTimeout(() => {
                        const confirmDelete = document.querySelector('.confirm-batch-delete');
                        if (confirmDelete) {
                            confirmDelete.addEventListener('click', function() {
                                // Here you would typically make an API call to delete the items
                                selectedRows.forEach(row => row.remove());
                                removeModal();
                                
                                // Hide batch actions bar
                                const batchActionsBar = parentSection.querySelector('.batch-actions');
                                if (batchActionsBar) {
                                    batchActionsBar.style.display = 'none';
                                }
                                
                                showNotification(`${selectedRows.length} items deleted successfully`, 'success');
                            });
                        }
                    }, 100);
                    break;
                case 'export':
                    showNotification(`Exporting ${selectedRows.length} selected items...`, 'info');
                    // Here you would typically make an API call to export the selected items
                    setTimeout(() => {
                        showNotification('Export completed successfully', 'success');
                    }, 2000);
                    break;
                case 'assign':
                    createModal('Assign to Employee', `
                        <form class="modal-form">
                            <div class="form-group">
                                <label for="assign-employee">Select Employee</label>
                                <select id="assign-employee" name="employee" required>
                                    <option value="">Choose Employee</option>
                                    <option value="1">John Smith</option>
                                    <option value="2">Sarah Johnson</option>
                                    <option value="3">Michael Wilson</option>
                                </select>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">Assign</button>
                                <button type="button" class="btn btn-secondary modal-close-btn">Cancel</button>
                            </div>
                        </form>
                    `);
                    
                    // Add event listener to form
                    setTimeout(() => {
                        const form = document.querySelector('.modal-form');
                        if (form) {
                            form.addEventListener('submit', function(e) {
                                e.preventDefault();
                                const employeeSelect = this.querySelector('#assign-employee');
                                const employeeText = employeeSelect.options[employeeSelect.selectedIndex].text;
                                
                                removeModal();
                                showNotification(`${selectedRows.length} items assigned to ${employeeText}`, 'success');
                                
                                // Clear selection
                                selectedRows.forEach(row => row.classList.remove('selected'));
                                
                                // Hide batch actions bar
                                const batchActionsBar = parentSection.querySelector('.batch-actions');
                                if (batchActionsBar) {
                                    batchActionsBar.style.display = 'none';
                                }
                            });
                        }
                    }, 100);
                    break;
            }
        });
    });

    // Initial setup - activate first tab
    const firstNavItem = document.querySelector('.sidebar-nav li:first-child');
    if (firstNavItem) {
        firstNavItem.click();
    }
});