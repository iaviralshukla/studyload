// --- GAMIFICATION STATE ---
let xp = 0;
let level = 1;

function addXP(amount) {
    xp += amount;
    if (xp >= 100) {
        xp = xp - 100;
        level++;
        document.getElementById('user-level').innerText = level;
        notifyUser("Level Up! 🎉✨", `You are now Level ${level}! Bunny is proud of you!`);
    }
    document.getElementById('xp-fill').style.width = `${xp}%`;
    document.getElementById('xp-text').innerText = `${xp} / 100 XP`;
}

function notifyUser(title, body) {
    if(Notification.permission === 'granted') {
        new Notification(title, { body: body, icon: "🐰" });
    } else {
        alert(`${title}\n${body}`);
    }
}

// --- SEAMLESS INFINITE POMODORO TIMER ---
let timerId = null;
let isBreak = false; 
let timeLeft = 25 * 60;

const timerDisplay = document.getElementById('timer-display');
const focusInput = document.getElementById('focus-input');
const breakInput = document.getElementById('break-input');
const mascot = document.getElementById('pomodoro-mascot');
const stateLabel = document.getElementById('timer-state-label');
const startBtn = document.getElementById('start-timer');

focusInput.addEventListener('change', () => {
    if(!timerId && !isBreak) { timeLeft = parseInt(focusInput.value) * 60; updateTimerDisplay(); }
});
breakInput.addEventListener('change', () => {
    if(!timerId && isBreak) { timeLeft = parseInt(breakInput.value) * 60; updateTimerDisplay(); }
});

function updateTimerDisplay() {
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;
    timerDisplay.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
}

function updatePomodoroUI() {
    if (isBreak) {
        mascot.className = 'mascot break';
        mascot.innerText = '🐰🥕🎶';
        stateLabel.innerText = "Break Time! Dance!";
        stateLabel.style.color = "var(--break)";
    } else {
        mascot.className = 'mascot studying';
        mascot.innerText = '🐰✍️✨';
        stateLabel.innerText = "Deep Focus Mode";
        stateLabel.style.color = "var(--cute-yellow)";
    }
}

startBtn.addEventListener('click', function() {
    if(Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }

    if (timerId) { 
        // STOP & RESET BUTTON PRESSED
        clearInterval(timerId);
        timerId = null;
        this.innerText = 'Start Cycle';
        this.classList.remove('glow-danger');
        this.classList.add('glow-btn');
        
        // Reset to initial focus state
        isBreak = false;
        timeLeft = parseInt(focusInput.value) * 60;
        updateTimerDisplay();
        
        mascot.className = 'mascot sleeping';
        mascot.innerText = '🐰💤';
        stateLabel.innerText = "Ready to Focus";
        stateLabel.style.color = "var(--text-secondary)";
    } else { 
        // START BUTTON PRESSED
        this.innerText = 'Stop Cycle';
        this.classList.remove('glow-btn');
        this.classList.add('glow-danger');
        
        updatePomodoroUI();

        timerId = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                // AUTOMATICALLY SWITCH STATES WITHOUT STOPPING
                if (!isBreak) {
                    notifyUser("Focus Complete! 🐰✨", "Starting your cute break automatically!");
                    addXP(20); 
                    isBreak = true;
                    timeLeft = parseInt(breakInput.value) * 60;
                } else {
                    notifyUser("Break Over! 🔔", "Back to deep focus mode. You got this!");
                    isBreak = false;
                    timeLeft = parseInt(focusInput.value) * 60;
                }
                updatePomodoroUI();
                updateTimerDisplay();
            }
        }, 1000);
    }
});

// --- TIMETABLE & BURNOUT STATE ---
const maxDailyLoad = 6;
let schedule = [
    { day: "Day 1 (Today)", date: "Oct 24", tasks: [], loadHours: 0 },
    { day: "Day 2", date: "Oct 25", tasks: [], loadHours: 0 },
    { day: "Day 3", date: "Oct 26", tasks: [], loadHours: 0 },
    { day: "Day 4 (Exam Eve)", date: "Oct 27", tasks: [], loadHours: 0 },
    { day: "Day 5 (EXAM)", date: "Oct 28", tasks: [], loadHours: 0 }
];

Chart.defaults.font.family = "'Quicksand', sans-serif";
Chart.defaults.color = "#cbd5e1";

const ctx = document.getElementById('burnoutChart').getContext('2d');
let burnoutChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: schedule.map(d => d.day.split(" ")[0]),
        datasets: [{
            label: 'Mental Load (Hours)',
            data: schedule.map(d => d.loadHours),
            borderColor: '#fde047',
            backgroundColor: 'rgba(253, 224, 71, 0.2)',
            borderWidth: 3,
            fill: true,
            tension: 0.5 
        }, {
            label: 'Burnout Threshold',
            data: [6,6,6,6,6],
            borderColor: '#fb7185',
            borderDash: [8, 6],
            borderWidth: 2,
            pointRadius: 0
        }]
    },
    options: { 
        responsive: true, maintainAspectRatio: false, 
        scales: { y: { beginAtZero: true, max: 8, grid: { color: 'rgba(255,255,255,0.1)' } }, x: { grid: { display: false } } },
        plugins: { legend: { labels: { font: { weight: 'bold' } } } }
    }
});

