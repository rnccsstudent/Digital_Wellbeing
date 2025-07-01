const weeklyData = [
  { day: 'Sun', hrs: 14.3 },
  { day: 'Mon', hrs: 9.1 },
  { day: 'Tue', hrs: 8.4 },
  { day: 'Wed', hrs: 11.6 },
  { day: 'Thu', hrs: 11.3 },
  { day: 'Fri', hrs: 9.8 },
  { day: 'Sat', hrs: 10.2 }
];

let apps = [
  { name: 'ChatGPT', time: '5 hrs, 1 min' },
  { name: 'YouTube', time: '2 hrs, 47 mins' },
  { name: 'Free Fire MAX', time: '1 hr, 49 mins' },
  { name: 'Facebook', time: '1 hr, 20 mins' },
  { name: 'Drive', time: '48 mins' }
];

function renderGraph() {
  const graph = document.getElementById('graph');
  graph.innerHTML = '';
  weeklyData.forEach(data => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${(data.hrs / 15) * 100}%`;
    bar.innerHTML = `<small>${data.day}</small>`;
    graph.appendChild(bar);
  });
}

function renderAppList() {
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

// Mode toggle
document.getElementById('toggleMode').addEventListener('click', () => {
  const body = document.body;
  const btn = document.getElementById('toggleMode');
  if (body.classList.contains('dark')) {
    body.classList.remove('dark');
    body.classList.add('light');
    btn.textContent = "Switch to Dark Mode";
  } else {
    body.classList.remove('light');
    body.classList.add('dark');
    btn.textContent = "Switch to Light Mode";
  }
});

// Form to add app
document.getElementById('addAppForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('appName').value.trim();
  const time = document.getElementById('appTime').value.trim();
  if (name && time) {
    apps.push({ name, time });
    renderAppList();
    e.target.reset();
  }
});

// Initial render
renderGraph();
renderAppList();
