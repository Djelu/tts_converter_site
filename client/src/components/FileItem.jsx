import React from "react";
import {
    FileItemSubContainer, FileItemMainContainer, FileListItem, FileName, RemoveButton,
    ProgressBarMainContainer, ProgressBar, ProgressBarContainer, UploadStatus, WorkingState
} from "./style.jsx";

const FileItem = ({file, uploadProgress, convertProgress, workingState, removeFile, index}) => {
    const {name, size} = file
    const showProgress = true/*status !== null*/
    const rightName = name.endsWith(".fb2")
        ? `${name.replace(".fb2", ".txt")} (fb2 -> txt)`
        : name;
    const wholeResultProgress = Math.floor(Math.ceil(uploadProgress*0.33+convertProgress*0.67));
    const loadingColor = uploadProgress < 100 ?"orange" :"green";

    const getRightSizeValue = (size) => {
        const sfx = ['Б', 'КБ', 'МБ'];
        let sfxNum = 0;
        while (size >= 1024 && sfxNum < sfx.length - 1) {
            size /= 1024;
            sfxNum++;
        }
        return `${Math.ceil(size)} ${sfx[sfxNum]}`;
    }

    const getRightPercent = () => {
        return `${wholeResultProgress}%`
    }

    return (
        <FileItemMainContainer>
            <WorkingState workingState={workingState} color={loadingColor}/>
            <FileItemSubContainer workingState={workingState}>
                <FileListItem>
                    <FileName>{rightName}</FileName>
                    <UploadStatus>{getRightPercent(size)}</UploadStatus>
                </FileListItem>
                {showProgress && (
                <ProgressBarMainContainer>
                        <ProgressBarContainer size={33}>
                            <ProgressBar progress={uploadProgress} color={"orange"}/>
                        </ProgressBarContainer>
                        <ProgressBarContainer size={67}>
                            <ProgressBar progress={convertProgress} color={"lightgreen"}/>
                        </ProgressBarContainer>
                </ProgressBarMainContainer>
                )}
            </FileItemSubContainer>
            {workingState !== "loading" && (
                <RemoveButton onClick={() => removeFile(index)}/>
            )}
        </FileItemMainContainer>
    );
};

export default FileItem;