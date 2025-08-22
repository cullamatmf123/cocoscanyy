import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of a photo. You can adjust this if you want to store base64 or other metadata.
export type Photo = {
  uri: string; // or base64: string if you prefer
  timestamp: number;
};

type PhotoContextType = {
  photos: Photo[];
  addPhoto: (photo: Photo) => void;
  removePhoto: (uri: string) => void;
};

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const addPhoto = (photo: Photo) => {
    setPhotos((prev) => [photo, ...prev]);
  };

  const removePhoto = (uri: string) => {
    setPhotos((prev) => prev.filter((p) => p.uri !== uri));
  };

  return (
    <PhotoContext.Provider value={{ photos, addPhoto, removePhoto }}>
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhotoContext = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotoContext must be used within a PhotoProvider');
  }
  return context;
};