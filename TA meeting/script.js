document.addEventListener('DOMContentLoaded', () => {

// --- Slide 19 Interactive QA Data & Renderers ---
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
      wrongContent: "<strong>Question:</strong> Which of the following are prime numbers?<br>Options: (a) 2 (b) 3 (c) All of the above (d) None<br><br><em style='color: var(--danger);'>Bad Pedagogy: Avoid using 'All/None' just because you don't have a good 3rd or 4th choice! It acts as a lazy filler and creates logical confusion.</em>",
      correctLabel: "✅ Best Practice",
      correctContent: "<strong>Question:</strong> Which of the following are prime numbers?<br>Options: (a) 2 and 3 (b) 3 and 9 (c) 9 and 15 (d) 10 and 15<br><br><em>Advice: Use 'All' or 'None' ONLY for pedagogical reasons. Avoid using 'AND' and 'None' in the same question. Group options creatively to test real knowledge!</em>"
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
      wrongContent: "<strong>Question:</strong> Which number is not identified as prime by most students?<br>Options: (a) 2 (b) 3 (c) 10 (d) 15<br><br><em style='color: var(--danger);'>Bad Pedagogy: Testing mind-reading instead of math! 'Most/some' makes it subjective. Also, students may select 10 or 15 simply based on their own personal experience of knowing they aren't prime.</em>",
      correctLabel: "✅ Best Practice",
      correctContent: "<strong>Question:</strong> Which of the following is the only even prime number?<br>Options: (a) 2 (b) 4 (c) 6 (d) 8<br><span style='color: var(--success); font-weight: 600;'>Key marked: (a)</span><br><br><em>Advice: Keep questions objective, direct, and factual. Never rely on subjective qualifiers like 'most' or 'some'.</em>"
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

  window.switchQATab = function(tabIndex) {
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


  // Slide Selectors
  const slides = Array.from(document.querySelectorAll('.slide'));
  const totalSlides = slides.length;
  let currentSlideIndex = 1;

  // Controls UI Selectors
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnTheme = document.getElementById('btnTheme');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const btnMenu = document.getElementById('btnMenu');
  
  const slideNum = document.getElementById('slideNum');
  const progressBar = document.getElementById('progressBar');
  const progressBarContainer = document.getElementById('progressBarContainer');
  
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarDrawer = document.getElementById('sidebarDrawer');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebarList = document.getElementById('sidebarList');

  // Initialize
  initPresentation();

  function initPresentation() {
    // 1. Build TOC Drawer Items dynamically
    buildSidebarMenu();

    // 2. Load from Hash URL state
    handleHashChange();

    // 3. Register Event Listeners
    window.addEventListener('hashchange', handleHashChange);
    
    // Bottom Controls click events
    btnPrev.addEventListener('click', prevSlide);
    btnNext.addEventListener('click', nextSlide);
    btnTheme.addEventListener('click', toggleTheme);
    btnFullscreen.addEventListener('click', toggleFullscreen);
    btnMenu.addEventListener('click', openMenu);
    
    // Sidebar drawer close events
    sidebarClose.addEventListener('click', closeMenu);
    sidebarOverlay.addEventListener('click', (e) => {
      if (e.target === sidebarOverlay) closeMenu();
    });

    // Keyboard bindings
    document.addEventListener('keydown', handleKeyDown);

    // Mobile Swipes
    setupSwipeListeners();

    // Progress Bar click navigation
    progressBarContainer.addEventListener('click', handleProgressBarClick);

    // Load initial Theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateLogoTheme(savedTheme);
    
    // 4. Setup Interactive Playground Simulators
    setupInteractivePlaygrounds();

    // 5. Setup dynamic initials placeholder avatars
    setupPlaceholderAvatars();

    // 6. Setup dynamic 16:9 fullscreen/responsive scaling
    setupWidescreenScaling();

    // 7. Render initial QA tab content
    renderQATab(0);
  }

  // Build Sidebar Table of Contents Menu
  function buildSidebarMenu() {
    sidebarList.innerHTML = '';
    slides.forEach((slide, idx) => {
      const titleSpan = slide.querySelector('.slide-title');
      const coverH1 = slide.querySelector('.slide-cover h1');
      const sectionH2 = slide.querySelector('.slide-section h2');
      
      let title = `Slide ${idx + 1}`;
      if (titleSpan) {
        title = titleSpan.textContent.strip ? titleSpan.textContent.strip() : titleSpan.textContent.trim();
      } else if (coverH1) {
        title = coverH1.textContent.trim();
      } else if (sectionH2) {
        title = sectionH2.textContent.trim();
      }

      const item = document.createElement('div');
      item.className = 'sidebar-item';
      item.innerHTML = `
        <span class="sidebar-item-num">${String(idx + 1).padStart(2, '0')}</span>
        <span class="sidebar-item-title">${title}</span>
      `;
      item.addEventListener('click', () => {
        goToSlide(idx + 1);
        closeMenu();
      });
      sidebarList.appendChild(item);
    });
  }

  // Handle URL hashes change (e.g. #slide-5)
  function handleHashChange() {
    const hash = window.location.hash;
    const match = hash.match(/^#slide-(\d+)$/);
    if (match) {
      const targetIndex = parseInt(match[1], 10);
      if (targetIndex >= 1 && targetIndex <= totalSlides) {
        goToSlide(targetIndex, false);
        return;
      }
    }
    // Fallback: go to first slide
    goToSlide(1, true);
  }

  // Main Navigation Driver
  function goToSlide(index, updateHash = true) {
    if (index < 1 || index > totalSlides) return;
    
    // Set Classes for transitions
    slides.forEach((slide, idx) => {
      const slideNum = idx + 1;
      slide.classList.remove('active', 'prev');
      
      if (slideNum === index) {
        slide.classList.add('active');
      } else if (slideNum < index) {
        slide.classList.add('prev');
      }
    });

    currentSlideIndex = index;
    
    // Update Controls & UI
    updateUIControls();

    // Update Hash URL
    if (updateHash) {
      window.location.hash = `#slide-${currentSlideIndex}`;
    }
  }

  function nextSlide() {
    if (currentSlideIndex < totalSlides) {
      goToSlide(currentSlideIndex + 1);
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 1) {
      goToSlide(currentSlideIndex - 1);
    }
  }

  // Update UI components (navigation active states, progress bar, counters)
  function updateUIControls() {
    // Disable buttons at boundaries
    btnPrev.disabled = (currentSlideIndex === 1);
    btnNext.disabled = (currentSlideIndex === totalSlides);
    
    // Slide count label
    slideNum.textContent = `${currentSlideIndex} / ${totalSlides}`;
    
    // Progress Bar width
    const percentage = ((currentSlideIndex - 1) / (totalSlides - 1)) * 100;
    progressBar.style.width = `${percentage}%`;

    // Highlight active and visited sidebar items
    const sidebarItems = Array.from(sidebarList.querySelectorAll('.sidebar-item'));
    sidebarItems.forEach((item, idx) => {
      item.classList.remove('active', 'visited');
      if (idx + 1 === currentSlideIndex) {
        item.classList.add('active');
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else if (idx + 1 < currentSlideIndex) {
        item.classList.add('visited');
      }
    });
  }

  // Keyboard controls
  function handleKeyDown(e) {
    // Stop presentation keyboard hooks in active input fields (e.g. textareas)
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'Space':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'Backspace':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(1);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides);
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'm':
      case 'M':
        e.preventDefault();
        if (sidebarOverlay.classList.contains('open')) {
          closeMenu();
        } else {
          openMenu();
        }
        break;
      case 't':
      case 'T':
        e.preventDefault();
        toggleTheme();
        break;
    }
  }

  // Theme Toggler
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateLogoTheme(newTheme);
  }

  function updateLogoTheme(theme) {
    const logoLight = document.querySelector('.logo-light');
    const logoDark = document.querySelector('.logo-dark');
    if (logoLight && logoDark) {
      if (theme === 'dark') {
        logoLight.style.setProperty('display', 'none', 'important');
        logoDark.style.setProperty('display', 'inline-block', 'important');
      } else {
        logoLight.style.setProperty('display', 'inline-block', 'important');
        logoDark.style.setProperty('display', 'none', 'important');
      }
    }
  }

  // Fullscreen Toggler
  function toggleFullscreen() {
    const container = document.getElementById('presentation');
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  // Sidebar Menu Drawer Control
  function openMenu() {
    sidebarOverlay.classList.add('open');
  }

  function closeMenu() {
    sidebarOverlay.classList.remove('open');
  }

  // Progress Bar navigation
  function handleProgressBarClick(e) {
    const rect = progressBarContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickedPercentage = clickX / width;
    
    // Map percentage to target slide index
    const targetSlide = Math.min(
      totalSlides,
      Math.max(1, Math.round(clickedPercentage * (totalSlides - 1)) + 1)
    );
    goToSlide(targetSlide);
  }

  // Swipe Gestures support
  let touchStartX = 0;
  let touchEndX = 0;

  function setupSwipeListeners() {
    const container = document.getElementById('presentation');
    
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    }, { passive: true });
  }

  function handleSwipeGesture() {
    const swipeThreshold = 50; // pixels
    const deltaX = touchEndX - touchStartX;
    
    if (deltaX < -swipeThreshold) {
      // Swiped Left -> Next Slide
      nextSlide();
    } else if (deltaX > swipeThreshold) {
      // Swiped Right -> Prev Slide
      prevSlide();
    }
  }

  // Interactive Simulator Playgrounds
  function setupInteractivePlaygrounds() {
    // 1. MCQ Simulator
    const mcqPlayground = document.getElementById('mcq-playground');
    if (mcqPlayground) {
      const options = mcqPlayground.querySelectorAll('.q-option');
      const feedback = document.getElementById('mcq-feedback');
      
      options.forEach(opt => {
        opt.addEventListener('click', () => {
          // Clear previous states
          options.forEach(o => o.classList.remove('correct', 'wrong-key'));
          
          const isCorrect = opt.getAttribute('data-correct') === 'true';
          if (isCorrect) {
            opt.classList.add('correct');
            feedback.style.color = 'var(--success)';
            feedback.textContent = '✓ Correct! Backtracking is NOT supported in basic Hill-Climbing, which is why it gets stuck in local maxima.';
          } else {
            opt.classList.add('wrong-key');
            feedback.style.color = 'var(--danger)';
            feedback.textContent = '✗ Incorrect key! This option is a valid property of Hill-Climbing. Try again.';
          }
        });
      });
    }

    // 2. MSQ Simulator
    const msqPlayground = document.getElementById('msq-playground');
    if (msqPlayground) {
      const options = msqPlayground.querySelectorAll('.q-option');
      const btnSubmit = document.getElementById('btnSubmitMsq');
      const feedback = document.getElementById('msq-feedback');
      
      options.forEach(opt => {
        opt.addEventListener('click', () => {
          // Toggle selection
          opt.classList.toggle('correct');
        });
      });

      btnSubmit.addEventListener('click', () => {
        const selected = Array.from(options).filter(opt => opt.classList.contains('correct'));
        const hasWrong = selected.some(opt => opt.getAttribute('data-option') === 'D');
        const correctCount = selected.filter(opt => opt.getAttribute('data-correct') === 'true').length;
        
        if (selected.length === 0) {
          feedback.style.color = 'var(--text-muted)';
          feedback.textContent = 'Please select at least one option.';
          return;
        }

        if (hasWrong) {
          feedback.style.color = 'var(--danger)';
          feedback.textContent = '❌ 0.00 / 2.00 Marks! Choosing any incorrect option (like D) forfeits all marks in MSQs.';
        } else {
          if (correctCount === 3) {
            feedback.style.color = 'var(--success)';
            feedback.textContent = '🎉 2.00 / 2.00 Marks! 100% Correct. All correct options selected!';
          } else if (correctCount === 2) {
            feedback.style.color = 'var(--accent)';
            feedback.textContent = '⚠️ Partial Credit: 1.33 / 2.00 Marks. (Select all correct options for full marks)';
          } else if (correctCount === 1) {
            feedback.style.color = 'var(--accent)';
            feedback.textContent = '⚠️ Partial Credit: 0.67 / 2.00 Marks. (Select all correct options for full marks)';
          }
        }
      });
    }

    // 3. Alphanumeric Exact Match
    const btnVerifyAlpha = document.getElementById('btnVerifyAlpha');
    if (btnVerifyAlpha) {
      const alphaInput = document.getElementById('alpha-input');
      const feedback = document.getElementById('alpha-feedback');
      
      btnVerifyAlpha.addEventListener('click', () => {
        const val = alphaInput.value;
        if (!val) {
          feedback.style.color = 'var(--text-muted)';
          feedback.textContent = 'Please type an answer.';
          return;
        }

        if (val.trim() === val && val.toLowerCase() === 'hardware') {
          feedback.style.color = 'var(--success)';
          feedback.textContent = '✓ Correct! 1.00 / 1.00 Mark. Exact match succeeded (autograding ignores casing).';
        } else if (val.trim().toLowerCase() === 'hardware') {
          feedback.style.color = 'var(--danger)';
          feedback.textContent = '✗ 0.00 Marks! The portal autograder is case-insensitive, but it does NOT trim spacing. Leading/trailing spaces caused a mismatch.';
        } else {
          feedback.style.color = 'var(--danger)';
          feedback.textContent = '✗ 0.00 Marks! Input did not match the key "hardware".';
        }
      });
    }

    // 4. Numerical Range Match
    const btnVerifyNumeric = document.getElementById('btnVerifyNumeric');
    if (btnVerifyNumeric) {
      const numericInput = document.getElementById('numeric-input');
      const feedback = document.getElementById('numeric-feedback');
      
      btnVerifyNumeric.addEventListener('click', () => {
        const val = parseFloat(numericInput.value);
        if (isNaN(val)) {
          feedback.style.color = 'var(--text-muted)';
          feedback.textContent = 'Please enter a valid number.';
          return;
        }

        if (val >= 6.91 && val <= 6.94) {
          feedback.style.color = 'var(--success)';
          feedback.textContent = `✓ Correct! 1.00 / 1.00 Mark. Value is within the accepted range [6.91 - 6.94].`;
        } else {
          feedback.style.color = 'var(--danger)';
          feedback.textContent = '✗ 0.00 Marks! Value is outside the accepted range [6.91 - 6.94].';
        }
      });
    }
  }

  // Generate dynamic gradient avatar with initials for missing photos
  function setupPlaceholderAvatars() {
    const placeholders = document.querySelectorAll('.profile-card .placeholder-avatar');
    const gradients = [
      'linear-gradient(135deg, #FF6B6B, #8F3CFC)',
      'linear-gradient(135deg, #4E65FF, #92EFFD)',
      'linear-gradient(135deg, #13E0B5, #0072FF)',
      'linear-gradient(135deg, #F5576C, #F093FB)',
      'linear-gradient(135deg, #FAD961, #F76B1C)',
      'linear-gradient(135deg, #30CFD0, #330867)',
      'linear-gradient(135deg, #4facfe, #00f2fe)'
    ];

    placeholders.forEach(avatar => {
      const card = avatar.closest('.profile-card');
      if (!card) return;
      const nameElem = card.querySelector('.profile-name');
      if (!nameElem) return;

      const name = nameElem.textContent.trim();
      const parts = name.split(/\s+/);
      let initials = '';
      if (parts.length > 0) {
        initials += parts[0].charAt(0).toUpperCase();
        if (parts.length > 1) {
          initials += parts[parts.length - 1].charAt(0).toUpperCase();
        }
      }

      // Deterministic gradient selection
      let sum = 0;
      for (let i = 0; i < name.length; i++) {
        sum += name.charCodeAt(i);
      }
      const gradIndex = sum % gradients.length;

      avatar.style.background = gradients[gradIndex];
      avatar.style.color = '#ffffff';
      avatar.style.fontFamily = 'var(--font-title)';
      avatar.style.fontSize = '1.9rem';
      avatar.style.fontWeight = '800';
      avatar.style.textShadow = '0 2px 4px rgba(0,0,0,0.15)';
      avatar.style.display = 'flex';
      avatar.style.alignItems = 'center';
      avatar.style.justifyContent = 'center';
      avatar.style.border = '3.5px solid var(--border-card)';
      
      avatar.innerHTML = `<span style="user-select: none;">${initials}</span>`;
    });
  }

  // Dynamic scale calculation to fit screen size (16:9 ratio)
  function setupWidescreenScaling() {
    const container = document.querySelector('.presentation-container');
    if (!container) return;
    
    const baseW = 1333;
    const baseH = 750;
    
    function updateScale() {
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      
      // Calculate scale factor to fit within current window viewport
      const scale = Math.min(winW / baseW, winH / baseH);
      
      // Set transform scale and position
      container.style.transform = `scale(${scale})`;
    }
    
    // Bind to window resize
    window.addEventListener('resize', updateScale);
    // Initial call
    updateScale();
  }

});
