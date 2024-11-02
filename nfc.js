document.addEventListener('DOMContentLoaded', async () => {
    const scanButton = document.getElementById('scan-button');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const serialNumberSpan = document.getElementById('serial-number');
    const tngNumberSpan = document.getElementById('tng-number');
    const unsupportedMessage = document.getElementById('unsupported-message');

    if ('NDEFReader' in window) {
        scanButton.classList.remove('hidden');
    } else {
        unsupportedMessage.classList.remove('hidden');
    }

    scanButton.addEventListener('click', async () => {
        loadingDiv.classList.remove('hidden');
        resultDiv.classList.add('hidden');

        try {
            const ndef = new NDEFReader();
            await ndef.scan();

            ndef.addEventListener("reading", ({ message, serialNumber }) => {
                console.log(`> Serial Number: ${serialNumber}`);
                console.log(`> Records: (${message.records.length})`);

                const reorderedSerial = serialNumber.split(':').reverse().join('');
                serialNumberSpan.textContent = serialNumber;

                const tngNumber = parseInt(reorderedSerial, 16);
                tngNumberSpan.textContent = tngNumber;

                loadingDiv.classList.add('hidden');
                resultDiv.classList.remove('hidden');

                Toastify({
                    text: "Read NRIC TnG S/N Successfully!",
                    backgroundColor: "green",
                    duration: 3000
                }).showToast();

                ndef.onreading = null;
            });

        } catch (error) {
            loadingDiv.classList.add('hidden');
            unsupportedMessage.classList.remove('hidden');
            Toastify({
                text: "Failed to read! Please ensure you are scanning your Malaysia NRIC card!",
                backgroundColor: "red",
                duration: 3000
            }).showToast();
        }
    });

    document.getElementById('copy-serial').addEventListener('click', () => {
        navigator.clipboard.writeText(serialNumberSpan.textContent);
        Toastify({ text: "Copied NFC Serial Number!", duration: 2000, backgroundColor: "blue" }).showToast();
    });

    document.getElementById('copy-tng').addEventListener('click', () => {
        navigator.clipboard.writeText(tngNumberSpan.textContent);
        Toastify({ text: "Copied TNG Serial Number!", duration: 2000, backgroundColor: "blue" }).showToast();
    });
});
