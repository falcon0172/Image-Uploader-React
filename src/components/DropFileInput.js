
/*
While solving this test I came across three approached to solve this:
1. Using React-Dropzone
2. Using React-Dropzone-uploader
3. Using input type files and Drag events  -> implemented approach

The reason I prefered the third approach is that I was very familiar with the approach and it gave more
flexibility and control as there were no external third-party library used so that I can have more control
over the output.
Both React-Dropzone and React-Dropzone-uploader are much easier to implement then this but they give less
control on the design of the elements

For uploading the image Fetch and Axios were the two options to use and axios was used because it also
provides with progress updates

*/





import React, { useRef, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import './drop-file-input.css';

import { ImageConfig } from '../config/ImageConfig';    //Image config file for different types of documents like pdf .jpg etc
import uploadImg from '../assets/cloud-upload-regular-240.png';

const DropFileInput = props => {

    const wrapperRef = useRef(null);

    const [fileList, setFileList] = useState([]);    //list of files

    const [isValid, setisValid] = useState([]);     //to check whether the files present are img or not

    const [progress,setProgress] = useState(0);     //progress bar

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');

    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

    const onDrop = () => wrapperRef.current.classList.remove('dragover');

// this function uploads the file on the server using axios. Axios also returns the progress of upload so that we can display them
    const fileUploadHandler = (file) => {
      var progressBar = 0;   // Temporary variable for progress
      const fd = new FormData();
      let success;      // this can be used for error handling if file upload isnt successful although not implemented in the program for time being
      fd.append('image',file,file.name);
      axios.post("https://api.imgbb.com/1/upload?expiration=600&key=166d3c9d9763f32493c9c125b99608d2",fd,{
        onUploadProgress: progressEvent =>{
          progressBar = (Math.round(progressEvent.loaded/progressEvent.total * 100));
          setProgress(progressBar);
        }
      })
        .then(res =>{
          console.log(res);   //this can be used for error handling
        });

    }

// After Dropping the file this component checks whether the file is valid img file if yes it uploads the file to the imgbb although this code should be written on seprate file for better modularity purposes
    const onFileDrop = (e) => {
        setProgress(0);
        const newFile = e.target.files[0];

// We display the list of files uploaded whether supported or not
        if (newFile) {
            const updatedList = [...fileList, newFile];
            setFileList(updatedList);
            props.onFileChange(updatedList);
        }
//checks whether the file uploaded is img or not and we set the is Valid paramete accordingly to display relevant messages
        if(newFile.type.includes('image')){
          setisValid([...isValid,{
            css:'drop-file-preview__item_true',
            text:newFile.size + ' Bytes',
            status:true,
          }]);
          fileUploadHandler(newFile); //function call for uploading the file on the server
        }

        else{
          setisValid([...isValid,{
            css:'drop-file-preview__item_false',
            text:'File not Supported',
            status:false,
          }]);
        }
    }
//this function removes the file on pressing the cross button and subsquent validity of the file
    const fileRemove = (file) => {
        const updatedList = [...fileList];   //list of files
        const validList = [...isValid];      //files with validity data
        updatedList.splice(fileList.indexOf(file), 1);
        validList.splice(fileList.indexOf(file), 1);
        setFileList(updatedList);
        setisValid(validList);
        props.onFileChange(updatedList);
    }

    return (
        <>
            <div
                ref={wrapperRef}
                className="drop-file-input"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="drop-file-input__label">
                    <img src={uploadImg} alt="" />
                    <p>Drag & Drop your files here</p>
                </div>
                <input type="file" value="" accept="image/*" onChange={onFileDrop}/>
            </div>
            {
                fileList.length > 0 ? (
                    <div className="drop-file-preview">
                        <p className="drop-file-preview__title">
                            Ready to upload
                        </p>
                        {
                            fileList.map((item, index) => (
                                <div key={index} className={isValid[index].css}>
                                    <img src={ImageConfig[item.type.split('/')[1]] || ImageConfig['default']} alt="" />
                                    <div className="drop-file-preview__item__info">
                                        <p>{item.name}</p>
                                        <p>{isValid[index].text}</p>
                                    </div>
                                    <span className="drop-file-preview__item__del" onClick={() => fileRemove(item)}>x</span>
                                    {isValid[index].status?<div className="progress"></div>: ''}
                                </div>

                            ))
                        }
                    </div>
                ) : null
            }
        </>
    );
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput;
