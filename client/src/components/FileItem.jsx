import React, {useState} from "react";
import { LogContainer, ProgressBar, FileListItem, FileName, FileDropZone, FileList,
    Container, DropMessage, Header, ProgressBarContainer, UploadButton, UploadStatus} from "./style.jsx";

const FileItem = ({file, uploadProgress, convertProgress, index}) => {
    const {name, size, status} = file
    const showProgress = true/*status !== null*/
    const needChangeExt = name.endsWith(".fb2")
    const rightName = needChangeExt
        ? `${name.replace(".fb2", ".txt")} (fb2 -> txt)`
        : name;

    return (
        <div>
            <FileListItem>
                <FileName>{rightName}</FileName>
                <UploadStatus>{size} bytes</UploadStatus>
            </FileListItem>
            {showProgress && (
                <ProgressBarContainer>
                    <ProgressBar progress={uploadProgress}/>
                </ProgressBarContainer>
            )}
            {showProgress && (
                <ProgressBarContainer>
                    <ProgressBar progress={convertProgress}/>
                </ProgressBarContainer>
            )}
        </div>
    );
};

export default FileItem;