const apiUrl = 'https://blockstream.info/api/block/';
const params = new URLSearchParams(window.location.search);
const blockId = params.get('id');

async function loadBlockDetails(blockId) {
    try {
        const response = await fetch(`${apiUrl}${blockId}`);
        if (!response.ok) {
            throw new Error(`Errore nel recupero del blocco: ${response.status}`);
        }
        const block = await response.json();
        displayBlockDetails(block);
    } catch (error) {
        document.getElementById('block-details').innerHTML = `<p>Errore: ${error.message}</p>`;
    }
}

function displayBlockDetails(block) {
    document.getElementById('block-details').innerHTML = `
        <h2>Blocco #${block.height}</h2>
        <p><strong>Hash:</strong> ${block.id}</p>
        <p><strong>Timestamp:</strong> ${new Date(block.timestamp * 1000).toLocaleString()}</p>
        <p><strong>Transazioni:</strong> ${block.tx_count}</p>
        <p><strong>Dimensione:</strong> ${(block.size / 1000).toFixed(3)} KB</p>
        <p><strong>Peso:</strong> ${(block.weight / 1000).toFixed(3)} kWU</p>
    `;
}

if (blockId) {
    loadBlockDetails(blockId);
} else {
    document.getElementById('block-details').innerHTML = '<p>ID del blocco non fornito.</p>';
}
