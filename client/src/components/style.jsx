import styled, {css} from "styled-components/macro";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

export const FileDropZone = styled.div`
  border: 2px dashed #ccc;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  width: 80%;
  height: ${props => props.hasFiles ?"150" :"250"}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DropMessage = styled.p`
  font-size: ${props => props.hasFiles ?"1.2" :"1.5"}rem;
`;

export const UploadButton = styled.label`
  background-color: lightgreen;
  color: black;
  //font-weight: ;
  //font-style: italic;
  border: none;
  padding: 20px 30px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
`;

export const FileList = styled.ul`
  list-style: none;
  padding: 0 10px 0 0;
  width: 60%;
  max-height: 470px;
  overflow: auto;
`;

export const FileListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const FileItemSubContainer = styled.div`
  display: inline-block;
  border-radius: 5px;
  border: 1px dotted grey;
  padding: 5px;
  margin-left: 10px;
  width: calc(100% - 50px);
`;

export const FileItemMainContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
`

export const WorkingState = styled.div`
    display: inline-block;
    ${props => props.workingState === "completed" ?css`
      content: "\u2714";
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid lightgreen;
      background-color: lightgreen;
      text-align: center;
      color: lightgreen;
      font-weight: bold;
      font-size: 16px;
      line-height: 20px;
    ` : (props.workingState === "loading" ?css`
      content: "";
      width: 20px;
      height: 20px;
      border: 2px solid #ccc;
      border-top-color: ${props => props.color};
      border-radius: 50%;
      animation: spin 1s linear infinite;
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    ` : (props.workingState === "error" ?css`
      content: "\u2716";
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid orangered;
      background-color: orangered;
      text-align: center;
      color: orangered;
      font-weight: bold;
      font-size: 16px;
      line-height: 20px;
    `: css`
      content: "\u2714";
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid lightgrey;
      background-color: lightgrey;
      text-align: center;
      color: lightgrey;
      font-weight: bold;
      font-size: 16px;
      line-height: 20px;
    `))
};
`

export const FileName = styled.span`
  font-size: 16px;
`;

export const UploadStatus = styled.span`
  font-size: 14px;
  color: #666;
`;

export const ProgressBarMainContainer = styled.div`
  width: 100%;
  display: flex;
`;

export const ProgressBarContainer = styled.div`
  display: inline-block;
  width: ${props => props.size}%;
  height: 10px;
  border: 1px solid;
  border-color: ${props => props.progress > 0 ?"#ccc" :"white"};
  border-radius: 5px;
`;

export const ProgressBar = styled.div`
  height: 100%;
  background-color: ${props => props.color ?props.color :"#ccc"};;
  border-radius: 5px;
  width: ${props => props.progress}%;
`;
