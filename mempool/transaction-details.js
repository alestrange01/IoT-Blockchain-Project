const apiUrl = 'https://blockstream.info/api/tx/';
const params = new URLSearchParams(window.location.search);
const txId = params.get('id');

async function loadTransactionDetails(txId) {
    try {
        showSpinner();
        const response = await fetch(`${apiUrl}${txId}`);
        if (!response.ok) {
            throw new Error(`Errore nel recupero della transazione: ${response.status}`);
        }
        const transaction = await response.json();
        displayTransactionDetails(transaction);
    } catch (error) {
        document.getElementById('details-content').innerHTML = `<p>Errore: ${error.message}</p>`;
    } finally {
        hideSpinner();
    }
}

function displayTransactionDetails(transaction) {
    const detailsContent = document.getElementById('details-content');
    detailsContent.style.display = 'block';


    const isCoinbase = transaction.vin.some(input => input.is_coinbase);

    let inputsSection = '';
    if (isCoinbase) {
        inputsSection = `
            <h3>Input</h3>
            <p>Questa è una transazione coinbase. Non ha input tradizionali.</p>
        `;
    } else {
        const inputs = transaction.vin.map((input, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${input.prevout.scriptpubkey_address || 'N/A'}</td>
                <td>${(input.prevout.value / 100000000).toFixed(8)} BTC</td>
            </tr>
        `).join('');
        inputsSection = `
            <h3>Input</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Indirizzo</th>
                        <th>Importo</th>
                    </tr>
                </thead>
                <tbody>
                    ${inputs}
                </tbody>
            </table>
        `;
    }

    const outputs = transaction.vout.map((output, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${output.scriptpubkey_address || 'N/A'}</td>
            <td>${(output.value / 100000000).toFixed(8)} BTC</td>
            <td>${output.scriptpubkey_type || 'N/A'}</td>
        </tr>
    `).join('');


    const blockLink = transaction.status.confirmed
        ? `<p><strong>Blocco Confermato:</strong> <a href="../blocks/block-details.html?id=${transaction.status.block_hash}" class="prevblock-link">${transaction.status.block_hash}</a></p>
          <p><strong>Altezza Blocco:</strong> ${transaction.status.block_height}</p>`
        : '';

    detailsContent.innerHTML = `
        <h2>Transazione ${transaction.txid}</h2>
        <p><strong>Stato:</strong> ${transaction.status.confirmed ? "Confermata" : "Non confermata"}</p>
        ${blockLink}
        <p><strong>Data:</strong> ${transaction.status.confirmed ? new Date(transaction.status.block_time * 1000).toLocaleString() : "N/A"}</p>
        <p><strong>Coinbase:</strong> ${isCoinbase ? "Sì" : "No"}</p>
        <p><strong>Commissione:</strong> ${transaction.fee} sat</p>
        <p><strong>Dimensione:</strong> ${transaction.size} B</p>
        <p><strong>Versione:</strong> ${transaction.version}</p>
        <p><strong>Lock Time:</strong> ${transaction.locktime}</p>

        ${inputsSection}


        <h3>Output</h3>
        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Indirizzo</th>
                    <th>Importo</th>
                    <th>Tipo</th>
                </tr>
            </thead>
            <tbody>
                ${outputs}
            </tbody>
        </table>
    `;
}

function showSpinner() {
    const spinnerOverlay = document.getElementById('spinner-overlay');
    spinnerOverlay.classList.add('visible');
}

function hideSpinner() {
    const spinnerOverlay = document.getElementById('spinner-overlay');
    spinnerOverlay.classList.remove('visible');
}

if (txId) {
    loadTransactionDetails(txId);
} else {
    document.getElementById('details-content').innerHTML = '<p>ID della transazione non fornito.</p>';
}
