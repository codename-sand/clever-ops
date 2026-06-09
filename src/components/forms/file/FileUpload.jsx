import { React, useState } from "react";
import Dropzone from "react-dropzone";

export const FileUpload = ({ setFile }) => {
    
    // File upload (drag&drop , file name)
    const [fileNames, setFileNames] = useState(``);
    // file name
    let fileName = fileNames === "" ? "업데이트 파일을 이 곳으로 불러오거나 끌어 놓아 시작하세요" : "첨부파일 : " + fileNames;
    
    const handleDrop = (acceptedFiles) => {
        setFileNames(acceptedFiles.map(file => file.name));
        setFile(acceptedFiles[0]);
    }

    return (
        <Dropzone onDrop={handleDrop}>
            {({
                getRootProps,
                getInputProps,
                isDragAccept,
                isDragReject
            }) => {
                
                // 파일 업로드 실패했을 경우에 reject className 적용
                const additionalClass = isDragAccept ? "accept" : isDragReject ? "reject" : "";

                return (
                    <>
                        <div {...getRootProps({ className: `dragOnfile ${additionalClass}` })}>
                            <input {...getInputProps()} />
                            <span>{fileName}</span>
                            <label className="on_button">파일 선택</label>
                        </div>
                    </>
                );
            }}
        </Dropzone>
    );
}