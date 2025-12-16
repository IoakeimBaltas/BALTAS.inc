// ==============================
// Cigar Vault - Main JS
// ==============================

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

// Multi-Step Form Elements
const stepIndicators = document.querySelectorAll('.step-dot');
const nextButtons = document.querySelectorAll('.next-btn');
const backButtons = document.querySelectorAll('.back-btn');
const formStepTitle = document.getElementById('form-step-title');
const reviewContent = document.getElementById('review-content');
let currentStep = 1;

// Flavor Wheel Elements
const flavorModal = document.getElementById('flavorModal');
const openFlavorModalBtn = document.getElementById('openFlavorModal');
const closeFlavorModalBtn = document.querySelector('.close-btn');
const saveFlavorsBtn = document.getElementById('saveFlavorsBtn');
const flavorWheelContainer = document.getElementById('flavorWheelContainer');
const flavorProfileInput = document.getElementById('flavorProfile');
const selectedFlavorCountSpan = document.getElementById('selectedFlavorCount');

const FLAVOR_CATEGORIES = [
    'Woody', 'Earthy', 'Spicy', 'Nutty', 'Sweet', 
    'Floral', 'Creamy', 'Leathery', 'Coffee', 'Chocolate',
    'Fruity', 'Herbal', 'Mineral', 'Peppery', 'Toasted'
];

let selectedFlavors = [];
let cigarPhotoBase64 = null;

// ==============================
// Helper Functions
// ==============================

// Initialize star rating system
function initRating() {
    ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            const ratingValue = star.dataset.rating;
            cigarRatingInput.value = ratingValue;
            updateStarDisplay(ratingValue);
        });
        star.addEventListener('mouseover', () => highlightStars(star.dataset.rating));
        star.addEventListener('mouseout', () => updateStarDisplay(cigarRatingInput.value));
    });
}

function updateStarDisplay(rating) {
    ratingStars.forEach(star => {
        star.classList.toggle('filled', parseInt(star.dataset.rating) <= parseInt(rating));
    });
}

function highlightStars(rating) {
    ratingStars.forEach(star => {
        star.classList.toggle('filled', parseInt(star.dataset.rating) <= parseInt(rating));
    });
}

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = e => reject(e);
        reader.readAsDataURL(file);
    });
}

function resetForm() {
    form.reset();
    cigarRatingInput.value = '0';
    updateStarDisplay('0');
    photoPreview.innerHTML = '';
    selectedFlavors = [];
    flavorProfileInput.value = '';
    selectedFlavorCountSpan.textContent = '0';
    cigarPhotoBase64 = null;
    document.querySelectorAll('.flavor-option.selected').forEach(el => el.classList.remove('selected'));
    currentStep = 1;
    updateStepDisplay();
}

// ==============================
// Multi-Step Form
// ==============================

const stepTitles = {
    1: 'Step 1: Cigar Details & Blend',
    2: 'Step 2: Experience & Flavor',
    3: 'Step 3: Notes & Final Review',
    4: 'Step 4: Confirm & Save'
};

function validateStep(step) {
    let isValid = true;
    const stepEl = document.getElementById(`step-${step}`);
    const requiredInputs = stepEl.querySelectorAll('input[required], textarea[required]');
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            isValid = false;
        } else input.style.borderColor = '';
    });
    if (step === 2 && parseInt(cigarRatingInput.value) === 0) {
        isValid = false;
        document.getElementById('rating').style.border = '1px solid red';
        setTimeout(() => { document.getElementById('rating').style.border = 'none'; }, 1000);
    }
    if (!isValid) alert('Please fill out all required fields before proceeding.');
    return isValid;
}

function updateStepDisplay() {
    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
    document.getElementById(`step-${currentStep}`).classList.add('active');

    stepIndicators.forEach(dot => {
        dot.classList.toggle('active', parseInt(dot.dataset.step) <= currentStep);
    });

    formStepTitle.textContent = stepTitles[currentStep];

    if (currentStep === 4) generateReview();
}

