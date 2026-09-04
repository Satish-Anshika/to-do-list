/**
 * TaskPulse — Interactive To-Do List & Checklist Application
 * Features: Interactive checklists, progress ring, filters, search, local storage, audio chime & confetti.
 */

// ==========================================
// 1. Initial State & Storage Management
// ==========================================

const STORAGE_KEY = 'taskpulse_todos_v1';
const THEME_KEY = 'taskpulse_theme';
const SOUND_KEY = 'taskpulse_sound';

<<<<<<< HEAD
=======
const defaultTasks = [
  {
    id: 'task-1',
    text: 'Welcome to TaskPulse! Try ticking this checkbox',
    priority: 'high',
    category: 'General',
    completed: true,
    createdAt: Date.now() - 3600000 * 2
  },
  {
    id: 'task-2',
    text: 'Add your own daily task using the form above',
    priority: 'medium',
    category: 'Work',
    completed: false,
    createdAt: Date.now() - 3600000
  },
  {
    id: 'task-3',
    text: 'Explore category filters and dark/light mode toggle',
    priority: 'low',
    category: 'Personal',
    completed: false,
    createdAt: Date.now()
  }
];

>>>>>>> c9ff82f801b046fccb91ccce84ba64b504d4e5ef
let tasks = loadTasks();
let currentFilter = 'all'; // 'all', 'active', 'completed'
let currentCategory = 'all';
let searchQuery = '';
let isSoundEnabled = localStorage.getItem(SOUND_KEY) !== 'false';

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
<<<<<<< HEAD
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Error loading tasks from localStorage', e);
    return [];
=======
    return saved ? JSON.parse(saved) : defaultTasks;
  } catch (e) {
    console.error('Error loading tasks from localStorage', e);
    return defaultTasks;
>>>>>>> c9ff82f801b046fccb91ccce84ba64b504d4e5ef
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks to localStorage', e);
  }
}

// ==========================================
// 2. DOM Elements Selection
// ==========================================

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskCategorySelect = document.getElementById('task-category-select');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const emptyTitle = document.getElementById('empty-title');
const emptyDesc = document.getElementById('empty-desc');

// Stats Elements
const metricTotal = document.getElementById('metric-total');
const metricPending = document.getElementById('metric-pending');
const metricCompleted = document.getElementById('metric-completed');
const progressCircle = document.getElementById('progress-circle');
const progressPercentage = document.getElementById('progress-percentage');
const progressSubtext = document.getElementById('progress-subtext');
const currentDateEl = document.getElementById('current-date');
const greetingTextEl = document.getElementById('greeting-text');

// Filter & Search Elements
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabAllCount = document.getElementById('tab-all-count');
const tabActiveCount = document.getElementById('tab-active-count');
const tabCompletedCount = document.getElementById('tab-completed-count');
const categoryFilterSelect = document.getElementById('category-filter-select');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Theme & Sound Toggle Elements
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');
const soundToggleBtn = document.getElementById('sound-toggle-btn');
const soundIcon = document.getElementById('sound-icon');

// Modal Elements
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const editTaskId = document.getElementById('edit-task-id');
const editTaskText = document.getElementById('edit-task-text');
const editPrioritySelect = document.getElementById('edit-priority-select');
const editCategorySelect = document.getElementById('edit-category-select');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

// Toast Element
const toastEl = document.getElementById('toast');
const toastMessageEl = document.getElementById('toast-message');
const toastIconEl = document.getElementById('toast-icon');

// ==========================================
// 3. Audio & Celebration FX (Web Audio API)
// ==========================================

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playCompletionChime() {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Note 1: E5 (659.25Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Note 2: B5 (987.77Hz) with slight delay
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.08);
    gain2.gain.setValueAtTime(0.15, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.45);
  } catch (err) {
    console.warn('Audio playback not permitted yet or failed', err);
  }
}

// Confetti Particle System on HTML5 Canvas
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');
let particles = [];
let confettiAnimId = null;

function resizeConfettiCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfettiCanvas);
resizeConfettiCanvas();

