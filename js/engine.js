/**
 * IQ Tester — Test Engine
 * Manages test state, timer, navigation, and answer recording
 */

const TestEngine = (() => {
  // State
  let state = 'idle'; // idle | running | finished
  let questions = [];
  let currentIndex = 0;
  let answers = []; // { questionId, selectedIndex, correct, timeSpent }
  let totalSeconds = 20 * 60; // 20 minutes
  let remainingSeconds = totalSeconds;
  let timerInterval = null;
  let questionStartTime = 0;

  // DOM refs
  const timerEl = document.getElementById('timer');
  const timerDisplay = document.getElementById('timer-display');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const categoryBadge = document.getElementById('category-badge');
  const questionText = document.getElementById('question-text');
  const optionsGrid = document.getElementById('options-grid');
  const btnNext = document.getElementById('btn-next-question');

  // ─── Public API ───

  function start() {
    questions = shuffleArray(QUESTIONS);
    currentIndex = 0;
    answers = [];
    remainingSeconds = totalSeconds;
    state = 'running';
    questionStartTime = Date.now();

    startTimer();
    renderQuestion();
    updateProgress();
  }

  function getCurrentState() {
    return {
      state,
      currentIndex,
      totalQuestions: questions.length,
      answers: [...answers],
      timeSpent: totalSeconds - remainingSeconds,
      questions
    };
  }

  function selectOption(index) {
    if (state !== 'running') return;

    const q = questions[currentIndex];
    const isCorrect = index === q.correctIndex;
    const timeSpent = (Date.now() - questionStartTime) / 1000;

    // Record answer (overwrite if re-selecting)
    answers[currentIndex] = {
      questionId: q.id,
      category: q.category,
      selectedIndex: index,
      correct: isCorrect,
      timeSpent
    };

    // Update UI
    renderOptions(q, index);
    btnNext.disabled = false;
  }

  function nextQuestion() {
    if (state !== 'running') return;

    if (currentIndex < questions.length - 1) {
      currentIndex++;
      questionStartTime = Date.now();
      renderQuestion();
      updateProgress();
    } else {
      finish();
    }
  }

  function quit() {
    finish();
  }

  function finish() {
    state = 'finished';
    stopTimer();

    const result = calculateResult();
    if (typeof ResultsModule !== 'undefined') {
      ResultsModule.show(result);
    }
  }

  // ─── Timer ───

  function startTimer() {
    stopTimer();
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      remainingSeconds--;
      updateTimerDisplay();

      if (remainingSeconds <= 0) {
        finish();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function updateTimerDisplay() {
    const min = Math.floor(remainingSeconds / 60);
    const sec = remainingSeconds % 60;
    timerDisplay.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

    // Color states
    timerEl.classList.remove('warning', 'danger');
    if (remainingSeconds <= 60) {
      timerEl.classList.add('danger');
    } else if (remainingSeconds <= 300) {
      timerEl.classList.add('warning');
    }
  }

  // ─── Rendering ───

  function renderQuestion() {
    const q = questions[currentIndex];
    const cat = CATEGORIES[q.category];

    categoryBadge.innerHTML = `<span>${cat.icon}</span> ${cat.name}`;
    questionText.textContent = q.question;

    btnNext.disabled = true;
    btnNext.querySelector('span:first-child').textContent =
      currentIndex === questions.length - 1 ? 'Finish' : 'Next';

    renderOptions(q, answers[currentIndex]?.selectedIndex ?? -1);

    // Slide animation
    const area = document.getElementById('question-area');
    area.style.animation = 'none';
    area.offsetHeight; // trigger reflow
    area.style.animation = 'fadeSlideIn 0.35s ease forwards';
  }

  function renderOptions(q, selectedIndex) {
    const keys = ['A', 'B', 'C', 'D'];
    optionsGrid.innerHTML = q.options.map((opt, i) => {
      let cls = 'option-btn';
      if (i === selectedIndex) cls += ' selected';

      return `
        <button class="${cls}" data-index="${i}" aria-label="Option ${keys[i]}: ${opt}">
          <span class="option-key">${keys[i]}</span>
          <span class="option-label">${opt}</span>
        </button>
      `;
    }).join('');

    // Attach click listeners
    optionsGrid.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectOption(parseInt(btn.dataset.index));
      });
    });
  }

  function updateProgress() {
    const answered = answers.filter(Boolean).length;
    const pct = ((currentIndex + 1) / questions.length) * 100;
    progressFill.style.width = pct + '%';
    progressText.textContent = `${currentIndex + 1} / ${questions.length}`;

    // Update ARIA
    const progressBar = progressFill.closest('[role="progressbar"]');
    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', currentIndex + 1);
    }
  }

  // ─── Scoring ───

  function calculateResult() {
    const totalQuestions = questions.length;
    const correctAnswers = answers.filter(a => a && a.correct).length;
    const timeSpentSeconds = totalSeconds - remainingSeconds;

    // Raw percentage
    const rawScore = (correctAnswers / totalQuestions) * 100;

    // Scale to IQ range: 0% → 70, 100% → 130
    const scaledIQ = 70 + (rawScore * 0.6);

    // Time bonus: finishing faster adds up to 10 points
    const timeBonus = Math.max(0, (totalSeconds - timeSpentSeconds) / totalSeconds) * 10;

    const finalIQ = Math.round(scaledIQ + timeBonus);

    // Category scores
    const categoryScores = {};
    for (const key in CATEGORIES) {
      const catQuestions = questions.filter(q => q.category === key);
      const catAnswers = answers.filter(a => a && a.category === key);
      const catCorrect = catAnswers.filter(a => a.correct).length;
      categoryScores[key] = {
        total: catQuestions.length,
        correct: catCorrect,
        percentage: catQuestions.length > 0 ? (catCorrect / catQuestions.length) * 100 : 0
      };
    }

    // Classification
    let classification = 'Average';
    if (finalIQ >= 130) classification = 'Very Superior';
    else if (finalIQ >= 120) classification = 'Superior';
    else if (finalIQ >= 110) classification = 'Above Average';
    else if (finalIQ >= 90) classification = 'Average';
    else if (finalIQ >= 80) classification = 'Below Average';
    else if (finalIQ >= 70) classification = 'Borderline';
    else classification = 'Low';

    return {
      iq: finalIQ,
      classification,
      rawScore,
      correctAnswers,
      totalQuestions,
      timeSpentSeconds,
      categoryScores,
      timestamp: new Date().toISOString()
    };
  }

  // ─── Keyboard shortcuts ───

  document.addEventListener('keydown', (e) => {
    if (state !== 'running') return;

    const key = e.key;
    if (['1', '2', '3', '4'].includes(key)) {
      selectOption(parseInt(key) - 1);
    } else if (key === 'Enter' && !btnNext.disabled) {
      nextQuestion();
    }
  });

  return { start, getCurrentState, selectOption, nextQuestion, quit, finish };
})();
