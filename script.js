let activityData = {};

const weeklyData = [
  { day: 'Sun', date: '2025-06-08' },
  { day: 'Mon', date: '2025-06-09' },
  { day: 'Tue', date: '2025-06-10' },
  { day: 'Wed', date: '2025-06-11' },
  { day: 'Thu', date: '2025-06-12' },
  { day: 'Fri', date: '2025-06-13' },
  { day: 'Sat', date: '2025-06-14' }
];

function renderGraph(selectedDate = null) {
  const graph = document.getElementById('graph');
  graph.innerHTML = '';
  weeklyData.forEach(data => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    if (data.date === selectedDate) bar.classList.add('selected');

    // Add tooltip
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltip';
    tooltip.textContent = activityData[data.date]?.total || 'No data';
    bar.appendChild(tooltip);

    // Animate bar height
    bar.style.height = '0%';
    setTimeout(() => {
      bar.style.height = '80%';
    }, 100);

    bar.innerHTML += `<small>${data.day}</small>`;
    bar.onclick = () => {
      loadDayData(data.date);
      renderGraph(data.date);
    };

    graph.appendChild(bar);
  });
}

function renderAppList(apps) {
  const list = document.getElementById('appList');
  list.innerHTML = '';
  apps.forEach(app => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${app.name}</strong> – ${app.time}
      <input type="range" min="0" max="300" value="60" style="width: 100%;" />
    `;
    list.appendChild(li);
  });
}

function loadDayData(date) {
  const data = activityData[date];
  const totalEl = document.getElementById('totalTime');
  const label = document.getElementById('dateLabel');

  if (data) {
    totalEl.textContent = data.total;
    label.textContent = `${data.day}, ${date}`;
    renderAppList(data.apps);
  } else {
    totalEl.textContent = "No data available";
    label.textContent = date;
    renderAppList([]);
  }

  renderGraph(date);
}

// Load data from external JSON
fetch('activityData.json')
  .then(response => response.json())
  .then(data => {
    activityData = data;
    renderGraph();
  });

// Date Picker
document.getElementById('datePicker').addEventListener('change', (e) => {
  const selectedDate = e.target.value;
  loadDayData(selectedDate);
});

// Mode toggle
document.getElementById('toggleMode').addEventListener('click', () => {
  const body = document.body;
  const btn = document.getElementById('toggleMode');
  body.classList.toggle('dark');
  body.classList.toggle('light');
  btn.textContent = body.classList.contains('dark') ? "Switch to Light Mode" : "Switch to Dark Mode";
});
