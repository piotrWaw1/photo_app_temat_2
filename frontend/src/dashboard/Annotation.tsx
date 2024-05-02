import React from 'react';
import axios from 'axios';
import { useState, useContext } from 'react';
import { useSessionContext } from '../hooks/useSessionContext';


const Annotation: React.FC = () => {

  const {tokens} = useSessionContext()
  console.log(tokens?.access);
  // for posting images
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const allowedFormats = ['image/jpeg','image/jfif', 'image/jpg', 'image/png', 'image/bmp', 'image/gif'];

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (e.target){
      // console.log(e.target)
      const formData = new FormData(e.target)
      
      try {
        const response = await axios.post('/annotations/photos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + String(tokens.access),
            },
        });
  
        console.log(response.data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    }
    
  };

  return (
    <div>
      <form onSubmit={handleImageUpload}>
        <label htmlFor="uploadImage">upload image</label>
        <input 
          className=''
          id='uploadImage'
          type='file'
          accept=".jpeg, .jpg, .png, .jfif, .bmp, .gif"
        />
        <input type='submit' value={"submit form"}/>
      </form>


      {/* <button onClick={sendRequest}>Send Request</button> */}
    </div>
  );
};

export default Annotation;
