async function loadLeaderboard() {
    try {
        const response = await fetch('https://programming-burgas.com/api/contest/1a735f2c-6dfe-4e51-ac89-92598ec22546/leaderboard');
        const data = await response.json();
        const tableBody = document.getElementById('leaderboard').getElementsByTagName('tbody')[0];

        tableBody.innerHTML = '';
        data.forEach(item => {
            let row = tableBody.insertRow();
            let usernameCell = row.insertCell(0);
            let scoreCell = row.insertCell(1);
            usernameCell.textContent = item.username;
            scoreCell.textContent = item.score;
        });
    } catch (error) {
        console.error('Failed to load leaderboard data:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadLeaderboard);