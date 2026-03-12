const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyMessage = document.getElementById('emptyMessage');
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');

let todos = [];
let confettiActive = false;

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
  const colors = ['#f44336', '#4caf50', '#2196f3', '#ffeb3b', '#ff9800', '#9c27b0', '#00bcd4', '#e91e63'];
  
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 2,
      angle: Math.random() * Math.PI * 2,
      spin: Math.random() * 0.2 - 0.1,
      drift: Math.random() * 2 - 1
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    let activeParticles = 0;
    
    particles.forEach(p => {
      if (p.y < confettiCanvas.height) {
        activeParticles++;
        p.y += p.speed;
        p.x += p.drift;
        p.angle += p.spin;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    });
    
    if (activeParticles > 0) {
      requestAnimationFrame(animate);
    } else {
      confettiActive = false;
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }
  
  animate();
}

function renderTodos() {
  todoList.innerHTML = '';
  
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.completed ? ' completed' : ''}`;
    
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;
    
    const checkBtn = document.createElement('button');
    checkBtn.className = `check-btn${todo.completed ? ' completed' : ''}`;
    checkBtn.textContent = '✓';
    checkBtn.onclick = () => toggleTodo(index);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.onclick = () => deleteTodo(index);
    
    li.appendChild(span);
    li.appendChild(checkBtn);
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

updateEmptyMessage();
