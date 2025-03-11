// Данные
let subjects = JSON.parse(localStorage.getItem('subjects')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let timer = null;
let activeIndex = -1;

// Форматирование времени
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}`;
}

// Добавление предмета
function addSubject() {
    const input = document.getElementById('subjectInput');
    const name = input.value.trim();
    if (name) {
        subjects.push({ name, timeSpent: 0, notes: '' });
        input.value = '';
        saveAndRender();
    }
}

// Таймер
function startTimer(index) {
    if (timer && activeIndex === index) {
        clearInterval(timer);
        timer = null;
        activeIndex = -1;
    } else {
        if (timer) clearInterval(timer);
        activeIndex = index;
        timer = setInterval(() => {
            subjects[index].timeSpent++;
            saveAndRender();
        }, 1000);
    }
    saveAndRender();
}

// Заметки
function showNotes(index) {
    const section = document.getElementById('notesSection');
    const subjectSpan = document.getElementById('noteSubject');
    const input = document.getElementById('noteInput');
    section.style.display = 'block';
    subjectSpan.textContent = subjects[index].name;
    input.value = subjects[index].notes || '';
    input.dataset.index = index;
}

function saveNote() {
    const input = document.getElementById('noteInput');
    const index = input.dataset.index;
    subjects[index].notes = input.value;
    document.getElementById('notesSection').style.display = 'none';
    saveAndRender();
}

// Добавление задачи
function addTask() {
    const input = document.getElementById('taskInput');
    const deadline = document.getElementById('taskDeadline').value;
    const name = input.value.trim();
    if (name && deadline) {
        tasks.push({ name, deadline });
        input.value = '';
        document.getElementById('taskDeadline').value = '';
        saveAndRender();
    }
}

// Сохранение и рендеринг
function saveAndRender() {
    localStorage.setItem('subjects', JSON.stringify(subjects));
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Предметы
    const subjectList = document.getElementById('subjectList');
    subjectList.innerHTML = '';
    subjects.forEach((subject, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${subject.name} - Время: ${formatTime(subject.timeSpent)} 
            <div>
                <button onclick="startTimer(${index})">${activeIndex === index ? 'Стоп' : 'Старт'}</button>
                <button onclick="showNotes(${index})">Заметки</button>
            </div>`;
        subjectList.appendChild(li);
    });

    // Статистика
    const stats = document.getElementById('stats');
    stats.innerHTML = subjects.map(s => `${s.name}: ${formatTime(s.timeSpent)}`).join('<br>');

    // Задачи
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.name} - Дедлайн: ${task.deadline}`;
        taskList.appendChild(li);
    });

    // Календарь
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: tasks.map(task => ({
            title: task.name,
            start: task.deadline,
            allDay: true
        }))
    });
    calendar.render();
}

// Темы
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});

// Инициализация
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}
saveAndRender();

// Полифилл для padLeft
if (!String.prototype.padLeft) {
    String.prototype.padLeft = function(length, char) {
        return String(char).repeat(length - this.length) + this;
    };
}