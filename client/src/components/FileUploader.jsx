import React, {useState} from "react";
import { LogContainer, ProgressBar, FileListItem, FileName, FileDropZone, FileList,
    Container, DropMessage, Header, ProgressBarContainer, UploadedFileItem,
    UploadButton, UploadedFilesContainer, UploadedFilesList, DownloadButton, UploadStatus} from "./style.jsx";

const FileUploader = ({url}) => {
    const [log, setLog] = useState("");
    const [fileList, setFileList] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [convertProgress, setConvertProgress] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileConverted, setFileConverted] = useState(false);

    const handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        setFileList(files);
    }

    const handleFileUpload = (file) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        const chunkSize = 10000;
        let chunkCompleted = 0;
        const totalChunks = Math.ceil(file.size / chunkSize);
        const sendingId = Date.now()/*Math.random().toString(36).slice(-6)*/;
        const interval = setInterval(() => checkStatus(sendingId), 3000);

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const start = chunkIndex * chunkSize;
            const end = Math.min(file.size, start + chunkSize);
            const chunk = file.slice(start, end);
            const pars = {
                "idx": chunkIndex,
                "total": totalChunks,
                "id": sendingId,
                "bSize": "20",
                "f": "800",
                "l": "4200",
                "v": "ru-RU-SvetlanaNeural",
                "vR": "+100%",
            }
            const urlParams = new URLSearchParams(pars);

            fetch(`${url}/tts_convert?${urlParams}`, {
                'method': 'POST',
                'headers': {
                    'content-type': "application/octet-stream",
                    'content-length': chunk.length
                },
                'body': chunk
            })
                .then((res) => {
                    if (res.status !== 200) {
                        console.log(res);
                        return null;
                    }
                    chunkCompleted += 1;
                    const progress = Math.round(100 * chunkCompleted / totalChunks);
                    setUploadProgress(progress);
                    console.log(`Uploaded ${progress}%`);
                    if (chunkCompleted === totalChunks) {
                        console.log("File uploaded");
                        return res.blob();
                    }
                })
                .then((blob) => {
                    if (!blob)
                        return;
                    setFileConverted(true)
                    setUploadedFiles((prevFiles) => [...prevFiles, blob]);
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = file.name + ".mp3";
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

        function checkStatus(id) {
            if (fileConverted) {
                clearInterval(interval);
                return;
            }
            fetch(`${url}/status?id=${id}`)
                .then((response) => {
                    if (!response.ok) {
                        return null;
                    }
                    return response.json();
                })
                .then((json) => {
                    if (!json)
                        return;
                    setConvertProgress(json['progress'])
                    setLog(json['log']);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    };

    const handleFileSelect = (event) => {
        event.preventDefault();
        const files = Array.from(event.target.files);
        setFileList(files);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fileList.forEach(handleFileUpload);
    };

    return (
        <Container onDrop={handleDrop}>
            <LogContainer>
                {/*{logs.map((log, index) => (*/}
                {/*    <div key={index}>{log}</div>*/}
                {/*))}*/}
                <textarea value={log}/>
            </LogContainer>
            <Header>Upload your files</Header>
            <FileDropZone>
                <DropMessage>Drop your files here or click to browse</DropMessage>
                <input type="file" id="file" name="file" onChange={handleFileSelect} multiple hidden/>
                <UploadButton htmlFor="file">Browse</UploadButton>
            </FileDropZone>
            {fileList.length > 0 && (
                <FileList>
                    {fileList.map((file) => (
                        <FileListItem key={file.name}>
                            <FileName>{file.name}</FileName>
                            <UploadStatus>{file.size} bytes</UploadStatus>
                            <UploadButton onClick={() => handleFileUpload(file)}>Upload</UploadButton>
                        </FileListItem>
                    ))}
                </FileList>
            )}
            {uploadProgress > 0 && (
                <ProgressBarContainer>
                    <ProgressBar progress={uploadProgress}/>
                </ProgressBarContainer>
            )}
            {convertProgress > 0 && (
                <ProgressBarContainer>
                    <ProgressBar progress={convertProgress}/>
                </ProgressBarContainer>
            )}

            {uploadedFiles.length > 0 && (
                <UploadedFilesContainer>
                    <Header>Uploaded Files</Header>
                    <UploadedFilesList>
                        {uploadedFiles.map((file) => (
                            <UploadedFileItem key={file.name}>
                                <FileName>{file.name}</FileName>
                                <DownloadButton href={file.url} target="_blank">Download</DownloadButton>
                            </UploadedFileItem>
                        ))}
                    </UploadedFilesList>
                </UploadedFilesContainer>
            )}
        </Container>
    );
};

export default FileUploader;