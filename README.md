# 🎬🎵 Video to MP3 Converter - Node.js Example Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This repository contains the source code for a simple Node.js web application that converts uploaded video files (MP4) into downloadable MP3 audio files. It also leverages the [Catbox.moe](https://catbox.moe/) API to generate temporary shareable links for the converted audio.

**Purpose:** This application serves as a standalone example and is the base application code used in deployment tutorials, such as the [Pulumi Deploy and Document Challenge](https://dev.to/sojinsamuel/pulumi-v2-4fai) submission which deploys this app to AWS using Pulumi.

![Application Screenshot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/09p2lam9mqgkikx2k8ik.png)
*(Screenshot of the deployed application)*

---

## ✨ Features

*   **Video Upload:** Accepts MP4 video file uploads via a web interface.
*   **MP3 Extraction:** Uses `ffmpeg` on the server to extract the audio track and convert it to MP3 format.
*   **Audio Playback:** Allows playback of the extracted audio directly in the browser.
*   **MP3 Download:** Provides a direct download link for the converted MP3 file.
*   **Shareable Links:** Integrates with Catbox.moe to upload the MP3 and generate a temporary shareable link.
*   **Simple UI:** Basic HTML, CSS, and JavaScript frontend.
*   **Automatic Cleanup:** Deletes processed video and audio files from the server after a set interval (currently 10 minutes).

---

## 🛠️ Technology Stack

*   **Backend:** Node.js, Express.js
*   **File Uploads:** Multer
*   **Video Processing:** `ffmpeg` (via `ffmpeg-static` npm package and system install if needed)
*   **File Sharing:** Catbox.moe API (via Axios)
*   **Frontend:** HTML, CSS, Vanilla JavaScript

---

## 🚀 Getting Started (Running Locally)

Follow these steps to run the application on your local machine for testing or development.

### Prerequisites

*   **Node.js & npm:** Version 18.x or higher recommended. ([Download Node.js](https://nodejs.org/))
*   **`ffmpeg`:** You **must** have `ffmpeg` installed on your system and accessible in your PATH. This application relies on executing the `ffmpeg` command. ([Download FFmpeg](https://ffmpeg.org/download.html))
*   **Git:** To clone the repository. ([Download Git](https://git-scm.com/downloads))

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/sojinsamuel/video-to-mp3-app-example.git video-to-mp3-app
    ```

2.  **Navigate into the directory:**
    ```bash
    cd video-to-mp3-app
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```
    <!-- GIF: Running npm install -->

4.  **Run the server:**
    ```bash
    node server.js
    ```
    You should see output like: `Server running at http://localhost:3001`

5.  **Access the application:**
    Open your web browser and navigate to `http://localhost:3001`.

6.  **Test:** Try uploading a small MP4 video file.

7.  **Stop the server:** Press `Ctrl+C` in the terminal where the server is running.

---

## ⚙️ How it Works

1.  **Frontend (`public/index.html`, `script.js`):** Provides the file upload interface. When a user selects a file and clicks "Upload and Process", it sends the video file via a POST request to the `/upload` endpoint.
2.  **Backend (`server.js`):**
    *   Uses **Express** to handle routing.
    *   Uses **Multer** to handle the `multipart/form-data` upload, saving the video temporarily to the `./uploads/` directory.
    *   Executes an **`ffmpeg` command** (`child_process.exec`) to extract the audio (`-vn`), convert it to MP3 (`-acodec mp3`), and save it to the `./uploads/` directory with an `.mp3` extension.
    *   The original video file is deleted.
    *   Uses **Axios** and **FormData** to upload the resulting MP3 file to the **Catbox.moe API**.
    *   Sends a JSON response back to the frontend containing the path to the locally accessible MP3 (`/uploads/filename.mp3`) and the public Catbox.moe link.
    *   Includes a basic **file cleanup mechanism** (`setInterval`) to delete files in the `./uploads/` directory older than 10 minutes.

---

## 🔧 Configuration

For this example application:

*   The server port is hardcoded to `3001` in `server.js`.
*   The Catbox.moe API endpoint (`https://catbox.moe/user/api.php`) is hardcoded.
*   File retention time (10 minutes) is set as a constant in `server.js`.

For production deployments, consider using environment variables for configuration.


## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or PR here.
