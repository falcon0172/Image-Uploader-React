
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



import React from 'react';
import './App.css';

import DropFileInput from './components/DropFileInput';

function App() {

    const onFileChange = (files) => {
        console.log(files);
    }

    return (
        <div className="box">
            <h2 className="header">
                React drop Image input
            </h2>
            <DropFileInput
                onFileChange={(files) => onFileChange(files)}
            />
        </div>
    );
}

export default App;
