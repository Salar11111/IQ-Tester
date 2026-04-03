/**
 * IQ Tester — Results Module
 * Handles score display, bell curve, category charts, and localStorage history
 */

const ResultsModule = (() => {
  const STORAGE_KEY = 'iq-tester-history';

  // ─── Show Results ───

  function show(result) {
    saveToHistory(result);
    App.showScreen('results');

    animateScore(result.iq);
    document.getElementById('score-classification').textContent = result.classification;
    document.getElementById('score-subtitle').textContent =
      `${result.correctAnswers}/${result.totalQuestions} correct in ${formatTime(result.timeSpentSeconds)}`;

    renderBellCurve(result.iq);
    renderCategoryBreakdown(result.categoryScores);
    renderStats(result);
  }

  // ─── Animated Counter ───

  function animateScore(target) {
    const el = document.getElementById('score-value');
    const duration = 2000;
    const start = performance.now();
    const from = 0;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (target - from) * ease);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // ─── Bell Curve (Canvas) ───

  function renderBellCurve(userIQ) {
    const canvas = document.getElementById('bell-curve-canvas');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Size canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, bottom: 40, left: 20, right: 20 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    // Normal distribution function
    const mean = 100;
    const sd = 15;
    function normalPDF(x) {
      const exp = -0.5 * Math.pow((x - mean) / sd, 2);
      return (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.pow(Math.E, exp);
    }

    // IQ range 55 to 145
    const minIQ = 55;
    const maxIQ = 145;
    const maxPDF = normalPDF(mean);

    function iqToX(iq) {
      return padding.left + ((iq - minIQ) / (maxIQ - minIQ)) * chartW;
    }

    function pdfToY(pdf) {
      return padding.top + chartH - (pdf / maxPDF) * chartH;
    }

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Draw filled curve
    const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.02)');

    ctx.beginPath();
    ctx.moveTo(iqToX(minIQ), h - padding.bottom);
    for (let iq = minIQ; iq <= maxIQ; iq += 0.5) {
      ctx.lineTo(iqToX(iq), pdfToY(normalPDF(iq)));
    }
    ctx.lineTo(iqToX(maxIQ), h - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw curve line
    ctx.beginPath();
    for (let iq = minIQ; iq <= maxIQ; iq += 0.5) {
      const x = iqToX(iq);
      const y = pdfToY(normalPDF(iq));
      if (iq === minIQ) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw user marker
    const userX = iqToX(Math.max(minIQ, Math.min(maxIQ, userIQ)));
    const userY = pdfToY(normalPDF(Math.max(minIQ, Math.min(maxIQ, userIQ))));

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(userX, userY);
    ctx.lineTo(userX, h - padding.bottom);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dot
    ctx.beginPath();
    ctx.arc(userX, userY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.strokeStyle = '#0a0e1a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label
    ctx.font = '600 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.textAlign = 'center';
    ctx.fillText(`You: ${userIQ}`, userX, userY - 14);

    // X-axis labels
    ctx.font = '11px "Inter", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    for (let iq = 70; iq <= 130; iq += 15) {
      ctx.fillText(iq.toString(), iqToX(iq), h - padding.bottom + 18);
    }

    // X-axis line
    ctx.beginPath();
    ctx.moveTo(padding.left, h - padding.bottom);
    ctx.lineTo(w - padding.right, h - padding.bottom);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // ─── Category Breakdown ───

  function renderCategoryBreakdown(categoryScores) {
    const container = document.getElementById('category-bars');
    container.innerHTML = '';

    for (const key in categoryScores) {
      const cat = CATEGORIES[key];
      const score = categoryScores[key];

      const row = document.createElement('div');
      row.className = 'cat-row';
      row.innerHTML = `
        <span class="cat-name">${cat.icon} ${cat.name}</span>
        <div class="cat-bar-track">
          <div class="cat-bar-fill" style="width: 0%"></div>
        </div>
        <span class="cat-score">${score.correct}/${score.total}</span>
      `;
      container.appendChild(row);

      // Animate bar
      requestAnimationFrame(() => {
        setTimeout(() => {
          row.querySelector('.cat-bar-fill').style.width = score.percentage + '%';
        }, 100);
      });
    }
  }

  // ─── Stats Grid ───

  function renderStats(result) {
    const grid = document.getElementById('stats-grid');
    grid.innerHTML = `
      <div class="stat-card">
        <div class="stat-value">${result.correctAnswers}/${result.totalQuestions}</div>
        <div class="stat-label">Correct Answers</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${formatTime(result.timeSpentSeconds)}</div>
        <div class="stat-label">Time Taken</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${Math.round(result.rawScore)}%</div>
        <div class="stat-label">Accuracy</div>
      </div>
    `;
  }

  // ─── History (localStorage) ───

  function getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function saveToHistory(result) {
    const history = getHistory();
    history.push({
      iq: result.iq,
      classification: result.classification,
      correctAnswers: result.correctAnswers,
      totalQuestions: result.totalQuestions,
      timeSpentSeconds: result.timeSpentSeconds,
      accuracy: Math.round(result.rawScore),
      timestamp: result.timestamp
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // ─── History Screen ───

  function renderHistoryScreen() {
    const history = getHistory();
    const content = document.getElementById('history-content');
    const trendSection = document.getElementById('trend-section');

    if (history.length === 0) {
      trendSection.classList.add('hidden');
      content.innerHTML = `
        <div class="empty-history">
          <div class="empty-icon">📋</div>
          <p>No test history yet. Take your first test!</p>
          <button class="btn-primary" onclick="App.showScreen('landing')">
            <span>Take Test</span>
            <span class="btn-icon">→</span>
          </button>
        </div>
      `;
      return;
    }

    trendSection.classList.remove('hidden');
    renderTrendChart(history);

    const rows = history
      .slice()
      .reverse()
      .map((entry, i) => {
        const date = new Date(entry.timestamp);
        const dateStr = date.toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        });
        const timeStr = date.toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit'
        });

        return `
          <tr>
            <td class="date-cell">${dateStr} ${timeStr}</td>
            <td class="score-cell">${entry.iq}</td>
            <td>${entry.classification}</td>
            <td>${entry.accuracy}%</td>
            <td>${formatTime(entry.timeSpentSeconds)}</td>
          </tr>
        `;
      })
      .join('');

    content.innerHTML = `
      <table class="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>IQ</th>
            <th>Classification</th>
            <th>Accuracy</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  // ─── Trend Chart (Canvas) ───

  function renderTrendChart(history) {
    const canvas = document.getElementById('trend-canvas');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, bottom: 24, left: 40, right: 20 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const scores = history.map(e => e.iq);
    const minScore = Math.min(...scores, 70) - 5;
    const maxScore = Math.max(...scores, 130) + 5;

    ctx.clearRect(0, 0, w, h);

    if (scores.length < 2) {
      // Just show a single dot
      const x = padding.left + chartW / 2;
      const y = padding.top + chartH / 2;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
      ctx.font = '600 12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#f1f5f9';
      ctx.textAlign = 'center';
      ctx.fillText(scores[0].toString(), x, y - 14);
      return;
    }

    // Map score to canvas
    function scoreToY(s) {
      return padding.top + chartH - ((s - minScore) / (maxScore - minScore)) * chartH;
    }

    const step = chartW / (scores.length - 1);

    // Gradient fill under line
    const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.01)');

    ctx.beginPath();
    ctx.moveTo(padding.left, h - padding.bottom);
    scores.forEach((s, i) => {
      ctx.lineTo(padding.left + i * step, scoreToY(s));
    });
    ctx.lineTo(padding.left + (scores.length - 1) * step, h - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    scores.forEach((s, i) => {
      const x = padding.left + i * step;
      const y = scoreToY(s);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Dots and labels
    scores.forEach((s, i) => {
      const x = padding.left + i * step;
      const y = scoreToY(s);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#818cf8';
      ctx.fill();
      ctx.strokeStyle = '#0a0e1a';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText(s.toString(), x, y - 10);
    });

    // Y-axis labels
    ctx.font = '10px "Inter", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';
    const ySteps = 4;
    for (let i = 0; i <= ySteps; i++) {
      const val = Math.round(minScore + (maxScore - minScore) * (i / ySteps));
      const y = scoreToY(val);
      ctx.fillText(val.toString(), padding.left - 8, y + 4);

      // Grid line
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // ─── Past Scores (Landing) ───

  function renderPastScores() {
    const section = document.getElementById('past-scores-section');
    const history = getHistory();

    if (history.length === 0) {
      section.innerHTML = '';
      return;
    }

    const recent = history.slice(-10);
    const maxIQ = Math.max(...recent.map(h => h.iq), 130);

    const bars = recent.map(entry => {
      const height = Math.max(8, (entry.iq / maxIQ) * 50);
      return `<div class="score-bar" style="height: ${height}px">
        <span class="tooltip">${entry.iq} IQ</span>
      </div>`;
    }).join('');

    section.innerHTML = `
      <h3>Your Recent Scores</h3>
      <div class="past-scores-chart">${bars}</div>
    `;
  }

  // ─── Utilities ───

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  }

  return {
    show,
    getHistory,
    clearHistory,
    renderHistoryScreen,
    renderPastScores,
    renderTrendChart,
    formatTime
  };
})();
