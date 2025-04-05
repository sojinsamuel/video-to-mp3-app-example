const express = require('express');
const multer = require('multer');
const ffmpeg = require('ffmpeg-static');
const { exec } = require('child_process');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');

const app = express();
const port = 3001;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// File cleanup interval (every 10 minutes)
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds
const FILE_RETENTION_TIME = 10 * 60 * 1000; // Retain files for 10 minutes

// Track uploaded files with timestamps
const uploadedFiles = new Map();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('video'), async (req, res) => {
    try {
        const videoPath = req.file.path;
        const audioPath = path.join(__dirname, 'uploads', `${req.file.filename}.mp3`);

        // Check if video has audio and extract it
        const ffmpegCommand = `${ffmpeg} -i ${videoPath} -vn -acodec mp3 ${audioPath}`;
        
        exec(ffmpegCommand, async (error) => {
            if (error) {
                // If FFmpeg fails, it might indicate no audio or another issue
                fs.unlinkSync(videoPath);
                return res.json({ 
                    success: false, 
                    message: 'No audio detected in the video or processing failed' 
                });
            }

            // Clean up video file
            fs.unlinkSync(videoPath);

            // Track the audio file with a timestamp
            uploadedFiles.set(audioPath, Date.now());

            // Upload to Catbox.moe
            try {
                const form = new FormData();
                form.append('reqtype', 'fileupload');
                form.append('fileToUpload', fs.createReadStream(audioPath));

                const catboxResponse = await axios.post('https://catbox.moe/user/api.php', form, {
                    headers: form.getHeaders()
                });

                if (catboxResponse.data.startsWith('https://files.catbox.moe/')) {
                    res.json({
                        success: true,
                        audioFile: `${req.file.filename}.mp3`,
                        catboxLink: catboxResponse.data
                    });
                } else {
                    // Clean up audio file if Catbox upload fails
                    fs.unlinkSync(audioPath);
                    uploadedFiles.delete(audioPath);
                    res.json({
                        success: false,
                        message: 'Catbox upload failed: ' + catboxResponse.data
                    });
                }
            } catch (catboxError) {
                // Clean up audio file if Catbox upload fails
                fs.unlinkSync(audioPath);
                uploadedFiles.delete(audioPath);
                res.json({
                    success: false,
                    message: 'Error uploading to Catbox: ' + (catboxError.response?.data || catboxError.message)
                });
            }
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Error processing video: ' + error.message
        });
    }
});

// Cleanup old files periodically
setInterval(() => {
    const now = Date.now();
    for (const [filePath, timestamp] of uploadedFiles.entries()) {
        if (now - timestamp > FILE_RETENTION_TIME) {
            try {
                fs.unlinkSync(filePath);
                uploadedFiles.delete(filePath);
                console.log(`Cleaned up file: ${filePath}`);
            } catch (error) {
                console.error(`Error cleaning up file ${filePath}:`, error.message);
            }
        }
    }
}, CLEANUP_INTERVAL);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});