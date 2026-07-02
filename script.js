// --- Presentation State & Configuration ---
let currentSlideIndex = 0;
const slides = Array.from(document.querySelectorAll('.slide'));
const totalSlides = slides.length;

// --- Elements ---
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnMenu = document.getElementById('btnMenu');
const btnTheme = document.getElementById('btnTheme');
const btnFullscreen = document.getElementById('btnFullscreen');
const slideNumIndicator = document.getElementById('slideNum');
const progressBar = document.getElementById('progressBar');
const progressBarContainer = document.getElementById('progressBarContainer');

const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarDrawer = document.querySelector('.sidebar-drawer');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarList = document.getElementById('sidebarList');
const presentationContainer = document.getElementById('presentation');

// --- Interactive QA Data for Slide 19 ---
const qaData = [
  {
    title: "1. Incorrect Answer Key",
    description: "Most common error. TAs must verify keys. Ensure if multiple choices are correct, the question type is configured as MSQ (Multiple Select Question).",
    wrongLabel: "❌ Buggy Configuration",
    wrongContent: "<strong>Question:</strong> Which of the following are prime numbers?<br>Options: (a) 2 (b) 3 (c) 10 (d) 15<br><span style='color: var(--danger); font-weight: 600;'>Key marked on Portal: Only (a)</span><br><br><em>Result: Students selecting (b) are marked incorrect.</em>",
    correctLabel: "✅ Best Practice",
    correctContent: "<strong>Question:</strong> Which of the following are prime numbers?<br>Options: (a) 2 (b) 3 (c) 10 (d) 15<br><span style='color: var(--success); font-weight: 600;'>Key marked on Portal: (a) AND (b) (MSQ Mode)</span><br><br><em>Advice: Ask a second TA to solve and verify keys before going live!</em>"
  },
  {
    title: "2. Missing Correct Option",
    description: "Typos or modifications in choices leading to question sheets lacking any correct options.",
    wrongLabel: "❌ Buggy Configuration",
    wrongContent: "<strong>Question:</strong> Which of the following are prime numbers?<br>Options: (a) 4 (b) 6 (c) 10 (d) 1S<br><span style='color: var(--danger); font-weight: 600;'>Key marked: (d) [Typo: 1S instead of 15, and 15 is composite anyway!]</span><br><br><em>Result: Question becomes invalid.</em>",
    correctLabel: "✅ Best Practice",
    correctContent: "<strong>Question:</strong> Which of the following are prime numbers?<br>Options: (a) 2 (b) 4 (c) 6 (d) 10<br><span style='color: var(--success); font-weight: 600;'>Key marked: (a)</span><br><br><em>Advice: TAs must check spelling and run mathematical calculations in full.</em>"
  },
  {
    title: "3. Overuse of All/None",
    description: "Using 'All' or 'None' as filler options creates semantic ambiguity, especially combined with 'AND' logic.",
    wrongLabel: "❌ Bad Pedagogy",
    wrongContent: "<strong>Question:</strong> Which of the following are prime numbers?<br>Options: (a) 2 (b) 3 (c) All of the above (d) None<br><br><em>Confusion: If both (a) and (b) are correct, (c) 'All of the above' is technically false (10 and 15 are not prime). Avoid fillers!</em>",
    correctLabel: "✅ Best Practice",
    correctContent: "<strong>Question:</strong> Which of the following are prime numbers?<br>Options: (a) 2 and 3 (b) 3 and 10 (c) 10 and 15 (d) None of the above<br><br><em>Advice: Use 'All' or 'None' strictly for pedagogical reasons, never as a replacement for high-quality options.</em>"
  },
  {
    title: "4. Numerical Exactness",
    description: "Floating-point calculator variations result in exact-type math answers failing for correct students.",
    wrongLabel: "❌ Buggy Configuration",
    wrongContent: "<strong>Question:</strong> The value of sin(&pi;) is:<br>Answer configured: <code>0</code> (Exact Match Type)<br><br><em>Failure: A student entering <code>0.0001</code> (using 3.1415 in their calculator) gets marked wrong.</em>",
    correctLabel: "✅ Best Practice",
    correctContent: "<strong>Question:</strong> The value of sin(&pi;) is:<br>Answer configured: <span style='color: var(--success); font-weight: 600;'>Range: -0.001 to 0.001</span><br><br><em>Advice: Set tolerances based on acceptable errors to account for rounding.</em>"
  },
  {
    title: "5. Ambiguity",
    description: "Using qualifiers like 'most' or 'some' makes questions subjective and confusing.",
    wrongLabel: "❌ Ambiguous Style",
    wrongContent: "<strong>Question:</strong> Which number is not identified as prime by most students?<br>Options: (a) 2 (b) 3 (c) 10 (d) 15<br><br><em>Confusion: 'Most' is subjective, and students might guess 15 based on personal experience.</em>",
    correctLabel: "✅ Best Practice",
    correctContent: "<strong>Question:</strong> Which of the following is a composite number?<br>Options: (a) 2 (b) 3 (c) 17 (d) 15<br><span style='color: var(--success); font-weight: 600;'>Key marked: (d)</span><br><br><em>Advice: Keep questions objective and scientifically rigorous.</em>"
  },
  {
    title: "6. Text Auto-grader",
    description: "Text matches are fragile. Capitalization, spacing, or complex structure (e.g. vectors) should be handled via Regex or Question Groups.",
    wrongLabel: "❌ Fragile Match",
    wrongContent: "<strong>Example 1:</strong> Capital of India?<br>Key: <code>New Delhi</code> (Fails on extra spaces)<br><strong>Example 2:</strong> Vector multiplication: v = 2*[1 2 3]?<br>Key: <code>{2 , 4 , 6}</code> (Fails on minor syntax changes)",
    correctLabel: "✅ Best Practice",
    correctContent: "<strong>Regex Answer:</strong> <code>(?i)^new\\s+delhi$</code> (tolerates spacing/cases)<br><strong>For Vectors:</strong> Use <strong>Question Groups</strong>:<br>1. Value of v(1) is: <code>2</code><br>2. Value of v(3) is: <code>6</code>"
  }
];

