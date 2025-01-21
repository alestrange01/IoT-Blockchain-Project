const apiUrl = 'https://blockstream.info/api/tx/';
const params = new URLSearchParams(window.location.search);
const txId = params.get('id');

async function loadTransactionDetails(txId) {
    try {
        const response = await fetch(`${apiUrl}${txId}`);
        if (!response.ok) {
            throw new Error(`Errore nel recupero della transazione: ${response.status}`);
        }
        const transaction = await response.json();
        displayTransactionDetails(transaction);
    } catch (error) {
        document.getElementById('transaction-details').innerHTML = `<p>Errore: ${error.message}</p>`;
    }
}

function displayTransactionDetails(transaction) {
    document.getElementById('transaction-details').innerHTML = `
        <h2>Transazione ${transaction.txid}</h2>
        <p><strong>Stato:</strong> ${transaction.status.confirmed ? "Confermata" : "Non confermata"}</p>
        <p><strong>Data:</strong> ${transaction.status.confirmed ? new Date(transaction.status.block_time * 1000).toLocaleString() : "N/A"}</p>
        <p><strong>Commissione:</strong> ${(transaction.fee / 100000000).toFixed(8)} BTC</p>
        <p><strong>Dimensione:</strong> ${transaction.size} B</p>
        <p><strong>Versione:</strong> ${transaction.version}</p>
        <p><strong>Lock Time:</strong> ${transaction.locktime}</p>
    `;
}

if (txId) {
    loadTransactionDetails(txId);
} else {
    document.getElementById('transaction-details').innerHTML = '<p>ID della transazione non fornito.</p>';
}