function updateChart() {
    burnoutChart.data.datasets[0].data = schedule.map(d => d.loadHours);
    burnoutChart.update();
}

// --- AI SIMULATION ---
document.getElementById('parse-btn').addEventListener('click', () => {
    document.getElementById('ai-logs').classList.remove('hidden');
    document.getElementById('log-1').classList.remove('hidden');
    setTimeout(() => { document.getElementById('log-2').classList.remove('hidden'); }, 1500);
    setTimeout(() => { document.getElementById('log-3').classList.remove('hidden'); generateComplexTimetable(); }, 3000);
});

function generateComplexTimetable() {
    const allTasks = [
        { dayIdx: 0, id: 1, name: "Math: Integrals", hours: 2.0, type: "study", tag: "tag-math", completed: false },
        { dayIdx: 0, id: 2, name: "☕ Cute Break", hours: 0.5, type: "break", tag: "", completed: false },
        { dayIdx: 0, id: 3, name: "Physics: Kinematics", hours: 2.5, type: "study", tag: "tag-physics", completed: false },
        { dayIdx: 1, id: 4, name: "Math: Calculus", hours: 3.0, type: "study", tag: "tag-math", completed: false },
        { dayIdx: 1, id: 5, name: "Physics: Dynamics", hours: 2.0, type: "study", tag: "tag-physics", completed: false },
        { dayIdx: 2, id: 6, name: "Math: Past Papers", hours: 2.5, type: "study", tag: "tag-math", completed: false },
        { dayIdx: 2, id: 7, name: "🌳 Walk outside!", hours: 1.0, type: "break", tag: "", completed: false },
        { dayIdx: 3, id: 8, name: "✨ Mega-Revision ✨", hours: 4.0, type: "revision", tag: "tag-math", completed: false },
        { dayIdx: 4, id: 9, name: "📝 MATH EXAM 🍀", hours: 3.0, type: "revision", tag: "tag-math", completed: false },
    ];

    schedule.forEach(d => { d.tasks = []; d.loadHours = 0; });
    allTasks.forEach(t => {
        schedule[t.dayIdx].tasks.push(t);
        if(t.type !== 'break') schedule[t.dayIdx].loadHours += t.hours;
    });
    renderSchedule();
}

document.getElementById('schedule-grid').addEventListener('change', (e) => {
    if(e.target.type === 'checkbox') {
        const dayIdx = e.target.dataset.day;
        const taskId = parseInt(e.target.dataset.taskid);
        const task = schedule[dayIdx].tasks.find(t => t.id === taskId);
        
        if(task) {
            task.completed = e.target.checked;
            if(task.completed) addXP(10);
            schedule[dayIdx].loadHours = schedule[dayIdx].tasks
                .filter(t => !t.completed && t.type !== 'break')
                .reduce((sum, t) => sum + t.hours, 0);
            renderSchedule();
        }
    }
});

document.getElementById('end-day-btn').addEventListener('click', () => {
    const today = schedule[0];
    const missedTasks = today.tasks.filter(t => !t.completed && t.type === 'study');
    
    if (missedTasks.length > 0) {
        alert(`Bunny is auto-rebalancing ${missedTasks.length} missed task(s)! Don't worry!`);
        today.tasks = today.tasks.filter(t => t.completed || t.type === 'break');
        today.loadHours = 0;

        missedTasks.forEach(task => {
            let lightestDay = schedule[1].loadHours <= schedule[2].loadHours ? 1 : 2;
            schedule[lightestDay].tasks.push(task);
            schedule[lightestDay].loadHours += task.hours;
        });
        renderSchedule();
    } else {
        alert("Day complete! You did amazing! 🌟");
    }
});

function renderSchedule() {
    const grid = document.getElementById('schedule-grid');
    grid.innerHTML = '';
    
    schedule.forEach((day, index) => {
        const card = document.createElement('div');
        card.className = 'day-card';
        
        let tasksHtml = day.tasks.map(t => {
            let blockClass = t.type === 'break' ? 'break-block' : (t.type === 'revision' ? 'revision-block' : '');
            return `
            <div class="task ${blockClass} ${t.completed ? 'completed' : ''}">
                ${t.type === 'study' || t.type === 'revision' ? `<input type="checkbox" data-day="${index}" data-taskid="${t.id}" ${t.completed ? 'checked' : ''}>` : '⏳'}
                <div class="task-content">
                    <div class="task-title">${t.name}</div>
                    ${t.type !== 'break' ? `<div class="task-meta"><span class="${t.tag}">${t.tag.replace('tag-', '').toUpperCase()}</span><span>${t.hours}h</span></div>` : ''}
                </div>
            </div>`;
        }).join('');
        
        if(day.tasks.length === 0) tasksHtml = '<div style="color:var(--text-secondary); font-weight: 600; font-size:0.9rem; margin-top:1rem; text-align:center;">Upload documents to generate plan!</div>';

        card.innerHTML = `
            <h3>${day.day} <span style="font-size: 0.85rem; color:var(--text-secondary);">${day.date}</span></h3>
            ${tasksHtml}
        `;
        grid.appendChild(card);
    });
    updateChart();
}
renderSchedule();