// --- Global Variables --- 
const form = document.getElementById('new-cigar-form');
const cigarList = document.getElementById('cigarList');
const ratingStars = document.querySelectorAll('.rating i');
const cigarRatingInput = document.getElementById('cigarRating');
const photoFileInput = document.getElementById('photoFile');
const photoPreview = document.getElementById('photoPreview');
const noCigarsMessage = document.getElementById('noCigarsMessage');
const listViewToggle = document.getElementById('listViewToggle');
const gridViewToggle = document.getElementById('gridViewToggle');
const searchInput = document.getElementById('searchCigars');

// MULTI-STEP ELEMENTS
const stepIndicators = document.querySelectorAll('.step-dot');
const nextButtons = document.querySelectorAll('.next-btn');
const backButtons = document.querySelectorAll('.back-btn');
const formStepTitle = document.getElementById('form-step-title');
const reviewContent = document.getElementById('review-content');
let currentStep = 1;

// FLAVOR WHEEL ELEMENTS
const flavorModal = document.getElementById('flavorModal');
const openFlavorModalBtn = document.getElementById('openFlavorModal');
const closeFlavorModalBtn = document.querySelector('.close-btn');
const saveFlavorsBtn = document.getElementById('saveFlavorsBtn');
const flavorWheelContainer = document.getElementById('flavorWheelContainer');
const flavorProfileInput = document.getElementById('flavorProfile');
const selectedFlavorCountSpan = document.getElementById('selectedFlavorCount');

// Predefined Flavor Categories
const FLAVOR_CATEGORIES = [
    'Woody', 'Earthy', 'Spicy', 'Nutty', 'Sweet', 
    'Floral', 'Creamy', 'Leathery', 'Coffee', 'Chocolate',
    'Fruity', 'Herbal', 'Mineral', 'Peppery', 'Toasted'
];

let selectedFlavors = []; 
let cigarPhotoBase64 = null; 

// --- Helper Functions ---

/**
 * Initializes the star rating functionality.
 */
function initRating() {
    ratingStars.forEach(star => {
        star.addEventListener('click', (e) => {
            const ratingValue = e.target.getAttribute('data-rating');
            cigarRatingInput.value = ratingValue;
            updateStarDisplay(ratingValue);
        });
        
        star.addEventListener('mouseover', (e) => {
            const hoverValue = e.target.getAttribute('data-rating');
            highlightStars(hoverValue);
        });

        star.addEventListener('mouseout', () => {
            updateStarDisplay(cigarRatingInput.value);
        });
    });
}

/**
 * Visually updates the stars based on a given rating value.
 * @param {string} rating - The rating value (1-5).
 */
