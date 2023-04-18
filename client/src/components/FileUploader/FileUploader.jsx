import React, {useState} from "react";
import {Container, DropMessage, FileDropZone, FileList, UploadButton} from "../style.jsx";
import { SocketEdgeTTS } from "./socket_edge_tts"
import { ProcessingFile } from "./processing_file"
import { convertFb2ToTxt, convertEpubToTxt, unzip_epub, convertZipToTxt } from "./texts_converter"
import ScriptTag from 'react-script-tag';
import FileItem from "../FileItem";

const Demo = props => (
    <ScriptTag type="text/javascript" src="./jszip.min" />
)

const FileUploader = ({url}) => {
    // const [log, setLog] = useState("");
    const [fileList, setFileList] = useState([]);
    const [uploadProgress, setUploadProgress] = useState([]);
    const [convertProgress, setConvertProgress] = useState([]);
    const [workingState, setWorkingState] = useState([]);
    // const [uploadedFiles, setUploadedFiles] = useState([]);
    // const [fileConverted, setFileConverted] = useState(false);
    const max_threads = 20;

    const handleClick = () => {
        document.getElementById("file").click();
    };

    function handleDragOver(event) {
        event.preventDefault();
    }

    const handleDrop = (event) => {
        event.preventDefault();
        setDefaultVarStates([...event.dataTransfer.files])
    }

    const handleFileSelect = (event) => {
        event.preventDefault();
        setDefaultVarStates([...event.target.files]);
    };

    const setDefaultVarStates = (files) => {
        const newFiles = [...files, ...fileList]
        setWorkingState(Array(newFiles.length).fill(null))
        setUploadProgress(Array(newFiles.length).fill(0))
        setConvertProgress(Array(newFiles.length).fill(0))
        setFileList(newFiles);
    }

    const handleFileUpload = async (fileList) => {
        fileUpload(fileList, 0);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        fileList.forEach(handleFileUpload);
    };

    const removeFile = (index) => {
        let newFiles = [...fileList]
        newFiles.splice(index, 1)
        setFileList(newFiles);
    }

    const fileUpload = (files, index) => {
        if(["completed", "loading"].includes(workingState[index]))
            return next_or_break();

        const file = files[index];

        get_audio(file);
        // next_or_break();

        // let chunkCompleted = 0;
        // let fileConverted = false;
        // let wasError = false;
        // const chunkSize = 10000;
        // const totalChunks = Math.ceil(file.size / chunkSize);
        // const sendingId = Date.now()
        // const interval = setInterval(() => checkStatus(sendingId), 1000);
        // setWorkingState(prevState => prevState.map((value, i) => i === index ? "loading" : value))
        //
        // for (let chunkIndex = 0; chunkIndex < totalChunks && !wasError; chunkIndex++) {
        //     const start = chunkIndex * chunkSize;
        //     const end = Math.min(file.size, start + chunkSize);
        //     const chunk = file.slice(start, end);
        //     const pars = {
        //         "idx": chunkIndex,
        //         "total": totalChunks,
        //         "id": sendingId,
        //         "bSize": "20",
        //         "f": "800",
        //         "l": "4200",
        //         "v": "ru-RU-SvetlanaNeural",
        //         "vR": "+100%",
        //         "ext": getFileExt(file.name)
        //     }
        //     const urlParams = new URLSearchParams(pars);
        //
        //     fetch(`${url}/tts_convert?${urlParams}`, {
        //         'method': 'POST',
        //         'headers': {
        //             'content-type': "application/octet-stream",
        //             'content-length': chunk.length
        //         },
        //         'body': chunk,
        //
        //     })
        //         .then((res) => {
        //             if (res.status !== 200) {
        //                 console.log(res);
        //                 return null;
        //             }
        //             chunkCompleted += 1;
        //             const progress = chunkIndex + 1 !== totalChunks
        //                 ? Math.round(100 * chunkCompleted / totalChunks)
        //                 : 100;
        //             setUploadProgress(prevState => prevState.map((value, i) => i === index ? progress : value));
        //             console.log(`Uploaded ${progress}%`);
        //             if (chunkCompleted === totalChunks) {
        //                 console.log("File uploaded");
        //                 return res.blob();
        //             }
        //         })
        //         .then((blob) => {
        //             if (!blob)
        //                 return;
        //             setConvertProgress(prevState => prevState.map((value, i) => i === index ? 100 : value))
        //             setWorkingState(prevState => prevState.map((value, i) => i === index ? "completed" : value))
        //             fileConverted = true
        //             // setUploadedFiles((prevFiles) => [...prevFiles, blob]);
        //             const url = window.URL.createObjectURL(blob);
        //             const link = document.createElement("a");
        //             link.href = url;
        //             link.download = `${removeFileExt(file.name)}.mp3`;
        //             document.body.appendChild(link);
        //             link.click();
        //             document.body.removeChild(link);
        //             window.URL.revokeObjectURL(url);
        //             clearInterval(interval);
        //             next_or_break();
        //         })
        //         .catch((error) => {
        //             console.error(error);
        //             clearInterval(interval);
        //             setWorkingState(prevState => prevState.map((value, i) => i === index ? "error" : value))
        //             if(!wasError){
        //                 wasError = true
        //                 next_or_break();
        //             }
        //         })
        // }

        // function getFileExt(filename) {
        //     const lastDotIndex = filename.lastIndexOf('.');
        //     return lastDotIndex === -1 ? '' : filename.slice(lastDotIndex + 1);
        // }
        //
        // function removeFileExt(filename) {
        //     const lastDotIndex = filename.lastIndexOf('.');
        //     return lastDotIndex === -1 ? filename : filename.slice(0, lastDotIndex);
        // }
        //
        // function checkStatus(id) {
        //     if (fileConverted) {
        //         clearInterval(interval);
        //         return;
        //     }
        //     fetch(`${url}/status?id=${id}`)
        //         .then((response) => {
        //             if (!response.ok) {
        //                 return null;
        //             }
        //             return response.json();
        //         })
        //         .then((json) => {
        //             if (!json)
        //                 return;
        //             setConvertProgress(prevState => prevState.map((value, i) => i === index ? json['progress'] : value))
        //             // setLog(json['log']);
        //         })
        //         .catch((error) => {
        //             console.error("Error:", error);
        //         });
        // }

        function next_or_break(){
            const nextIndex = index + 1;
            if(nextIndex < files.length)
                fileUpload(files, nextIndex);
        }
    }

    function get_text(_filename, _text, isFile) {
        let book = new ProcessingFile(
            _filename,
            _text,
            800,
            4200,
            Array(0)
        )

        let statAreaValue = "";
        let tmp_ind = 0
        for (let part of book.all_sentences) {
            tmp_ind += 1
            // if ( isFile ) {
            //     textArea.value += "Часть " + tmp_ind + ":\n" + part + "\n\n"
            // }
            statAreaValue += "Часть " + (tmp_ind).toString().padStart(4, '0') + ": Открыта\n"
        }

        return {
            "book": book,
            "stat_str": {"textContent": `0 / ${book.all_sentences.length}`},
            "statArea": {"value": statAreaValue}
        }
        // stat_info.textContent = ""//"Открыто"
        // stat_str.textContent = `0 / ${book.all_sentences.length}`
    }

    const prepareFile = (file, nextFunc) => {
        const reader = new FileReader()
        reader.onload = async () => {
            // book_loaded = true
            const file_name_toLowerCase = file.name.toLowerCase()
            let book_data = {}
            if (file_name_toLowerCase.endsWith('.txt')) {
                book_data = get_text(file.name.slice(0, file.name.lastIndexOf(".")), reader.result, true)
            } else if (file_name_toLowerCase.endsWith('.fb2')) {
                book_data = get_text(file.name.slice(0, file.name.lastIndexOf(".")), convertFb2ToTxt(reader.result), true)
            } else if (file_name_toLowerCase.endsWith('.epub')) {
                book_data = get_text(file.name.slice(0, file.name.lastIndexOf(".")), await convertEpubToTxt(file), true)
            } else if (file_name_toLowerCase.endsWith('.zip')) {
                // book_data = convertZipToTxt(file)
            }
            // fileButton.textContent = "Открыты"
            nextFunc(book_data)
        }

        reader.readAsText(file)
    }



    const get_audio = (file) => {
        prepareFile(file, (book_data) => {
            const book = book_data["book"];
            const stat_str = book_data["stat_str"];
            const statArea = book_data["statArea"];
            // const stat_count = stat_str.textContent.split(' / ');
            // stat_str.textContent = "0 / " + stat_count[1]
            let n = 0
            let fix_n = 0
            let file_name_ind = 0
            let file_name = book.file_names[file_name_ind][0]
            let parts_book = []
            let threads_info = { count: parseInt(max_threads.value), stat: stat_str }
            let timerId = setTimeout(function tick() {
                if ( threads_info.count < parseInt(max_threads.value) ) {
                    threads_info.count = parseInt(max_threads.value)
                }
                if ( n < threads_info.count && n < book.all_sentences.length) {
                    if ( book.file_names[file_name_ind][1] > 0 && book.file_names[file_name_ind][1] <= n ) {
                        file_name_ind += 1
                        file_name = book.file_names[file_name_ind][0]
                        fix_n = n
                    }

                        // "idx": chunkIndex,
                        // "total": totalChunks,
                        // "id": sendingId,
                        // "bSize": "20",
                        // "f": "800",
                        // "l": "4200",
                        // "v": "ru-RU-SvetlanaNeural",
                        // "vR": "+100%",
                        // "ext": getFileExt(file.name)

                    parts_book.push(
                        new SocketEdgeTTS(
                            n,
                            file_name,// + " " +
                            (n+1-fix_n).toString().padStart(4, '0'),
                            "Microsoft Server Speech Text to Speech Voice (ru-RU, SvetlanaNeural)",
                            "+0Hz",
                            "+100%",
                            "+0%",
                            book.all_sentences[n],
                            statArea,
                            threads_info,
                            false
                        )
                    )
                    n += 1
                    timerId = setTimeout(tick, 100)
                } else
                if ( n >= threads_info.count ) {
                    timerId = setTimeout(tick, 5000)
                }
            }, 10)
        })
    };



    return (
        <Container>
            <FileDropZone
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleClick}
                hasFiles={fileList.length > 0}
            >
                <DropMessage hasFiles={fileList.length > 0}>
                    {fileList.length === 0
                        ?"Здесь могли быть ваши книги"
                        :"Здесь всё ещё могут быть ваши книги"}
                </DropMessage>
                <input type="file" id="file" name="file" onChange={handleFileSelect} multiple hidden/>
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
                            workingState={workingState[index]}
                            removeFile={removeFile}
                        />
                    ))}
                </FileList>
            )}
        </Container>
    );
};

export default FileUploader;