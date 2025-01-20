const apiUrl = 'https://blockstream.info/api/blocks/';
let lastBlockHeight = null;

async function loadBlocks(nextUrl = apiUrl) {
    try {
        document.getElementById('spinner-overlay').style.visibility = 'visible';
        document.getElementById('spinner-overlay').style.opacity = '1';
        document.body.classList.add('blur');

        const response = await fetch(nextUrl);
        if (!response.ok) {
            throw new Error(`Errore nella chiamata API: ${response.status}`);
        }
        const blocks = await response.json();
        return blocks; 
    } catch (error) {
        console.error('Errore durante il caricamento dei blocchi:', error);
        return [];
    } finally {
        document.getElementById('spinner-overlay').style.opacity = '0';
        document.body.classList.remove('blur');
        setTimeout(() => {
            document.getElementById('spinner-overlay').style.visibility = 'hidden';
        }, 300);
    }
}

function addBlocksToTable(blocks) {
    const tableBody = document.querySelector('#blocks-table tbody');
    blocks.forEach(block => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${block.height}</td>
            <td>${new Date(block.timestamp * 1000).toLocaleString()}</td>
            <td>${block.tx_count}</td>
            <td>${(block.size / 1000).toFixed(3)}</td>
            <td>${(block.weight / 1000).toFixed(3)}</td>
        `;
        tableBody.appendChild(row);
    });
    if (blocks.length > 0) {
        lastBlockHeight = blocks[blocks.length - 1].height;
    }
}

document.getElementById('expand-table').addEventListener('click', async () => {
    if (lastBlockHeight !== null) {
        const nextUrl = `${apiUrl}${lastBlockHeight}`;
        const blocks = await loadBlocks(nextUrl);
        if (blocks.length > 0) {
            addBlocksToTable(blocks);
        } else {
            alert('Non ci sono più blocchi da caricare.');
        }
    } else {
        alert('Errore: non è possibile determinare l\'altezza del prossimo blocco.');
    }
});

(async function initialize() {
    const blocks = await loadBlocks();
    if (blocks.length > 0) {
        addBlocksToTable(blocks);
    } else {
        alert('Errore durante il caricamento dei blocchi iniziali.');
    }
})();