function updateStarDisplay(rating) {
    ratingStars.forEach(star => {
        if (parseInt(star.getAttribute('data-rating')) <= parseInt(rating)) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
}

/**
 * Highlights stars on hover.
 * @param {string} hoverValue - The star value currently being hovered over.
 */
function highlightStars(hoverValue) {
    ratingStars.forEach(star => {
        if (parseInt(star.getAttribute('data-rating')) <= parseInt(hoverValue)) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
}

/**
 * Handles the photo file upload and converts it to a base64 string for saving.
 * @param {File} file - The file object from the input.
 * @returns {Promise<string|null>} A promise that resolves to the base64 string or null.
 */
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

/**
 * Clears the form and resets the UI elements.
 */
function resetForm() {
    form.reset();
    cigarRatingInput.value = '0';
    updateStarDisplay('0');
    photoPreview.innerHTML = '';
    
    // Reset flavor and photo selection
    selectedFlavors = [];
    flavorProfileInput.value = '';
    selectedFlavorCountSpan.textContent = '0';
    cigarPhotoBase64 = null; 
    
    document.querySelectorAll('.flavor-option.selected').forEach(el => {
        el.classList.remove('selected');
    });

    // Reset to Step 1
    currentStep = 1;
    updateStepDisplay();
}

// --- Multi-Step Form Functions ---

const stepTitles = {
    1: 'Step 1: Cigar Details & Blend',
    2: 'Step 2: Experience & Flavor',
    3: 'Step 3: Notes & Final Review',
    4: 'Step 4: Confirm & Save'
};

/**
 * Validates required fields for the current step before proceeding.
 * @param {number} step - The current step number.
 * @returns {boolean} True if validation passes, False otherwise.
 */
function validateStep(step) {
    let isValid = true;
    const currentStepEl = document.getElementById(`step-${step}`);
    
    // Select only *visible* required inputs within the current step
    const requiredInputs = currentStepEl.querySelectorAll('input:not([type="hidden"])[required], textarea[required]');
    
    requiredInputs.forEach(input => {
        if (input.value.trim() === '') {
            isValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
    });

    // Specific validation for Rating (Step 2)
    if (step === 2 && parseInt(cigarRatingInput.value) === 0) {
        isValid = false;
        // Highlight the rating area
        document.getElementById('rating').style.border = '1px solid red';
        setTimeout(() => { document.getElementById('rating').style.border = 'none'; }, 1000);
    }

    if (!isValid) {
        alert('Please fill out all required fields before proceeding.');
    }
    return isValid;
}

/**
 * Updates the visibility of the form steps and the step indicators.
 */
function updateStepDisplay() {
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(`step-${currentStep}`).classList.add('active');

    stepIndicators.forEach(dot => {
        const stepNum = parseInt(dot.getAttribute('data-step'));
        dot.classList.remove('active');
        if (stepNum <= currentStep) {
            dot.classList.add('active');
        }
    });
    
    formStepTitle.textContent = stepTitles[currentStep];

    if (currentStep === 4) {
        generateReview();
    }
}

/**
 * Gathers data from the form and generates the final review content HTML.
 */
function generateReview() {
    // Collect all data points 
    const data = {
        'Name': document.getElementById('cigarName').value || 'N/A',
        'Brand': document.getElementById('brand').value || 'N/A',
        'Origin': document.getElementById('origin').value || 'N/A',
        'Wrapper': document.getElementById('wrapper').value || 'N/A',
        'Binder': document.getElementById('binder').value || 'N/A',
        'Filler': document.getElementById('filler').value || 'N/A',
        'Date Smoked': document.getElementById('dateSmoked').value || 'N/A',
        'Size/Gauge': document.getElementById('lengthGauge').value || 'N/A',
        'Duration': (document.getElementById('duration').value ? document.getElementById('duration').value + ' mins' : 'N/A'),
        'Rating': renderStars(document.getElementById('cigarRating').value),
        'Flavors': selectedFlavors.join(', ') || 'None Selected',
        'Notes': document.getElementById('notes').value || 'No Notes'
    };
    
    let html = '';
    // Build the list of review items
    for (const key in data) {
        if (key !== 'Rating') {
             html += `
                <div class="review-item">
                    <strong>${key}:</strong> ${data[key]}
                </div>
            `;
        }
    }
    
    // Add Rating and Photo Preview
    const ratingHtml = `<div class="review-item"><strong>Rating:</strong> ${data['Rating']}</div>`;
    
    let photoHtml = '';
    if (cigarPhotoBase64) {
        photoHtml = `
            <div class="review-item">
                <strong>Photo:</strong>
                <div class="review-photo-preview">
                    <img src="${cigarPhotoBase64}" alt="Cigar Photo Review">
                </div>
            </div>
        `;
    }

    reviewContent.innerHTML = ratingHtml + html + photoHtml;
}


// --- Flavor Wheel Functions (Unchanged) ---

function renderFlavorWheel() {
    flavorWheelContainer.innerHTML = '';
    FLAVOR_CATEGORIES.forEach(flavor => {
        const option = document.createElement('div');
        option.classList.add('flavor-option');
        option.textContent = flavor;
        option.setAttribute('data-flavor', flavor);
        
        if (selectedFlavors.includes(flavor)) {
            option.classList.add('selected');
        }

        option.addEventListener('click', () => {
            option.classList.toggle('selected');
            updateSelectedFlavorsArray();
        });
        flavorWheelContainer.appendChild(option);
    });
    updateSelectedFlavorsArray(); 
}

function updateSelectedFlavorsArray() {
    selectedFlavors = Array.from(document.querySelectorAll('.flavor-option.selected'))
                          .map(el => el.getAttribute('data-flavor'));
    
    selectedFlavorCountSpan.textContent = selectedFlavors.length;
}


// --- Main Logic Functions (Mostly Unchanged) ---

function renderStars(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        const filledClass = i <= rating ? 'filled' : '';
        starsHtml += `<i class="fa-solid fa-star ${filledClass}"></i>`;
    }
    return `<div class="cigar-card-rating">${starsHtml}</div>`;
}

function createCigarCard(cigar) {
    const card = document.createElement('div');
    card.classList.add('cigar-card');
    
    const imageSource = cigar.photoBase64 || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%232c2c2c" d="M0 0h512v512H0z"/><path fill="%23ff7f00" d="M160 160h192v192H160z"/></svg>';
    
    const flavorArray = cigar.flavorProfile ? cigar.flavorProfile.split(',') : [];
    const flavorDisplay = flavorArray.length > 0 ? 
        `Flavors: ${flavorArray.slice(0, 3).join(', ')}${flavorArray.length > 3 ? '...' : ''}` : 
        'Flavors: N/A';

    card.innerHTML = `
        <div class="cigar-card-photo">
            <img src="${imageSource}" alt="${cigar.cigarName} Photo">
        </div>
        <div class="cigar-card-details">
            <h3>${cigar.cigarName}</h3>
            <p>Brand: ${cigar.brand}</p>
            <p class="flavor-summary">${flavorDisplay}</p>
            ${renderStars(cigar.rating)}
            <div class="info-row">
                <span>Duration: ${cigar.duration || '--'} mins</span>
                <span>Date: ${cigar.dateSmoked}</span>
            </div>
            <span style="display:none">${cigar.flavorProfile} ${cigar.origin} ${cigar.wrapper}</span>
        </div>
    `;
    return card;
}

function renderCigars(searchTerm = '') {
    const cigars = JSON.parse(localStorage.getItem('cigarVaultCigars')) || [];
    cigarList.innerHTML = ''; 

    const filteredCigars = cigars.filter(cigar => {
        const searchLower = searchTerm.toLowerCase();
        return cigar.cigarName.toLowerCase().includes(searchLower) || 
               cigar.brand.toLowerCase().includes(searchLower) ||
               (cigar.flavorProfile && cigar.flavorProfile.toLowerCase().includes(searchLower));
    });

    if (filteredCigars.length === 0) {
        noCigarsMessage.style.display = 'block';
        cigarList.appendChild(noCigarsMessage);
    } else {
        noCigarsMessage.style.display = 'none';
        filteredCigars.forEach(cigar => {
            cigarList.appendChild(createCigarCard(cigar));
        });
    }
}


// --- Event Listeners ---

// 1. Form Submission (Only happens on Step 4)
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Final flavor update before saving
    flavorProfileInput.value = selectedFlavors.join(',');

    const photoBase64 = cigarPhotoBase64; 

    const newCigar = {
        id: Date.now(), 
        cigarName: document.getElementById('cigarName').value,
        brand: document.getElementById('brand').value,
        origin: document.getElementById('origin').value,
        wrapper: document.getElementById('wrapper').value,
        binder: document.getElementById('binder').value,
        filler: document.getElementById('filler').value,
        dateSmoked: document.getElementById('dateSmoked').value,
        lengthGauge: document.getElementById('lengthGauge').value,
        duration: document.getElementById('duration').value,
        rating: document.getElementById('cigarRating').value,
        flavorProfile: flavorProfileInput.value, 
        notes: document.getElementById('notes').value,
        photoBase64: photoBase64 
    };

    const cigars = JSON.parse(localStorage.getItem('cigarVaultCigars')) || [];
    cigars.push(newCigar);
    
    localStorage.setItem('cigarVaultCigars', JSON.stringify(cigars));

    renderCigars();
    resetForm();
    alert('Cigar successfully logged!');
});

// 2. Step Navigation Buttons 
nextButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetStep = parseInt(button.getAttribute('data-target-step'));
        
        if (validateStep(currentStep)) {
            currentStep = targetStep;
            updateStepDisplay();
        }
    });
});

backButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetStep = parseInt(button.getAttribute('data-target-step'));
        currentStep = targetStep;
        updateStepDisplay();
    });
});

// 3. Photo Preview and Base64 Storage
photoFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const base64Url = await readFileAsBase64(file);
        cigarPhotoBase64 = base64Url; 
        photoPreview.innerHTML = `<img src="${base64Url}" alt="Cigar Photo Preview">`;
    } else {
        cigarPhotoBase64 = null;
        photoPreview.innerHTML = '';
    }
});

// 4. Other Event Listeners (View Toggle, Search, Modal) - Unchanged
listViewToggle.addEventListener('click', () => {
    cigarList.classList.remove('grid-view');
    cigarList.classList.add('list-view');
    listViewToggle.classList.add('active');
    gridViewToggle.classList.remove('active');
});

gridViewToggle.addEventListener('click', () => {
    cigarList.classList.remove('list-view');
    cigarList.classList.add('grid-view');
    listViewToggle.classList.remove('active');
    gridViewToggle.classList.add('active');
});

searchInput.addEventListener('input', (e) => {
    renderCigars(e.target.value);
});

openFlavorModalBtn.addEventListener('click', () => {
    renderFlavorWheel();
    flavorModal.style.display = 'block';
});

closeFlavorModalBtn.addEventListener('click', () => {
    flavorModal.style.display = 'none';
});

saveFlavorsBtn.addEventListener('click', () => {
    flavorModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === flavorModal) {
        flavorModal.style.display = 'none';
    }
});


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initRating(); 
    renderCigars();
    updateStepDisplay(); 
});