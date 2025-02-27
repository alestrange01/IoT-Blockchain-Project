const apiUrl = 'https://blockstream.info/api/mempool/recent';

async function loadMempoolTransactions() {
    try {
        document.getElementById('spinner-overlay').style.visibility = 'visible';
        document.getElementById('spinner-overlay').style.opacity = '1';
        document.body.classList.add('blur');

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Errore nella chiamata API: ${response.status}`);
        }
        const transactions = await response.json();
        return transactions;
    } catch (error) {
        console.error('Errore durante il caricamento delle transazioni:', error);
        return [];
    } finally {
        document.getElementById('spinner-overlay').style.opacity = '0';
        document.body.classList.remove('blur');
        setTimeout(() => {
            document.getElementById('spinner-overlay').style.visibility = 'hidden';
        }, 300);
    }
}

function addTransactionsToTable(transactions) {
    const tableBody = document.querySelector('#mempool-table tbody');
    transactions.forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tx.txid}</td>
            <td>${(tx.value/ 100000000).toFixed(8)} BTC</td>
            <td>${tx.vsize} vB</td>
            <td>${tx.fee} sat</td>
        `;
        row.addEventListener('click', () => {
            window.location.href = `./transaction-details.html?id=${tx.txid}`;
        });
        row.style.cursor = 'pointer';
        tableBody.appendChild(row);
    });
}

(async function initialize() {
    const transactions = await loadMempoolTransactions();
    if (transactions.length > 0) {
        addTransactionsToTable(transactions);
    } else {
        alert('Errore durante il caricamento delle transazioni dalla mempool.');
    }
})();
