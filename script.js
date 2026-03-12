const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyMessage = document.getElementById('emptyMessage');
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');

let todos = [];
let confettiActive = false;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTypingSound() {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.05);
  
  gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.05);
}

function playTwinkleSound() {
  const frequencies = [523.25, 659.25, 783.99, 1046.50];
  
  frequencies.forEach((freq, i) => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.08);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + i * 0.08);
    gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + i * 0.08 + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.08 + 0.3);
    
    oscillator.start(audioCtx.currentTime + i * 0.08);
    oscillator.stop(audioCtx.currentTime + i * 0.08 + 0.3);
  });
}

function updateEmptyMessage() {
  emptyMessage.classList.toggle('hidden', todos.length > 0);
}

function checkAllCompleted() {
  return todos.length > 0 && todos.every(todo => todo.completed);
}

function triggerConfetti() {
  if (confettiActive) return;
  confettiActive = true;
  
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  
  const particles = [];
  const colors = ['#FFB6C1', '#FFFFF0', '#FF69B4', '#FFD700', '#87CEEB', '#DDA0DD'];
  const startTime = Date.now();
  const duration = 2000;
  
  for (let i = 0; i < 200; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const velocity = Math.random() * 8 + 4;
    particles.push({
      x: confettiCanvas.width / 2,
      y: confettiCanvas.height / 3,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 5,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      gravity: 0.15,
      decay: Math.random() * 0.01 + 0.015,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 10 - 5
    });
  }
  
  function animate() {
    const elapsed = Date.now() - startTime;
    
    if (elapsed > duration) {
      confettiActive = false;
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      return;
    }
    
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    particles.forEach(p => {
      if (p.size > 0) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
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

function renderTodos() {
  todoList.innerHTML = '';
  
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.completed ? ' completed' : ''}`;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.onchange = () => toggleTodo(index);
    
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.onclick = () => deleteTodo(index);
    
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
  
  updateEmptyMessage();
  
  if (checkAllCompleted()) {
    setTimeout(triggerConfetti, 300);
  }
}

function addTodo() {
  const text = todoInput.value.trim();
  if (text) {
    todos.push({ text, completed: false });
    todoInput.value = '';
    playTwinkleSound();
    renderTodos();
  }
}

function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  renderTodos();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  renderTodos();
}

addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodo();
  }
});

let lastTypingTime = 0;
todoInput.addEventListener('input', (e) => {
  const now = Date.now();
  if (now - lastTypingTime > 100) {
    playTypingSound();
    lastTypingTime = now;
  }
});

updateEmptyMessage();
