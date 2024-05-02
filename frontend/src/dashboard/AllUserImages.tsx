import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSessionContext } from '../hooks/useSessionContext';

const AllUserImages = () => {
    const { tokens } = useSessionContext();
    const [images, setImages] = useState([]);

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
                        <p>{image.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllUserImages;