import React from 'react';
import axios from 'axios';
import {useState} from 'react';
import {useSessionContext} from '../hooks/useSessionContext';


const Annotation: React.FC = () => {

  const {tokens} = useSessionContext();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const allowedFormats = ['image/jpeg', 'image/jfif', 'image/jpg', 'image/png', 'image/bmp', 'image/gif'];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    setSelectedImageFile(selectedFile);
    e.target.value = '';
    if (selectedFile) {
      const maxSize = 50000 * 1024; // 50000KB in bytes
      if (selectedFile.size >= maxSize) {
        console.log("File size exceeds 50000KB limit.");
        setSelectedImageFile(null);
      } else if (!allowedFormats.includes(selectedFile.type)) {
        console.log("Wrong file format.");
        setSelectedImageFile(null);
      }
    }
  };

  const submitImage = async (file: File) => {
    const formData = new FormData();
    console.log(file)
    formData.append('image', file);
    formData.append('title', file.name)

    try {
      const response = await axios.post(`/annotations/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + String(tokens.access),
        },
      });
      console.log('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    setSelectedImageFile(null);
  };

  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    if (selectedImageFile) {
      await submitImage(selectedImageFile);
    }
  };

  return (
      <div>
        <form onSubmit={handleImageUpload}>
          <label htmlFor="uploadImage">Upload image</label>
          <input
              className=''
              id='uploadImage'
              type='file'
              accept=".jpeg, .jpg, .png, .jfif, .bmp, .gif"
              onChange={handleImageChange}
          />
          <input type='submit' value="Submit form" disabled={!selectedImageFile}/>
        </form>
      </div>
  );
};

export default Annotation;