class ConfettiParticle {
  constructor(x, y) {
    this.x = x || window.innerWidth / 2;
    this.y = y || window.innerHeight / 2;
    this.size = Math.random() * 8 + 5;
    this.speedX = (Math.random() - 0.5) * 14;
    this.speedY = Math.random() * -12 - 4;
    this.gravity = 0.4;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 12;
<<<<<<< HEAD
    const colors = ['#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff', '#ffffff', '#10b981', '#38bdf8', '#cbd5e1'];
=======
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#38bdf8', '#f59e0b', '#ffffff'];
>>>>>>> c9ff82f801b046fccb91ccce84ba64b504d4e5ef
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = 1;
    this.fadeRate = Math.random() * 0.015 + 0.01;
  }

  update() {
    this.speedY += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
    this.opacity -= this.fadeRate;
  }

  draw() {
    confettiCtx.save();
    confettiCtx.translate(this.x, this.y);
    confettiCtx.rotate((this.rotation * Math.PI) / 180);
    confettiCtx.globalAlpha = Math.max(0, this.opacity);
    confettiCtx.fillStyle = this.color;
    confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    confettiCtx.restore();
  }
}

function fireConfetti(originX, originY) {
  const particleCount = 45;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new ConfettiParticle(originX, originY));
  }
  if (!confettiAnimId) {
    animateConfetti();
  }
}

function animateConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  particles = particles.filter(p => p.opacity > 0 && p.y < window.innerHeight + 50);

  for (const p of particles) {
    p.update();
    p.draw();
  }

  if (particles.length > 0) {
    confettiAnimId = requestAnimationFrame(animateConfetti);
  } else {
    confettiAnimId = null;
  }
}

// ==========================================
// 4. Toast Notification System
// ==========================================

let toastTimer = null;
function showToast(message, icon = 'ri-information-line') {
  if (toastTimer) clearTimeout(toastTimer);
  toastMessageEl.textContent = message;
  toastIconEl.className = icon;
  toastEl.classList.remove('hidden');
  toastTimer = setTimeout(() => {
    toastEl.classList.add('hidden');
  }, 2800);
}

// ==========================================
// 5. Date & Dynamic Greeting
// ==========================================

function updateDateAndGreeting() {
  const now = new Date();
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  currentDateEl.textContent = now.toLocaleDateString('en-US', options);

  const hours = now.getHours();
  let greeting = 'Ready to achieve your goals?';
  if (hours < 12) {
    greeting = 'Good morning! Ready to tackle your day?';
  } else if (hours < 18) {
    greeting = 'Good afternoon! Keep up the great momentum.';
  } else {
    greeting = 'Good evening! Wrap up your tasks in style.';
  }
  greetingTextEl.textContent = greeting;
}

// ==========================================
// 6. Progress and Metrics Rendering
// ==========================================

function updateMetrics() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  metricTotal.textContent = total;
  metricPending.textContent = pending;
  metricCompleted.textContent = completed;

  tabAllCount.textContent = total;
  tabActiveCount.textContent = pending;
  tabCompletedCount.textContent = completed;

  progressPercentage.textContent = `${percentage}%`;
  progressSubtext.textContent = total === 0 
    ? 'No tasks yet. Add one to get started!' 
    : `${completed} of ${total} tasks completed`;

  // Update SVG Progress Ring (Circumference is 2 * PI * 40 = ~251.32px)
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (percentage / 100) * circumference;
  progressCircle.style.strokeDashoffset = offset;

  // Toggle "Clear Completed" visibility
  if (completed > 0) {
    clearCompletedBtn.classList.remove('hidden');
  } else {
    clearCompletedBtn.classList.add('hidden');
  }
}

// ==========================================
// 7. Render Task Items & Checklist
// ==========================================

function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getCategoryIcon(cat) {
  switch (cat) {
    case 'Work': return '💼';
    case 'Personal': return '🌟';
    case 'Study': return '📚';
    case 'Health': return '🏃';
    case 'Shopping': return '🛒';
    default: return '🏷️';
  }
}

