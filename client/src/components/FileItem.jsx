import React from "react";
import {FileListItem, FileName, ProgressBar, ProgressBarContainer, UploadStatus, FileItemContainer} from "./style.jsx";

const FileItem = ({file, uploadProgress, convertProgress, index}) => {
    const {name, size, status} = file
    const showProgress = true/*status !== null*/
    const rightName = name.endsWith(".fb2")
        ? `${name.replace(".fb2", ".txt")} (fb2 -> txt)`
        : name;

    const getRightSizeValue = (size) => {
        const sfx = ['Б', 'КБ', 'МБ'];
        let sfxNum = 0;
        while (size >= 1024 && sfxNum < sfx.length - 1) {
            size /= 1024;
            sfxNum++;
        }
        return `${Math.ceil(size)} ${sfx[sfxNum]}`;
    }

    return (
        <FileItemContainer>
            <FileListItem>
                <FileName>{rightName}</FileName>
                <UploadStatus>{getRightSizeValue(size)}</UploadStatus>
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
        </FileItemContainer>
    );
};

export default FileItem;