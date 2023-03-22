import React, {useState} from "react";
import { LogContainer, ProgressBar, FileListItem, FileName, FileDropZone, FileList,
    Container, DropMessage, Header, ProgressBarContainer, UploadButton, UploadStatus} from "./style.jsx";
import FileItem from "./FileItem";

const FileUploader = ({url}) => {
    // const [log, setLog] = useState("");
    const [fileList, setFileList] = useState([]);
    const [uploadProgress, setUploadProgress] = useState([]);
    const [convertProgress, setConvertProgress] = useState([]);
    // const [uploadedFiles, setUploadedFiles] = useState([]);
    // const [fileConverted, setFileConverted] = useState(false);

    const handleDrop = (event) => {
        event.preventDefault();
        const files = [...event.dataTransfer.files]
        setUploadProgress(Array(files.length).fill(0))
        setConvertProgress(Array(files.length).fill(0))
        setFileList(files);
    }

    const handleFileSelect = (event) => {
        event.preventDefault();
        const files = [...event.target.files];
        setUploadProgress(Array(files.length).fill(0))
        setConvertProgress(Array(files.length).fill(0))
        setFileList(files);
    };

    const handleFileUpload = async (fileList) => {
        // for (const file of fileList) {
        //     const index = fileList.indexOf(file);
        //     fileUpload(file, index);
        // }
        fileUpload(fileList, 0);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        fileList.forEach(handleFileUpload);
    };

    const fileUpload = (files, index) => {
        // const fileReader = new FileReader();
        // fileReader.readAsArrayBuffer(file);
        const file = files[index];
        let chunkCompleted = 0;
        let fileConverted = false;
        const chunkSize = 10000;
        const totalChunks = Math.ceil(file.size / chunkSize);
        const sendingId = Date.now()
        const interval = setInterval(() => checkStatus(sendingId), 30000000);

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
                "ext": getFileExt(file.name)
            }
            const urlParams = new URLSearchParams(pars);

            fetch(`${url}/tts_convert?${urlParams}`, {
                'method': 'POST',
                'headers': {
                    'content-type': "application/octet-stream",
                    'content-length': chunk.length
                },
                'body': chunk,

            })
                .then((res) => {
                    if (res.status !== 200) {
                        console.log(res);
                        return null;
                    }
                    chunkCompleted += 1;
                    const progress = chunkIndex + 1 !== totalChunks
                        ? Math.round(100 * chunkCompleted / totalChunks)
                        : 100;
                    setUploadProgress(prevState => prevState.map((value, i) => i === index ? progress : value));
                    console.log(`Uploaded ${progress}%`);
                    if (chunkCompleted === totalChunks) {
                        console.log("File uploaded");
                        return res.blob();
                    }
                })
                .then((blob) => {
                    if (!blob)
                        return;
                    setConvertProgress(prevState => prevState.map((value, i) => i === index ? 100 : value))
                    fileConverted = true
                    // setUploadedFiles((prevFiles) => [...prevFiles, blob]);
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `${removeFileExt(file.name)}.mp3`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    clearInterval(interval);
                    next_or_break();
                })
                .catch((error) => {
                    console.error(error);
                    clearInterval(interval);
                    next_or_break();
                })
        }

        function getFileExt(filename) {
            const lastDotIndex = filename.lastIndexOf('.');
            return lastDotIndex === -1 ? '' : filename.slice(lastDotIndex + 1);
        }

        function removeFileExt(filename) {
            const lastDotIndex = filename.lastIndexOf('.');
            return lastDotIndex === -1 ? filename : filename.slice(0, lastDotIndex);
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
                    setConvertProgress(prevState => prevState.map((value, i) => i === index ? json['progress'] : value))
                    // setLog(json['log']);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }

        function next_or_break(){
            const nextIndex = index + 1;
            if(nextIndex < files.length)
                fileUpload(files, nextIndex);
        }
    }


    return (
        <Container onDrop={handleDrop}>
            {/*<LogContainer>*/}
            {/*    <textarea value={log}/>*/}
            {/*</LogContainer>*/}
            {/*<Header>Upload your files</Header>*/}
            <FileDropZone>
                <DropMessage>Drop your files here or click to browse</DropMessage>
                <input type="file" id="file" name="file" onChange={handleFileSelect} multiple hidden/>
                {fileList.length === 0 && (
                    <UploadButton htmlFor="file">Загрузить файлы</UploadButton>
                )}
            </FileDropZone>
            {fileList.length > 0 && (
                <UploadButton onClick={() => handleFileUpload(fileList)}>Озвучить все</UploadButton>
            )}
            {fileList.length > 0 && (
                <FileList>
                    {fileList.map((file, index) => (
                        <FileItem
                            key={index}
                            file={file}
                            index={index}
                            uploadProgress={uploadProgress[index]}
                            convertProgress={convertProgress[index]}
                        />
                    ))}
                </FileList>
            )}
        </Container>
    );
};

export default FileUploader;