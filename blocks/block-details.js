const apiUrl = 'https://blockstream.info/api/block/';
const params = new URLSearchParams(window.location.search);
const blockId = params.get('id');

async function loadBlockDetails(blockId) {
    try {
        if (!blockId) {
            throw new Error('ID del blocco non fornito.');
        }
        showSpinner();
        const response = await fetch(`${apiUrl}${blockId}`);
        if (!response.ok) {
            throw new Error(`Errore nel recupero del blocco: ${response.status}`);
        }
        const block = await response.json();
        displayBlockDetails(block);
    } catch (error) {
        console.error('Errore:', error);
        document.getElementById('block-details').innerHTML = `<p>Errore: ${error.message}</p>`;
    } finally {
        hideSpinner();
    }
}

function displayBlockDetails(block) {
    const tableBody = document.querySelector('#block-details-table tbody');
    if (!tableBody) {
        console.error('Elemento tbody non trovato.');
        return;
    }
    tableBody.innerHTML = `
        <tr><td>Altezza</td><td>${block.height}</td></tr>
        <tr><td>Hash</td><td>${block.id}</td></tr>
        <tr><td>Timestamp</td><td>${new Date(block.timestamp * 1000).toLocaleString()}</td></tr>
        <tr><td>Transazioni</td><td>${block.tx_count}</td></tr>
        <tr><td>Dimensione</td><td>${(block.size / 1000).toFixed(3)} KB</td></tr>
        <tr><td>Peso</td><td>${(block.weight / 1000).toFixed(3)} kWU</td></tr>
        <tr><td>Merkle Root</td><td>${block.merkle_root}</td></tr>
        <tr><td>Nonce</td><td>${block.nonce}</td></tr>
        <tr><td>Hash Blocco Precedente</td>
            <td><a href="block-details.html?id=${block.previousblockhash}" class="prevblock-link">${block.previousblockhash}</a></td>
        </tr>
        <tr><td>Tempo Mediano</td><td>${new Date(block.mediantime * 1000).toLocaleString()}</td></tr>
        <tr><td>Difficoltà</td><td>${block.difficulty}</td></tr>
        <tr><td>Bits</td><td>${block.bits}</td></tr>
    `;
}

async function loadBlockTransactions(blockId) {
    try {
        const response = await fetch(`https://blockstream.info/api/block/${blockId}/txs`);
        if (!response.ok) {
            throw new Error(`Errore nel recupero delle transazioni del blocco: ${response.status}`);
        }
        const transactions = await response.json();
        displayBlockTransactions(transactions);
    } catch (error) {
        console.error('Errore durante il caricamento delle transazioni:', error);
        const txTable = document.getElementById('block-transactions');
        txTable.innerHTML = `<p>Errore nel caricamento delle transazioni: ${error.message}</p>`;
    }
}

function displayBlockTransactions(transactions) {
    const txTable = document.querySelector('#block-transactions tbody');
    if (!txTable) {
        console.error('Elemento per le transazioni non trovato.');
        return;
    }
    txTable.innerHTML = transactions.map(tx => `
        <tr>
            <td><a href="../mempool/transaction-details.html?id=${tx.txid}" class="tx-link">${tx.txid}</a></td>
            <td>${tx.fee} sat</td>
            <td>${tx.size} B</td>
        </tr>
    `).join('');
}


function showSpinner() {
    const spinnerOverlay = document.getElementById('spinner-overlay');
    if (spinnerOverlay) {
        spinnerOverlay.style.visibility = 'visible';
        spinnerOverlay.style.opacity = '1';
        document.body.classList.add('blur');
    }
}

function hideSpinner() {
    const spinnerOverlay = document.getElementById('spinner-overlay');
    if (spinnerOverlay) {
        spinnerOverlay.style.opacity = '0';
        document.body.classList.remove('blur');
        setTimeout(() => {
            spinnerOverlay.style.visibility = 'hidden';
        }, 300);
    }
}

if (blockId) {
    loadBlockDetails(blockId);
    loadBlockTransactions(blockId);
} else {
    document.getElementById('block-details').innerHTML = '<p>ID del blocco non fornito.</p>';
}