function generateReview() {
    const data = {
        'Name': document.getElementById('cigarName').value || 'N/A',
        'Brand': document.getElementById('brand').value || 'N/A',
        'Origin': document.getElementById('origin').value || 'N/A',
        'Wrapper': document.getElementById('wrapper').value || 'N/A',
        'Binder': document.getElementById('binder').value || 'N/A',
        'Filler': document.getElementById('filler').value || 'N/A',
        'Date Smoked': document.getElementById('dateSmoked').value || 'N/A',
        'Size/Gauge': document.getElementById('lengthGauge').value || 'N/A',
        'Duration': document.getElementById('duration').value ? document.getElementById('duration').value + ' mins' : 'N/A',
        'Rating': renderStars(document.getElementById('cigarRating').value),
        'Flavors': selectedFlavors.join(', ') || 'None Selected',
        'Notes': document.getElementById('notes').value || 'No Notes'
    };

    let html = '';
    for (const key in data) {
        if (key !== 'Rating') html += `<div class="review-item"><strong>${key}:</strong> ${data[key]}</div>`;
    }
    const ratingHtml = `<div class="review-item"><strong>Rating:</strong> ${data['Rating']}</div>`;
    let photoHtml = '';
    if (cigarPhotoBase64) photoHtml = `<div class="review-item"><strong>Photo:</strong><div class="review-photo-preview"><img src="${cigarPhotoBase64}" alt="Cigar Photo Review"></div></div>`;
    
    reviewContent.innerHTML = ratingHtml + html + photoHtml;
}

// ==============================
// Flavor Wheel
// ==============================

function renderFlavorWheel() {
    flavorWheelContainer.innerHTML = '';
    FLAVOR_CATEGORIES.forEach(flavor => {
        const option = document.createElement('div');
        option.className = 'flavor-option';
        option.textContent = flavor;
        option.dataset.flavor = flavor;
        if (selectedFlavors.includes(flavor)) option.classList.add('selected');

        option.addEventListener('click', () => {
            option.classList.toggle('selected');
            updateSelectedFlavorsArray();
        });
        flavorWheelContainer.appendChild(option);
    });
    updateSelectedFlavorsArray();
}

function updateSelectedFlavorsArray() {
    selectedFlavors = Array.from(document.querySelectorAll('.flavor-option.selected')).map(el => el.dataset.flavor);
    selectedFlavorCountSpan.textContent = selectedFlavors.length;
}

// ==============================
// Render Cigars
// ==============================

function renderStars(rating) {
    return `<div class="cigar-card-rating">${[1,2,3,4,5].map(i => `<i class="fa-solid fa-star ${i <= rating ? 'filled' : ''}"></i>`).join('')}</div>`;
}

function createCigarCard(cigar) {
    const card = document.createElement('div');
    card.className = 'cigar-card';

    const imageSource = cigar.photoBase64 || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%232c2c2c" d="M0 0h512v512H0z"/><path fill="%23ff7f00" d="M160 160h192v192H160z"/></svg>';
    const flavorArray = cigar.flavorProfile ? cigar.flavorProfile.split(',') : [];
    const flavorDisplay = flavorArray.length > 0 ? `Flavors: ${flavorArray.slice(0,3).join(', ')}${flavorArray.length>3?'...':''}` : 'Flavors: N/A';

    card.innerHTML = `
        <div class="cigar-card-photo"><img src="${imageSource}" alt="${cigar.cigarName} Photo"></div>
        <div class="cigar-card-details">
            <h3>${cigar.cigarName}</h3>
            <p>Brand: ${cigar.brand}</p>
            <p class="flavor-summary">${flavorDisplay}</p>
            ${renderStars(cigar.rating)}
            <div class="info-row"><span>Duration: ${cigar.duration || '--'} mins</span><span>Date: ${cigar.dateSmoked}</span></div>
            <span style="display:none">${cigar.flavorProfile} ${cigar.origin} ${cigar.wrapper}</span>
        </div>
    `;
    return card;
}

