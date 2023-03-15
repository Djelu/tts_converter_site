import React, { useState } from "react";

const FileUploader = () => {
    const [log, setLog] = useState("");
    const [fileConverted, setFileConverted] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const url = "http://185.253.7.239:5001";

        const formData = new FormData(event.target);
        formData.append("_BUFFER_SIZE", "20");
        formData.append("_FIRST_STRINGS_LENGTH", "800");
        formData.append("_LAST_STRINGS_LENGTH", "4200");
        formData.append("_VOICE", "ru-RU-SvetlanaNeural");
        formData.append("_VOICE_RATE", "+100%");
        formData.append("_VOICE_VOLUME", "+0%");

        fetch(`${url}/tts_convert`, {
            method: "POST",
            body: formData,
            mode: "cors",
            headers: {
                Connection: "keep-alive",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.blob();
            })
            .then((blob) => {
                setFileConverted(true);
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "audio.mp3";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error(error);
            });

        const interval = setInterval(checkStatus, 1000);

        function checkStatus() {
            if (fileConverted) {
                clearInterval(interval);
                return;
            }
            fetch(`${url}/status`)
                .then((response) => {
                    if (!response.ok) {
                        return null;
                    }
                    return response.text();
                })
                .then((log) => {
                    if (!log) return;
                    setLog(log);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    };

    return (
        <div>
            <form
                id="file-upload"
                method="post"
                action="http://185.253.7.239:5001/tts_convert"
                enctype="multipart/form-data"
                onSubmit={handleSubmit}
            >
                <label htmlFor="file-upload">Choose a file:</label>
                <input type="file" id="file" name="file" />
                <button type="submit">Upload</button>
            </form>
            <div>
                <textarea id="log" rows="10" cols="50" value={log} readOnly />
            </div>
        </div>
    );
};

export default FileUploader;