let tasks = [];
let currentTab = 'all';
let timerIntervals = [];
let confettiActive = false;
let effectsActive = false;

const categorySymbols = {
  school: '📚',
  work: '💼',
  shopping: '🛒',
  health: '💪',
  personal: '🌟',
  general: '✅'
};

const defaultSymbol = '✅';

const encouragementMessages = [
  'Good Job! 🌟',
  'Keep It Up! ✨',
  'Well Done! 🎉',
  'Amazing! 💫',
  'You Got This! 🚀',
  'Fantastic! ⭐',
  'Great Work! 🌈'
];

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTypingSound() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
  
  gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.05);
}

function playClickSound() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
  
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
  
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.1);
}

function playPopupSound() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.15);
  
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
  
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.15);
}

function playTwinkleSound() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const frequencies = [523.25, 659.25, 783.99, 1046.50];
  
  frequencies.forEach((freq, i) => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.08);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + i * 0.08);
    gainNode.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + i * 0.08 + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.08 + 0.3);
    
    oscillator.start(audioCtx.currentTime + i * 0.08);
    oscillator.stop(audioCtx.currentTime + i * 0.08 + 0.3);
  });
}

function playWinSound() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const notes = [523.25, 587.33, 659.25, 783.99, 880, 987.77, 1046.50, 1174.66];
  
  notes.forEach((freq, i) => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.1);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + i * 0.1);
    gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + i * 0.1 + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.1 + 0.2);
    
    oscillator.start(audioCtx.currentTime + i * 0.1);
    oscillator.stop(audioCtx.currentTime + i * 0.1 + 0.2);
  });
}