function renderCigars(searchTerm = '') {
    const cigars = JSON.parse(localStorage.getItem('cigarVaultCigars')) || [];
    cigarList.innerHTML = '';

    const filtered = cigars.filter(c => {
        const term = searchTerm.toLowerCase();
        return c.cigarName.toLowerCase().includes(term) || c.brand.toLowerCase().includes(term) || (c.flavorProfile && c.flavorProfile.toLowerCase().includes(term));
    });

    if (filtered.length === 0) {
        noCigarsMessage.style.display = 'block';
        cigarList.appendChild(noCigarsMessage);
    } else {
        noCigarsMessage.style.display = 'none';
        filtered.forEach(c => cigarList.appendChild(createCigarCard(c)));
    }
}

// ==============================
// Event Listeners
// ==============================

// Form submit (Step 4)
form.addEventListener('submit', async e => {
    e.preventDefault();
    flavorProfileInput.value = selectedFlavors.join(',');

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
        photoBase64: cigarPhotoBase64
    };

    const cigars = JSON.parse(localStorage.getItem('cigarVaultCigars')) || [];
    cigars.push(newCigar);
    localStorage.setItem('cigarVaultCigars', JSON.stringify(cigars));

    renderCigars();
    resetForm();
    alert('Cigar successfully logged!');
});

// Step navigation
nextButtons.forEach(btn => btn.addEventListener('click', () => {
    const target = parseInt(btn.dataset.targetStep);
    if (validateStep(currentStep)) {
        currentStep = target;
        updateStepDisplay();
    }
}));

backButtons.forEach(btn => btn.addEventListener('click', () => {
    currentStep = parseInt(btn.dataset.targetStep);
    updateStepDisplay();
}));

// Photo upload
photoFileInput.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (file) {
        cigarPhotoBase64 = await readFileAsBase64(file);
        photoPreview.innerHTML = `<img src="${cigarPhotoBase64}" alt="Cigar Photo Preview">`;
    } else {
        cigarPhotoBase64 = null;
        photoPreview.innerHTML = '';
    }
});

// View toggle
listViewToggle.addEventListener('click', () => {
    cigarList.classList.replace('grid-view','list-view');
    listViewToggle.classList.add('active');
    gridViewToggle.classList.remove('active');
});
gridViewToggle.addEventListener('click', () => {
    cigarList.classList.replace('list-view','grid-view');
    gridViewToggle.classList.add('active');
    listViewToggle.classList.remove('active');
});

// Search
searchInput.addEventListener('input', e => renderCigars(e.target.value));

// Flavor modal
openFlavorModalBtn.addEventListener('click', () => {
    renderFlavorWheel();
    flavorModal.style.display = 'block';
});
closeFlavorModalBtn.addEventListener('click', () => flavorModal.style.display = 'none');
saveFlavorsBtn.addEventListener('click', () => flavorModal.style.display = 'none');
window.addEventListener('click', e => { if(e.target === flavorModal) flavorModal.style.display='none'; });

// ==============================
// Initialization
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    initRating();
    renderCigars();
    updateStepDisplay();
    initRedGridBackground(); // Initialize the background here
});

// ==============================
// Interactive Red Grid Background
// ==============================
function initRedGridBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'htb-bg';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = -1;
    canvas.style.pointerEvents = 'none';
    canvas.style.backgroundColor = '#0b0b0b';

    let mouse = { x: null, y: null };

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    const gridSize = 40;
    const glowRadius = 300;

    function drawGrid() {
        ctx.clearRect(0, 0, width, height);

        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
                let alpha = 0.05;

                if (mouse.x !== null) {
                    const dx = x - mouse.x;
                    const dy = y - mouse.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < glowRadius) {
                        alpha = 0.5 * (1 - dist / glowRadius) + 0.1;
                    }
                }

                ctx.strokeStyle = `rgba(255, 50, 50, ${alpha})`;
                ctx.lineWidth = 1.5;
                ctx.strokeRect(x, y, gridSize, gridSize);
            }
        }
    }

    function animate() {
        drawGrid();
        requestAnimationFrame(animate);
    }

    animate();
}
