const activityData = {
  "2025-06-08": {
    day: "Sunday",
    total: "14 hrs, 17 mins",
    apps: [
      { name: "ChatGPT", time: "5 hrs, 1 min" },
      { name: "YouTube", time: "2 hrs, 47 mins" },
      { name: "Free Fire MAX", time: "1 hr, 49 mins" },
      { name: "Facebook", time: "1 hr, 20 mins" },
      { name: "Drive", time: "48 mins" }
    ]
  },
  "2025-06-10": {
    day: "Tuesday",
    total: "8 hrs, 40 mins",
    apps: [
      { name: "YouTube", time: "3 hrs" },
      { name: "Facebook", time: "2 hrs" },
      { name: "Instagram", time: "1 hr, 20 mins" }
    ]
  }
};

// Weekly summary for graph
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
    if (data.date === selectedDate) {
      bar.classList.add('selected');
    }
    bar.style.height = '80%';
    bar.innerHTML = `<small>${data.day}</small>`;
    bar.onclick = () => {
      loadDayData(data.date);
      renderGraph(data.date); // Highlight selected bar
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

  renderGraph(date); // highlight bar when selected from date picker
}


// Date Picker
document.getElementById('datePicker').addEventListener('change', (e) => {
  const selectedDate = e.target.value;
  loadDayData(selectedDate);
});

// Dark/Light Mode Toggle
document.getElementById('toggleMode').addEventListener('click', () => {
  const body = document.body;
  const btn = document.getElementById('toggleMode');
  body.classList.toggle('dark');
  body.classList.toggle('light');
  btn.textContent = body.classList.contains('dark') ? "Switch to Light Mode" : "Switch to Dark Mode";
});

// Init
renderGraph();
