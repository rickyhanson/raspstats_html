// import { initializeApp } from "firebase/app";
// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
console.log("Testing app.js")

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBx2WUSnbqeQ5OjBq6_isl_pwNxqJTD_s",
  authDomain: "raspstats.firebaseapp.com",
  databaseURL: "https://raspstats-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "raspstats",
  storageBucket: "raspstats.firebasestorage.app",
  messagingSenderId: "217400523144",
  appId: "1:217400523144:web:3e62e6ffed2a594bbaa23d"
};

// Initialize Firebase
//firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);

// You can now use Firebase Authentication and other Firebase services
//const auth = firebase.auth();
const auth = getAuth(app);

// Initialize the Realtime Database
const database = getDatabase(app);

console.log("testing")

// Read data from Realtime Database and render it
const readData = async (path) => {
    const dbRef = ref(database);
    try {
      const snapshot = await get(child(dbRef, path));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const entries = [];
  
        // Collect entries and add them to an array
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            entries.push({
              timestamp: data[key].timestamp,
              temperature: data[key].temperature
            });
          }
        }
  
        // Sort entries by timestamp
        entries.sort((a, b) => a.timestamp - b.timestamp);
  
        // Display all data in the table
        displayTable(entries);
  
        // Get and display data for the most recent day in the chart
        const mostRecentDate = getMostRecentDate(entries);
        const dataForMostRecentDay = filterDataByDate(entries, mostRecentDate);
        displayChart(dataForMostRecentDay);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  // Get the most recent date from the data
  const getMostRecentDate = (entries) => {
    const mostRecentTimestamp = entries[entries.length - 1].timestamp;
    const mostRecentDate = new Date(mostRecentTimestamp);
    return mostRecentDate.toLocaleDateString(); // Return the date part
  };
  
  // Filter data to get readings for the most recent day
  const filterDataByDate = (entries, date) => {
    return entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate.toLocaleDateString() === date;
    });
  };
  
  // Display all data in the table
  const displayTable = (entries) => {
    const tableBody = document.querySelector('#temperatureTable tbody');
    tableBody.innerHTML = '';  // Clear any existing rows
  
    entries.forEach(entry => {
      const row = document.createElement('tr');
      const timestampCell = document.createElement('td');
      const temperatureCell = document.createElement('td');
  
      timestampCell.textContent = new Date(entry.timestamp).toLocaleString(); // Format timestamp
      temperatureCell.textContent = entry.temperature;
  
      row.appendChild(timestampCell);
      row.appendChild(temperatureCell);
  
      tableBody.appendChild(row);
    });
  };
  
  // Display data for the most recent day in the chart using Chart.js
  const displayChart = (entries) => {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    
    const timestamps = entries.map(entry => new Date(entry.timestamp).toLocaleString()); // X-axis labels (timestamps)
    const temperatures = entries.map(entry => entry.temperature); // Y-axis data (temperature values)
  
    const chart = new Chart(ctx, {
      type: 'line', // Line chart
      data: {
        labels: timestamps,  // X-axis labels (timestamps)
        datasets: [{
          label: 'Temperature (\u00B0C)',
          data: temperatures,  // Y-axis data (temperature values)
          borderColor: 'rgba(75, 192, 192, 1)', // Line color
          borderWidth: 1,
          fill: false
        }]
      },
      options: {
        scales: {
          x: {
            ticks: {
              maxRotation: 45, // Rotate labels for better readability
              minRotation: 45
            }
          },
          y: {
            beginAtZero: false // The Y-axis doesn't need to start at zero
          }
        }
      }
    });
  };
  
  // Example usage of reading and displaying data
  readData('temperature_data');

/*
const readData = async (path) => {
  const dbRef = ref(database);
  try {
    const snapshot = await get(child(dbRef, path));
    if (snapshot.exists()) {
      // Extracting the data from each generated key
      const data = snapshot.val();
      
      // Iterate over each generated key in the data
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          const entry = data[key]; // This will be the { timestamp, temperature } object
          const timestamp = entry.timestamp;
          const temperature = entry.temperature;
          
          // Log the extracted data (you can use it as needed)
          console.log(`Key: ${key}, Timestamp: ${timestamp}, Temperature: ${temperature}`);
        }
      }
    } else {
      console.log('No data available');
    }
  } catch (error) {
    console.error(error);
  }
};

// Example usage of reading data:
readData('temperature_data');
*/

/*
// 2. Reading data from Realtime Database
const readData = async (name) => {
  const dbRef = ref(database);
  try {
    const snapshot = await get(child(dbRef, name));
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log('No data available');
    }
  } catch (error) {
    console.error(error);
  }
};

// Example usage of reading data:
readData('temperature_data');
*/

/*
const dbRef = ref(temperature_data);

ref.on('value', (snapshot) => {
  const data = snapshot.val();
  const tableBody = document.getElementById('dataTable');
  const chartLabels = [];
  const chartData = [];

  tableBody.innerHTML = ''; // Clear the table

  // Process data
  for (let key in data) {
    console.error("Test1");
    
    const entry = data[key];
    const row = document.createElement('tr');
    const timestampCell = document.createElement('td');
    const temperatureCell = document.createElement('td');

    timestampCell.textContent = entry.timestamp;
    temperatureCell.textContent = entry.temperature;

    row.appendChild(timestampCell);
    row.appendChild(temperatureCell);
    tableBody.appendChild(row);

    // Prepare data for the chart
    chartLabels.push(entry.timestamp);
    chartData.push(entry.temperature);
  }

  // Update chart
  updateChart(chartLabels, chartData);
});

// Create a Chart.js chart
const ctx = document.getElementById('temperatureChart').getContext('2d');
let temperatureChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Temperature ("C)',
      data: [],
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      fill: false
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: 'Timestamp' }
      },
      y: {
        title: { display: true, text: 'Temperature ("C)' },
        beginAtZero: false
      }
    }
  }
});

// Function to update chart
function updateChart(labels, data) {
  temperatureChart.data.labels = labels;
  temperatureChart.data.datasets[0].data = data;
  temperatureChart.update();
}
  */