// --- Initialize Slides & Router ---
function initSlides() {
  // Parse hash URL if present
  const hash = window.location.hash;
  if (hash && hash.startsWith('#slide-')) {
    const slideNum = parseInt(hash.replace('#slide-', ''), 10);
    if (slideNum >= 1 && slideNum <= totalSlides) {
      currentSlideIndex = slideNum - 1;
    }
  }
  
  showSlide(currentSlideIndex);
  buildSidebarList();
  renderQATab(0);
}

// --- Render Slide ---
function showSlide(index) {
  // Bound check
  if (index < 0) index = 0;
  if (index >= totalSlides) index = totalSlides - 1;
  
  // Previous slide tracking for transitions
  const prevActive = document.querySelector('.slide.active');
  if (prevActive) {
    prevActive.classList.remove('active');
    prevActive.classList.add('prev');
    // Clean up prev class after transition
    setTimeout(() => {
      prevActive.classList.remove('prev');
    }, 500);
  }
  
  // Active slide
  currentSlideIndex = index;
  slides.forEach((slide, i) => {
    if (i === currentSlideIndex) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  // Update controls
  btnPrev.disabled = currentSlideIndex === 0;
  btnNext.disabled = currentSlideIndex === totalSlides - 1;
  slideNumIndicator.textContent = `${currentSlideIndex + 1} / ${totalSlides}`;
  
  // Progress Bar
  const progressPercent = ((currentSlideIndex + 1) / totalSlides) * 100;
  progressBar.style.width = `${progressPercent}%`;

  // Update URL Hash without jumping scroll
  history.replaceState(null, null, `#slide-${currentSlideIndex + 1}`);

  // Highlight active sidebar item
  document.querySelectorAll('.sidebar-item').forEach((item, i) => {
    if (i === currentSlideIndex) {
      item.classList.add('active');
      // Scroll into view inside sidebar
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else {
      item.classList.remove('active');
    }
  });
}

// --- Navigation actions ---
function nextSlide() {
  if (currentSlideIndex < totalSlides - 1) {
    showSlide(currentSlideIndex + 1);
  }
}

function prevSlide() {
  if (currentSlideIndex > 0) {
    showSlide(currentSlideIndex - 1);
  }
}

// --- Sidebar drawer ---
function toggleSidebar() {
  const isOpen = sidebarOverlay.classList.contains('open');
  if (isOpen) {
    sidebarOverlay.classList.remove('open');
  } else {
    sidebarOverlay.classList.add('open');
  }
}

function buildSidebarList() {
  sidebarList.innerHTML = '';
  slides.forEach((slide, index) => {
    let title = "Slide " + (index + 1);
    
    // Attempt to extract slide title
    const headerTitle = slide.querySelector('.slide-title');
    const coverTitle = slide.querySelector('h1');
    const sectionTitle = slide.querySelector('.slide-section h2');
    
    if (headerTitle) {
      title = headerTitle.textContent.trim();
    } else if (coverTitle) {
      title = coverTitle.textContent.trim();
    } else if (sectionTitle) {
      title = sectionTitle.textContent.trim();
    }

    const item = document.createElement('div');
    item.className = `sidebar-item ${index === currentSlideIndex ? 'active' : ''}`;
    item.innerHTML = `
      <span class="sidebar-item-num">${index + 1}</span>
      <span class="sidebar-item-title" title="${title}">${title}</span>
    `;
    item.addEventListener('click', () => {
      showSlide(index);
      toggleSidebar();
    });
    sidebarList.appendChild(item);
  });
}

// --- Fullscreen API ---
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    presentationContainer.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

// --- Theme Management ---
function initTheme() {
  const savedTheme = localStorage.getItem('presentation-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('presentation-theme', newTheme);
}

// --- Render Slide 19 QA Interactive Content ---
window.switchQATab = function(tabIndex) {
  // Update Tab buttons active class
  const buttons = document.querySelectorAll('.qa-tab-btn');
  buttons.forEach((btn, idx) => {
    if (idx === tabIndex) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderQATab(tabIndex);
};

function renderQATab(tabIndex) {
  const data = qaData[tabIndex];
  const qaContent = document.getElementById('qaContent');
  if (!qaContent) return;

  qaContent.innerHTML = `
    <div class="qa-pane" style="flex: 1.2;">
      <div style="font-size: 0.95rem; font-weight: 500; margin-bottom: 12px; color: var(--text-primary);">
        <strong>Scenario:</strong> ${data.description}
      </div>
      <div class="split-layout" style="gap: 15px; grid-template-columns: 1fr 1fr; flex: 1;">
        <div class="qa-box wrong">
          <div class="qa-header-label wrong">
            <span>⚠️</span> ${data.wrongLabel}
          </div>
          <div style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary);">
            ${data.wrongContent}
          </div>
        </div>
        
        <div class="qa-box correct">
          <div class="qa-header-label correct">
            <span>✨</span> ${data.correctLabel}
          </div>
          <div style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary);">
            ${data.correctContent}
          </div>
        </div>
      </div>
    </div>
    
    <div class="qa-pane" style="flex: 0.8; justify-content: center;">
      <div class="qa-explanation">
        <strong style="color: var(--primary); display: block; margin-bottom: 5px;">Quality Control Tip:</strong>
        <p style="font-size: 0.85rem; line-height: 1.5; margin: 0; color: var(--text-secondary);">
          Errors in weekly assignments lead to heavy rescoring charges (Rs. 25,000+ per week) and diminish student confidence. Always run independent TA verifications on the live platform before publication.
        </p>
      </div>
    </div>
  `;
}

// --- Event Listeners ---
btnPrev.addEventListener('click', prevSlide);
btnNext.addEventListener('click', nextSlide);
btnMenu.addEventListener('click', toggleSidebar);
sidebarClose.addEventListener('click', toggleSidebar);
sidebarOverlay.addEventListener('click', (e) => {
  if (e.target === sidebarOverlay) toggleSidebar();
});
btnTheme.addEventListener('click', toggleTheme);
btnFullscreen.addEventListener('click', toggleFullscreen);

// Click on progress bar to jump to slide
progressBarContainer.addEventListener('click', (e) => {
  const rect = progressBarContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percentage = clickX / rect.width;
  const targetIndex = Math.min(Math.floor(percentage * totalSlides), totalSlides - 1);
  showSlide(targetIndex);
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
  // If user is focused on interactive elements like inputs, don't hijack keys
  if (['INPUT', 'TEXTAREA', 'BUTTON'].includes(document.activeElement.tagName)) {
    return;
  }

  switch(e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
    case ' ':
    case 'PageDown':
      e.preventDefault();
      nextSlide();
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
    case 'PageUp':
    case 'Backspace':
      e.preventDefault();
      prevSlide();
      break;
    case 'Home':
      e.preventDefault();
      showSlide(0);
      break;
    case 'End':
      e.preventDefault();
      showSlide(totalSlides - 1);
      break;
    case 'f':
    case 'F':
      e.preventDefault();
      toggleFullscreen();
      break;
    case 'm':
    case 'M':
      e.preventDefault();
      toggleSidebar();
      break;
    case 't':
    case 'T':
      e.preventDefault();
      toggleTheme();
      break;
  }
});

// Touch Swipe Navigation (Mobile support)
let touchStartX = 0;
let touchEndX = 0;

presentationContainer.addEventListener('touchstart', (e) => {
  // Ignore if within scrollable sections or interactive panel
  if (e.target.closest('.qa-playground') || e.target.closest('.sidebar-drawer')) return;
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

presentationContainer.addEventListener('touchend', (e) => {
  if (e.target.closest('.qa-playground') || e.target.closest('.sidebar-drawer')) return;
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const threshold = 50; // swipe length in pixels
  if (touchEndX < touchStartX - threshold) {
    nextSlide(); // swipe left
  }
  if (touchEndX > touchStartX + threshold) {
    prevSlide(); // swipe right
  }
}

// Initialize on Load
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSlides();
});
