import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSessionContext } from '../hooks/useSessionContext';

const AllUserImages = () => {
    const { tokens } = useSessionContext();
    const [images, setImages] = useState([]);

    

    const deleteImage = async (id) => {
        try{
            const response = await axios.delete(`/annotations/photos/${id}`,{
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + String(tokens.access),
                  },
                });
            console.log("Image deleted successfully")
            
        } catch (error) {
            console.error('Error while delete:', error);
        }
        
    }

    // ADD REFRESH PAGE AFTER DELETE
    useEffect(() => {
        
        const fetchImages = async () => {
            try {
                const response = await axios.get('/annotations/photos',{
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + String(tokens.access),
                  },
            }); 
                setImages(response.data);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []); 

    return (
        <div>
            <h2>Your Images</h2>
            <div className="image-list">
                {images.map(image => (
                    <div key={image.id} className="image-item">
                        <img src={`http://localhost:8000/${image.image}`} alt={image.title} style={{ width: '300px', height: '300px' }} />
                        <button type="button" onClick={() => deleteImage(image.id)}>Delete</button>
                        <p>{image.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllUserImages;