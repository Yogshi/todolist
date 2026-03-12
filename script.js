let tasks = [];
let currentCategory = null;
let timerIntervals = [];
let confettiActive = false;
let effectsActive = false;

const categoryDoodles = {
  school: '📚',
  work: '💼',
  personal: '⭐',
  health: '💪',
  shopping: '🛒'
};

const defaultDoodle = '📁';

const encouragementMessages = [
  'Good Job! 🌟',
  'Keep It Up! ✨',
  'Well Done! 🎉',
  'Amazing! 💫',
  'You Got This! 🚀'
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

// Load tasks from localStorage
function loadTasks() {
  const saved = localStorage.getItem('aestheticTasks');
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('aestheticTasks', JSON.stringify(tasks));
}

// Get unique categories
function getCategories() {
  const categories = {};
  tasks.forEach(task => {
    if (!categories[task.category]) {
      categories[task.category] = [];
    }
    categories[task.category].push(task);
  });
  return categories;
}

// Get folder class for category
function getFolderClass(category) {
  const cat = category.toLowerCase();
  if (['school', 'work', 'personal', 'health', 'shopping'].includes(cat)) {
    return `folder-${cat}`;
  }
  return 'folder-default';
}

// Render folders
function renderFolders() {
  const container = document.getElementById('foldersContainer');
  const categories = getCategories();
  const categoryNames = Object.keys(categories);
  
  if (categoryNames.length === 0) {
    container.innerHTML = '<p class="no-tasks-message">No tasks yet. Add your first task!</p>';
    return;
  }
  
  container.innerHTML = '';
  
  categoryNames.forEach(category => {
    const folder = document.createElement('div');
    folder.className = `folder ${getFolderClass(category)}`;
    folder.onclick = () => openCategory(category);
    
    const doodle = categoryDoodles[category.toLowerCase()] || defaultDoodle;
    const taskCount = categories[category].filter(t => !t.completed).length;
    
    folder.innerHTML = `
      <span class="doodle">${doodle}</span>
      <div class="folder-icon"></div>
      <span class="folder-name">${category}</span>
      <span class="folder-count">${taskCount} tasks</span>
    `;
    
    container.appendChild(folder);
  });
}

// Open popup
function openPopup() {
  document.getElementById('popupOverlay').classList.add('active');
  document.getElementById('taskInput').value = '';
  document.getElementById('categoryInput').value = '';
  document.getElementById('dateInput').value = '';
  document.getElementById('timeInput').value = '';
  document.getElementById('taskInput').focus();
}

// Close popup
function closePopup() {
  document.getElementById('popupOverlay').classList.remove('active');
}

// Save task
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
  renderFolders();
  playTwinkleSound();
  closePopup();
}

// Open category view
function openCategory(category) {
  currentCategory = category;
  document.getElementById('categoryTitle').textContent = category;
  document.querySelector('.todo-container').style.display = 'none';
  document.getElementById('categoryView').classList.add('active');
  renderCategoryTasks();
}

// Close category view
function closeCategoryView() {
  currentCategory = null;
  document.querySelector('.todo-container').style.display = 'block';
  document.getElementById('categoryView').classList.remove('active');
  clearAllTimers();
}

// Render tasks in category
function renderCategoryTasks() {
  const container = document.getElementById('categoryTasks');
  const categoryTasks = tasks.filter(t => t.category === currentCategory);
  
  if (categoryTasks.length === 0) {
    container.innerHTML = '<p class="no-tasks-message">No tasks in this category!</p>';
    return;
  }
  
  container.innerHTML = '';
  
  categoryTasks.forEach(task => {
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
  
  // Start timers
  startTimers();
}

// Format deadline
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

// Start timers for all tasks
function startTimers() {
  clearAllTimers();
  
  tasks.forEach(task => {
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

// Clear all timers
function clearAllTimers() {
  timerIntervals.forEach(interval => clearInterval(interval));
  timerIntervals = [];
}

// Toggle task completion
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
    
    renderCategoryTasks();
    renderFolders();
    
    // Check if all tasks are completed
    checkAllCompleted();
  }
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderCategoryTasks();
  renderFolders();
}

// Show message
function showMessage(message) {
  const overlay = document.getElementById('messageOverlay');
  const box = document.getElementById('messageBox');
  box.textContent = message;
  overlay.classList.add('active');
  
  setTimeout(() => {
    overlay.classList.remove('active');
  }, 2000);
}

// Check if all tasks completed
function checkAllCompleted() {
  if (tasks.length > 0 && tasks.every(t => t.completed)) {
    setTimeout(() => {
      showWinScreen();
    }, 500);
  }
}

// Show win screen
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

// Confetti
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

// Effects
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

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('foldersContainer')) {
    loadTasks();
    renderFolders();
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
  
  // Close popup on overlay click
  document.getElementById('popupOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('popupOverlay')) {
      closePopup();
    }
  });
  
  // Handle Enter key in task input
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
