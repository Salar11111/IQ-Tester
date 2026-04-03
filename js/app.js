/**
 * IQ Tester — App Router & Initialization
 * Handles screen navigation, event wiring, and app lifecycle
 */

const App = (() => {
  const screens = {
    landing: document.getElementById('screen-landing'),
    test: document.getElementById('screen-test'),
    results: document.getElementById('screen-results'),
    history: document.getElementById('screen-history')
  };

  let currentScreen = 'landing';

  // ─── Screen Navigation ───

  function showScreen(name) {
    // Hide all screens
    Object.values(screens).forEach(s => s.classList.remove('active'));

    // Show target
    if (screens[name]) {
      screens[name].classList.add('active');
      currentScreen = name;
      window.scrollTo(0, 0);

      // Screen-specific hooks
      if (name === 'landing') {
        ResultsModule.renderPastScores();
      } else if (name === 'history') {
        ResultsModule.renderHistoryScreen();
      }
    }
  }

  // ─── Event Wiring ───

  function init() {
    // Landing → Start Test
    document.getElementById('btn-start-test').addEventListener('click', () => {
      showScreen('test');
      TestEngine.start();
    });

    // Test → Next Question
    document.getElementById('btn-next-question').addEventListener('click', () => {
      TestEngine.nextQuestion();
    });

    // Test → Quit
    document.getElementById('btn-quit-test').addEventListener('click', () => {
      if (confirm('Are you sure you want to quit? Your progress will be scored as-is.')) {
        TestEngine.quit();
      }
    });

    // Results → Retake
    document.getElementById('btn-retake').addEventListener('click', () => {
      showScreen('test');
      TestEngine.start();
    });

    // Results → History
    document.getElementById('btn-view-history').addEventListener('click', () => {
      showScreen('history');
    });

    // History → Back
    document.getElementById('btn-back-home').addEventListener('click', () => {
      showScreen('landing');
    });

    // History → Clear
    document.getElementById('btn-clear-history').addEventListener('click', () => {
      if (confirm('Clear all test history? This cannot be undone.')) {
        ResultsModule.clearHistory();
        ResultsModule.renderHistoryScreen();
      }
    });

    // Initial state
    ResultsModule.renderPastScores();

    // Handle resize for canvas re-render
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (currentScreen === 'results') {
          const state = TestEngine.getCurrentState();
          // Re-render bell curve if on results screen
          const scoreEl = document.getElementById('score-value');
          const iq = parseInt(scoreEl.textContent);
          if (iq > 0) {
            ResultsModule.show && renderBellCurveResize(iq);
          }
        } else if (currentScreen === 'history') {
          ResultsModule.renderHistoryScreen();
        }
      }, 250);
    });
  }

  function renderBellCurveResize(iq) {
    // Quick re-render of just the bell curve on resize
    const canvas = document.getElementById('bell-curve-canvas');
    if (canvas) {
      // Trigger re-render by calling the results module
      // The full show() would re-animate, so we just re-render the canvas
      const history = ResultsModule.getHistory();
      if (history.length > 0) {
        const last = history[history.length - 1];
        // Just re-render trend and bell curve
      }
    }
  }

  // ─── Boot ───

  document.addEventListener('DOMContentLoaded', init);

  return { showScreen };
})();