function renderTasks() {
  updateMetrics();

  // Filter tasks based on active filters & search query
  const filtered = tasks.filter(task => {
    // Status filter
    if (currentFilter === 'active' && task.completed) return false;
    if (currentFilter === 'completed' && !task.completed) return false;

    // Category filter
    if (currentCategory !== 'all' && task.category !== currentCategory) return false;

    // Search filter
    if (searchQuery) {
      const matchText = task.text.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = (task.category || '').toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchText && !matchCat) return false;
    }

    return true;
  });

  // Empty State Handling
  if (filtered.length === 0) {
    taskList.innerHTML = '';
    emptyState.classList.remove('hidden');

    if (searchQuery) {
      emptyTitle.textContent = 'No matching tasks found';
      emptyDesc.textContent = `No results found for "${searchQuery}". Try a different keyword.`;
    } else if (currentFilter === 'completed') {
      emptyTitle.textContent = 'No completed tasks yet';
      emptyDesc.textContent = 'Complete tasks on your checklist to see them here!';
    } else if (currentFilter === 'active') {
      emptyTitle.textContent = 'No pending tasks';
      emptyDesc.textContent = 'Great job! You have conquered all pending items.';
    } else {
      emptyTitle.textContent = 'Your checklist is empty';
      emptyDesc.textContent = 'Create a new task above to get started!';
    }
    return;
  }

  emptyState.classList.add('hidden');
  taskList.innerHTML = '';

  // Render individual task items
  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.setAttribute('data-id', task.id);

    li.innerHTML = `
      <div class="task-main">
        <label class="checklist-checkbox" aria-label="Mark task as ${task.completed ? 'pending' : 'completed'}">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} />
          <div class="custom-box">
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </label>
        <div class="task-details">
          <span class="task-text">${escapeHtml(task.text)}</span>
          <div class="task-meta">
            <span class="tag-pill category-pill">${getCategoryIcon(task.category)} ${escapeHtml(task.category || 'General')}</span>
            <span class="tag-pill priority-badge ${task.priority}">${task.priority.toUpperCase()}</span>
            <span class="task-time"><i class="ri-time-line"></i> ${formatTimestamp(task.createdAt)}</span>
          </div>
        </div>
      </div>
      <div class="task-actions">
        <button class="action-btn edit-btn" title="Edit task" aria-label="Edit task">
          <i class="ri-edit-line"></i>
        </button>
        <button class="action-btn delete-btn" title="Delete task" aria-label="Delete task">
          <i class="ri-delete-bin-line"></i>
        </button>
      </div>
    `;

    // Event Listener: Checklist Checkbox Toggle
    const checkbox = li.querySelector('.task-checkbox');
    checkbox.addEventListener('change', (e) => {
      toggleTaskCompletion(task.id, e.target.checked, e);
    });

    // Event Listener: Edit Task Button
    const editBtn = li.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
      openEditModal(task);
    });

    // Event Listener: Delete Task Button
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      deleteTask(task.id, li);
    });

    taskList.appendChild(li);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ==========================================
// 8. Task Actions & Handlers
// ==========================================

function toggleTaskCompletion(taskId, isChecked, event) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  task.completed = isChecked;
  saveTasks();

  if (isChecked) {
    playCompletionChime();

    // Trigger celebratory confetti at click coordinates
    if (event && event.clientX && event.clientY) {
      fireConfetti(event.clientX, event.clientY);
    } else {
      fireConfetti();
    }

    // Check if all tasks are finished!
    const remaining = tasks.filter(t => !t.completed).length;
    if (remaining === 0 && tasks.length > 0) {
      setTimeout(() => {
        fireConfetti(window.innerWidth / 2, window.innerHeight / 3);
        showToast('🎉 Awesome job! All tasks completed!', 'ri-trophy-line');
      }, 250);
    } else {
      showToast('Task marked as completed! ✓', 'ri-checkbox-circle-line');
    }
  } else {
    showToast('Task marked as pending', 'ri-arrow-go-back-line');
  }

  renderTasks();
}

