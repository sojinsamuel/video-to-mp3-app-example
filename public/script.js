document.getElementById('uploadBtn').addEventListener('click', async () => {
    const videoInput = document.getElementById('videoInput');
    const resultDiv = document.getElementById('result');
    const messageP = document.getElementById('message');
    const audioPlayer = document.getElementById('audioPlayer');
    const downloadLink = document.getElementById('downloadLink');
    const shareBtn = document.getElementById('shareBtn');
    const shareLink = document.getElementById('shareLink');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadSpinner = uploadBtn.querySelector('.spinner');

    if (!videoInput.files[0]) {
        alert('Please select a video file');
        return;
    }

    // Show loading state and disable button
    uploadBtn.disabled = true;
    uploadSpinner.classList.remove('hidden');

    const formData = new FormData();
    formData.append('video', videoInput.files[0]);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        // Reset UI
        resultDiv.classList.remove('hidden');
        shareBtn.classList.add('hidden');
        shareLink.classList.add('hidden');
        shareLink.textContent = '';

        if (data.success) {
            messageP.textContent = 'Audio extracted successfully!';
            audioPlayer.src = `/uploads/${data.audioFile}`;
            downloadLink.href = `/uploads/${data.audioFile}`;
            shareBtn.classList.remove('hidden');

            shareBtn.onclick = async () => {
                const shareSpinner = shareBtn.querySelector('.spinner');
                // Disable share button during processing
                shareBtn.disabled = true;
                shareSpinner.classList.remove('hidden');

                // Simulate some processing time (in real case, this might be an API call)
                shareLink.textContent = `Shareable link: ${data.catboxLink}`;
                shareLink.classList.remove('hidden');

                // Re-enable share button after processing
                shareSpinner.classList.add('hidden');
                shareBtn.disabled = false;
            };
        } else {
            messageP.textContent = data.message;
            audioPlayer.src = '';
            downloadLink.href = '#';
        }
    } catch (error) {
        messageP.textContent = 'An error occurred. Please try again.';
        console.error(error);
    } finally {
        // Always re-enable upload button and hide spinner, even on error
        uploadSpinner.classList.add('hidden');
        uploadBtn.disabled = false;
    }
});