function loadTasks() {
  const saved = localStorage.getItem('aestheticTasks');
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

function saveTasks() {
  localStorage.setItem('aestheticTasks', JSON.stringify(tasks));
}

function getCategories() {
  const categories = new Set();
  tasks.forEach(task => {
    categories.add(task.category);
  });
  return Array.from(categories);
}

function getCategorySymbol(category) {
  return categorySymbols[category.toLowerCase()] || defaultSymbol;
}

function displayDate() {
  const dateDisplay = document.getElementById('dateDisplay');
  if (!dateDisplay) return;
  
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = now.toLocaleDateString('en-US', options);
  dateDisplay.textContent = dateStr;
}

function renderTabs() {
  const tabsContainer = document.getElementById('tabs');
  if (!tabsContainer) return;
  
  const categories = getCategories();
  
  let tabsHTML = `
    <button class="tab ${currentTab === 'all' ? 'active' : ''}" data-category="all" onclick="playClickSound(); switchTab('all')">
      <span class="tab-symbol">📋</span>
      <span class="tab-name">All</span>
    </button>
  `;
  
  categories.forEach(category => {
    const symbol = getCategorySymbol(category);
    tabsHTML += `
      <button class="tab ${currentTab === category ? 'active' : ''}" data-category="${category}" onclick="playClickSound(); switchTab('${category}')">
        <span class="tab-symbol">${symbol}</span>
        <span class="tab-name">${category}</span>
      </button>
    `;
  });
  
  tabsContainer.innerHTML = tabsHTML;
}

function switchTab(category) {
  currentTab = category;
  renderTabs();
  renderTasks();
}

function renderTasks() {
  const container = document.getElementById('tasksContainer');
  if (!container) return;
  
  let filteredTasks = tasks;
  if (currentTab !== 'all') {
    filteredTasks = tasks.filter(t => t.category === currentTab);
  }
  
  if (filteredTasks.length === 0) {
    container.innerHTML = '<p class="no-tasks-message">No tasks yet. Add your first task!</p>';
    return;
  }
  
  container.innerHTML = '';
  
  filteredTasks.forEach(task => {
    const item = document.createElement('div');
    item.className = `task-item${task.completed ? ' completed' : ''}`;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.onchange = () => toggleTask(task.id);
    
    const content = document.createElement('div');
    content.className = 'task-content';
    
    const text = document.createElement('div');
    text.className = 'task-text';
    text.textContent = task.text;
    
    content.appendChild(text);
    
    if (task.deadline && !task.completed) {
      const deadline = document.createElement('div');
      deadline.className = 'task-deadline';
      deadline.id = `deadline-${task.id}`;
      deadline.textContent = formatDeadline(task.deadline);
      content.appendChild(deadline);
    }
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-delete';
    deleteBtn.textContent = '✕';
    deleteBtn.onclick = () => deleteTask(task.id);
    
    item.appendChild(checkbox);
    item.appendChild(content);
    item.appendChild(deleteBtn);
    container.appendChild(item);
  });
  
  startTimers();
}

function openPopup() {
  playPopupSound();
  document.getElementById('popupOverlay').classList.add('active');
  document.getElementById('taskInput').value = '';
  document.getElementById('categoryInput').value = '';
  document.getElementById('dateInput').value = '';
  document.getElementById('timeInput').value = '';
  document.getElementById('taskInput').focus();
}

function closePopup() {
  document.getElementById('popupOverlay').classList.remove('active');
}

function saveTask() {
  const taskText = document.getElementById('taskInput').value.trim();
  const category = document.getElementById('categoryInput').value.trim() || 'general';
  const date = document.getElementById('dateInput').value;
  const time = document.getElementById('timeInput').value;
  
  if (!taskText) {
    alert('Please enter a task!');
    return;
  }
  
  let deadline = null;
  if (date && time) {
    deadline = new Date(`${date}T${time}`).getTime();
  } else if (date) {
    deadline = new Date(`${date}T23:59`).getTime();
  }
  
  const task = {
    id: Date.now(),
    text: taskText,
    category: category.toLowerCase(),
    deadline: deadline,
    completed: false,
    createdAt: Date.now()
  };
  
  tasks.push(task);
  saveTasks();
  playTwinkleSound();
  closePopup();
  renderTabs();
  renderTasks();
}

function formatDeadline(deadlineTime) {
  const now = Date.now();
  const diff = deadlineTime - now;
  
  if (diff <= 0) {
    return 'Overdue! 😰';
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else {
    return `${minutes}m ${seconds}s`;
  }
}

function startTimers() {
  clearAllTimers();
  
  const tasksToShow = currentTab === 'all' ? tasks : tasks.filter(t => t.category === currentTab);
  
  tasksToShow.forEach(task => {
    if (task.deadline && !task.completed) {
      const interval = setInterval(() => {
        const deadlineEl = document.getElementById(`deadline-${task.id}`);
        if (deadlineEl) {
          deadlineEl.textContent = formatDeadline(task.deadline);
        } else {
          clearInterval(interval);
        }
      }, 1000);
      timerIntervals.push(interval);
    }
  });
}

function clearAllTimers() {
  timerIntervals.forEach(interval => clearInterval(interval));
  timerIntervals = [];
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    
    if (task.completed) {
      const message = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
      showMessage(message);
      playTwinkleSound();
    }
    
    renderTasks();
    
    checkAllCompleted();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTabs();
  renderTasks();
}

function showMessage(message) {
  const overlay = document.getElementById('messageOverlay');
  const box = document.getElementById('messageBox');
  box.textContent = message;
  overlay.classList.add('active');
  
  setTimeout(() => {
    overlay.classList.remove('active');
  }, 2000);
}

function checkAllCompleted() {
  if (tasks.length > 0 && tasks.every(t => t.completed)) {
    setTimeout(() => {
      showWinScreen();
    }, 500);
  }
}

function showWinScreen() {
  const overlay = document.getElementById('winOverlay');
  overlay.classList.add('active');
  playWinSound();
  startConfetti();
  startEffects();
  
  setTimeout(() => {
    overlay.classList.remove('active');
    stopConfetti();
    stopEffects();
  }, 3000);
}

function startConfetti() {
  if (confettiActive) return;
  confettiActive = true;
  
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const colors = ['#e53e3e', '#38a169', '#3182ce', '#d69e2e', '#9f7aea', '#ed64a6', '#48bb78'];
  
  for (let i = 0; i < 200; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 15 + 8;
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 5,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      gravity: 0.2,
      decay: Math.random() * 0.02 + 0.01,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 15 - 7.5
    });
  }
  
  const startTime = Date.now();
  const duration = 3000;
  
  function animate() {
    const elapsed = Date.now() - startTime;
    
    if (elapsed > duration) {
      confettiActive = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      if (p.size > 0) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.size -= p.decay;
        p.rotation += p.rotationSpeed;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

function stopConfetti() {
  confettiActive = false;
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function startEffects() {
  if (effectsActive) return;
  effectsActive = true;
  
  const canvas = document.getElementById('effectsCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const stars = [];
  
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      alpha: Math.random(),
      speed: Math.random() * 0.05 + 0.02
    });
  }
  
  const startTime = Date.now();
  const duration = 3000;
  
  function animate() {
    const elapsed = Date.now() - startTime;
    
    if (elapsed > duration) {
      effectsActive = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
      star.alpha += star.speed;
      if (star.alpha > 1 || star.alpha < 0) {
        star.speed *= -1;
      }
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.fill();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

function stopEffects() {
  effectsActive = false;
  const canvas = document.getElementById('effectsCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('tasksContainer')) {
    loadTasks();
    displayDate();
    renderTabs();
    renderTasks();
  }
  
  if (document.getElementById('taskInput')) {
    document.getElementById('taskInput').addEventListener('input', () => {
      const now = Date.now();
      if (!window.lastTypingTime || now - window.lastTypingTime > 150) {
        playTypingSound();
        window.lastTypingTime = now;
      }
    });
  }
  
  document.getElementById('popupOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('popupOverlay')) {
      closePopup();
    }
  });
  
  document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('categoryInput').focus();
    }
  });
  
  document.getElementById('categoryInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('dateInput').focus();
    }
  });
});
