import styled from "styled-components";

export const LogContainer = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-top: 1rem;
  overflow: auto;
  height: 10rem;
  padding: 0.5rem;
  font-family: monospace;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

export const Header = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

export const FileDropZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
  width: 300px;
  height: 200px;
  margin-bottom: 20px;
`;

export const DropMessage = styled.p`
  font-size: 18px;
  color: #666;
`;

export const UploadButton = styled.label`
  background-color: #4caf50;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
`;

export const FileList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  width: 300px;
`;

export const FileListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const FileName = styled.span`
  font-size: 16px;
`;

export const UploadStatus = styled.span`
  font-size: 14px;
  color: #666;
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const ProgressBar = styled.div`
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
  width: ${(props) => props.progress}%;
`;

export const UploadedFilesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

export const UploadedFilesList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  width: 300px;
`;

export const UploadedFileItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const DownloadButton = styled.a`
  background-color: #4caf50;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
`;