function addNewTask(text, priority, category) {
  if (!text || text.trim() === '') return;

  const newTask = {
    id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    text: text.trim(),
    priority: priority || 'low',
    category: category || 'General',
    completed: false,
    createdAt: Date.now()
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
  showToast('Task added successfully!', 'ri-add-circle-line');
}

function deleteTask(taskId, taskElement) {
  if (taskElement) {
    taskElement.classList.add('removing');
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== taskId);
      saveTasks();
      renderTasks();
      showToast('Task deleted', 'ri-delete-bin-line');
    }, 280);
  } else {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    renderTasks();
    showToast('Task deleted', 'ri-delete-bin-line');
  }
}

function clearCompletedTasks() {
  const count = tasks.filter(t => t.completed).length;
  if (count === 0) return;

  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
  showToast(`Cleared ${count} completed task${count > 1 ? 's' : ''}!`, 'ri-delete-bin-2-line');
}

// ==========================================
// 9. Edit Modal Logic
// ==========================================

function openEditModal(task) {
  editTaskId.value = task.id;
  editTaskText.value = task.text;
  editPrioritySelect.value = task.priority;
  editCategorySelect.value = task.category || 'General';
  editModal.classList.remove('hidden');
  editTaskText.focus();
}

function closeEditModal() {
  editModal.classList.add('hidden');
}

editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = editTaskId.value;
  const text = editTaskText.value.trim();
  const priority = editPrioritySelect.value;
  const category = editCategorySelect.value;

  if (!text) return;

  const task = tasks.find(t => t.id === id);
  if (task) {
    task.text = text;
    task.priority = priority;
    task.category = category;
    saveTasks();
    renderTasks();
    showToast('Task updated successfully!', 'ri-check-line');
  }
  closeEditModal();
});

closeModalBtn.addEventListener('click', closeEditModal);
cancelEditBtn.addEventListener('click', closeEditModal);
editModal.addEventListener('click', (e) => {
  if (e.target === editModal) closeEditModal();
});

// ==========================================
// 10. Form & Toolbar Listeners
// ==========================================

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value;
  const priorityRadio = document.querySelector('input[name="priority"]:checked');
  const priority = priorityRadio ? priorityRadio.value : 'low';
  const category = taskCategorySelect.value;

  addNewTask(text, priority, category);
  taskInput.value = '';
  taskInput.focus();
});

// Search functionality
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  if (searchQuery.length > 0) {
    clearSearchBtn.classList.remove('hidden');
  } else {
    clearSearchBtn.classList.add('hidden');
  }
  renderTasks();
});

clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  clearSearchBtn.classList.add('hidden');
  searchInput.focus();
  renderTasks();
});

// Filter Tabs (All / Active / Completed)
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    currentFilter = btn.getAttribute('data-filter');
    renderTasks();
  });
});

// Category Dropdown Filter
categoryFilterSelect.addEventListener('change', (e) => {
  currentCategory = e.target.value;
  renderTasks();
});

// Clear Completed Button
clearCompletedBtn.addEventListener('click', clearCompletedTasks);

// ==========================================
// 11. Theme & Sound Preference Controls
// ==========================================

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    themeIcon.className = 'ri-moon-line';
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    themeIcon.className = 'ri-sun-line';
  }
  localStorage.setItem(THEME_KEY, theme);
}

const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
applyTheme(savedTheme);

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme);
  showToast(`Switched to ${nextTheme} theme`, nextTheme === 'light' ? 'ri-sun-line' : 'ri-moon-line');
});

// Sound Toggle
function updateSoundIcon() {
  if (isSoundEnabled) {
    soundIcon.className = 'ri-volume-up-line';
  } else {
    soundIcon.className = 'ri-volume-mute-line';
  }
}
updateSoundIcon();

soundToggleBtn.addEventListener('click', () => {
  isSoundEnabled = !isSoundEnabled;
  localStorage.setItem(SOUND_KEY, isSoundEnabled.toString());
  updateSoundIcon();
  showToast(isSoundEnabled ? 'Chime sound enabled' : 'Chime sound muted', isSoundEnabled ? 'ri-volume-up-line' : 'ri-volume-mute-line');
  if (isSoundEnabled) {
    getAudioContext();
    playCompletionChime();
  }
});

// ==========================================
// 12. App Initialization
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  updateDateAndGreeting();
  renderTasks();
});

// Fallback in case DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  updateDateAndGreeting();
  renderTasks();
}
