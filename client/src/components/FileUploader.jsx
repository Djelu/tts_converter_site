import React, { useState } from "react";

const FileUploader = ({url}) => {
    const [log, setLog] = useState("");
    const [fileConverted, setFileConverted] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const file = formData.get("file");
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        const interval = setInterval(checkStatus, 1000);

        fileReader.onload = async (event) => {
            const content = event.target.result;
            const chunkSize = 1000;
            const totalChunks = Math.ceil(event.target.result.byteLength / chunkSize);
            const sendingId = Math.random().toString(36).slice(-6);
            let chunk_completed = 0;

            console.log(file.name)
            for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
                let chunk = content.slice(chunkIndex * chunkSize, (chunkIndex + 1) * chunkSize)
                const pars = {
                    "idx": chunkIndex,
                    "total": totalChunks,
                    "id": sendingId,
                    "bSize": "20",
                    "f": "800",
                    "l": "4200",
                    "v": "ru-RU-SvetlanaNeural",
                    "vR": "+100%",
                    // "vV": "+0%"
                }
                const urlParams = new URLSearchParams(pars);

                await fetch(`${url}/tts_convert?${urlParams}`, {
                    'method' : 'POST',
                    'headers' : {
                        'content-type' : "application/octet-stream",
                        'content-length' : chunk.length
                    },
                    'body' : chunk
                }).then((res) => {
                    if (res.status !== 200 || ++chunk_completed < totalChunks) {
                        console.log("chunk = "+chunk_completed);
                        console.log(res);
                        return null;
                    }
                    setFileConverted(true);
                    console.log(res);
                    return res.blob();
                })
                .then((blob) => {
                    if (!blob)
                        return;
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = file.name+".mp3";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                })
                .catch((error) => {
                    console.error(error);
                    clearInterval(interval);
                });
            }
            // fileUploaded += 1;

            // status.innerHTML = `file ${fileUploaded} of ${files.files.length} uploaded!!!`;
        }

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
                action={url+"/tts_convert"}
                enctype="multipart/form-data"
                onSubmit={handleSubmit}
            >
                <label htmlFor="file-upload">Choose a file:</label>
                <input type="file" id="file" name="file"/>
                <button type="submit">Upload</button>
            </form>
            <div>
                <textarea id="log" rows="10" cols="50" value={log} readOnly/>
            </div>
        </div>
    );
};

export default FileUploader;