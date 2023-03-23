import React from "react";
import FileUploader from "./components/FileUploader";

const App = () => {
    return (
        <div>
            {/*<FileUploader url={"http://localhost:5000"}/>*/}
            <FileUploader url={"http://185.253.7.239:5000"}/>
        </div>
    );
};

export default App;