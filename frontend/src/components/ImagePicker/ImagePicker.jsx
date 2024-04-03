import { useCallback, useState } from "react";
import { useDropzone } from 'react-dropzone';


const ImagePicker = ({onImageSelect}) => {
    const [selectedImages, setSelectedImages] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
   
        const newImages = acceptedFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
          }));
    
          setSelectedImages((prevImages) => [...prevImages, ...newImages]);
        
        onImageSelect(acceptedFiles);
      }, [onImageSelect]);


      const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*', // Allow only image files
        onDrop,
      });

  return (
    <div className="image-picker-container">
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      <p>Upload incident images here</p>
    </div>

    <div className="selected-images">
        {selectedImages.map((image, index) => (
          <img
            key={index}
            src={image.preview}
            alt={`Selected ${index + 1}`}
            className="selected-image"
          />
        ))}
      </div>
  </div>
  )
}

export default ImagePicker