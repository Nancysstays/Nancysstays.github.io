function calculate() {
    const rooms = parseFloat(document.getElementById("rooms").value);
    const occupancy = parseFloat(document.getElementById("occupancy").value) / 100;
    const roomRate = parseFloat(document.getElementById("roomRate").value);
    const staff = parseFloat(document.getElementById("staff").value);
    const utilities = parseFloat(document.getElementById("utilities").value);
    const maintenance = parseFloat(document.getElementById("maintenance").value);
    const other = parseFloat(document.getElementById("other").value);

    const income = rooms * occupancy * roomRate * 30; // Assuming monthly calculation
    const totalExpenses = staff + utilities + maintenance + other;
    const profit = income - totalExpenses;

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `
        <p><strong>Income:</strong> $${income.toFixed(2)}</p>
        <p><strong>Total Expenses:</strong> $${totalExpenses.toFixed(2)}</p>
        <p><strong>Profit:</strong> $${profit.toFixed(2)}</p>
    `;

    saveData(rooms, occupancy, roomRate, staff, utilities, maintenance, other, income, totalExpenses, profit);
    showSavedData();
}

function saveData(rooms, occupancy, roomRate, staff, utilities, maintenance, other, income, totalExpenses, profit) {
    const data = {
        rooms, occupancy, roomRate, staff, utilities, maintenance, other, income, totalExpenses, profit,
        date: new Date().toLocaleDateString()
    };
    let savedData = JSON.parse(localStorage.getItem("hotelData")) || [];
    savedData.push(data);
    localStorage.setItem("hotelData", JSON.stringify(savedData));
}

function showSavedData() {
    const savedData = JSON.parse(localStorage.getItem("hotelData")) || [];
    const savedDataDiv = document.getElementById("savedData");
    savedDataDiv.innerHTML = ""; // Clear previous data

    if (savedData.length === 0) {
        savedDataDiv.innerHTML = "<p>No saved data yet.</p>";
        return;
    }

    const groupedData = savedData.reduce((acc, curr) => {
        const date = curr.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(curr);
        return acc;
    }, {});

    for (const date in groupedData) {
        const dateData = groupedData[date];
        let dateHtml = `<h3>${date}</h3><ul>`;
        dateData.forEach(data => {
            dateHtml += `<li>
                Rooms: ${data.rooms}, Occupancy: ${data.occupancy * 100}%, 
                Room Rate: $${data.roomRate}, Income: $${data.income.toFixed(2)}, 
                Expenses: $${data.totalExpenses.toFixed(2)}, Profit: $${data.profit.toFixed(2)}
            </li>`;
        });
        dateHtml += "</ul>";
        savedDataDiv.innerHTML += dateHtml;
    }
}

// Initial display of saved data
showSavedData();
