let activityData = {};
let pieChart = null;

const weeklyData = [
  { day: 'Sun', date: '2025-06-08', hrs: 15 },
  { day: 'Mon', date: '2025-06-09', hrs: 12 },
  { day: 'Tue', date: '2025-06-10', hrs: 8 },
  { day: 'Wed', date: '2025-06-11', hrs: 10 },
  { day: 'Thu', date: '2025-06-12', hrs: 11 },
  { day: 'Fri', date: '2025-06-13', hrs: 13 },
  { day: 'Sat', date: '2025-06-14', hrs: 9 }
];


function renderGraph(selectedDate = null) {
  const graph = document.getElementById('graph');
  graph.innerHTML = '';

  const maxHours = Math.max(...weeklyData.map(d => d.hrs)); // Find max for scaling

  weeklyData.forEach(data => {
    const bar = document.createElement('div');
    bar.className = 'bar';

    const heightPercent = (data.hrs / maxHours) * 100;
    bar.style.height = '0%'; // animate from 0

    setTimeout(() => {
      bar.style.height = `${heightPercent}%`;
    }, 100);

    if (data.date === selectedDate) bar.classList.add('selected');

    // Tooltip
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltip';
    tooltip.textContent = `${data.hrs} hrs`;
    bar.appendChild(tooltip);

    // Day label
    const label = document.createElement('small');
    label.textContent = data.day;
    bar.appendChild(label);

    bar.onclick = () => {
      loadDayData(data.date);
      renderGraph(data.date);
    };

    graph.appendChild(bar);
  });
}


function renderAppList(apps, totalTimeInMins) {
  const list = document.getElementById('appList');
  list.innerHTML = '';
  apps.forEach(app => {
    const appTimeMins = parseAppTime(app.time);
    const percent = Math.round((appTimeMins / totalTimeInMins) * 100);
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${app.name}</strong> – ${app.time} (${percent}%)
      <input type="range" min="0" max="100" value="${percent}" style="width: 100%;" />
    `;
    list.appendChild(li);
  });
}

function drawPieChart(apps, totalTimeInMins) {
  const labels = apps.map(app => app.name);
  const values = apps.map(app => parseAppTime(app.time));
  
  // Destroy existing chart if any
  if (pieChart) {
    pieChart.destroy();
  }

  const ctx = document.getElementById('pieChart').getContext('2d');
  pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          '#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff', '#f67019'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              const percent = ((context.parsed / totalTimeInMins) * 100).toFixed(1);
              return `${context.label}: ${percent}% (${context.parsed} mins)`;
            }
          }
        }
      }
    }
  });
}
function parseAppTime(timeStr) {
  let total = 0;
  const hrMatch = timeStr.match(/(\d+)\s*hr/);
  const minMatch = timeStr.match(/(\d+)\s*min/);
  if (hrMatch) total += parseInt(hrMatch[1]) * 60;
  if (minMatch) total += parseInt(minMatch[1]);
  return total;
}

function loadDayData(date) {
  const data = activityData[date];
  const totalEl = document.getElementById('totalTime');
  const label = document.getElementById('dateLabel');

  if (data) {
    totalEl.textContent = data.total;
    label.textContent = `${data.day}, ${date}`;

    const totalMins = parseAppTime(data.total);
    renderAppList(data.apps, totalMins);
    drawPieChart(data.apps, totalMins);
  } else {
    totalEl.textContent = "No data available";
    label.textContent = date;
    renderAppList([], 1);
    if (pieChart) pieChart.destroy();
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
