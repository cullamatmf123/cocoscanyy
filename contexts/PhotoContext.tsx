import React, { createContext, useContext, useState, ReactNode } from 'react';
import dataset from '../data/dataset.json';

// Photo interface
export interface Photo {
  id: string;
  uri: string;
  date: string;
  time: string;
  location: string;
  base64?: string;
  // Plant identification data
  plantName?: string;
  scientificName?: string;
  description?: string;
  leafShape?: string;
  commonUses?: string;
  // Health classification data
  healthStatus?: 'Healthy' | 'Unhealthy';
  healthConfidence?: number;
  healthAnalysis?: {
    prediction: string;
    confidence: number;
    timestamp: string;
  };
}

interface PhotoContextType {
  photos: Photo[];
  addPhoto: (photo: Photo) => void;
  deletePhoto: (photoId: string) => void;
  getPhotoCount: () => number;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const usePhotos = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotos must be used within a PhotoProvider');
  }
  return context;
};

interface PhotoProviderProps {
  children: ReactNode;
}

export const PhotoProvider: React.FC<PhotoProviderProps> = ({ children }) => {
  // Initialize with dataset photos and some mock photos for demonstration
  const [photos, setPhotos] = useState<Photo[]>([
    ...dataset,
    {
      id: 'mock-1',
      uri: 'https://picsum.photos/300/300?random=1',
      date: '2024-01-30',
      time: '14:30',
      location: 'Garden',
      plantName: 'Sample Plant',
      scientificName: 'Sample spp.',
      description: 'Sample plant for demonstration',
      leafShape: 'Sample shape',
      commonUses: 'Ornamental',
      healthStatus: 'Healthy',
      healthConfidence: 85.2,
      healthAnalysis: {
        prediction: 'Healthy',
        confidence: 85.2,
        timestamp: '2024-01-30T14:30:00Z'
      }
    },
    {
      id: 'mock-2',
      uri: 'https://picsum.photos/300/300?random=2',
      date: '2024-01-30',
      time: '12:15',
      location: 'Kitchen',
      plantName: 'Sample Plant 2',
      scientificName: 'Sample spp. 2',
      description: 'Another sample plant',
      leafShape: 'Sample shape 2',
      commonUses: 'Culinary',
      healthStatus: 'Unhealthy',
      healthConfidence: 72.8,
      healthAnalysis: {
        prediction: 'Unhealthy',
        confidence: 72.8,
        timestamp: '2024-01-30T12:15:00Z'
      }
    }
  ]);

  const addPhoto = (photo: Photo) => {
    setPhotos(prevPhotos => [photo, ...prevPhotos]); // Add new photo at the beginning
  };

  const deletePhoto = (photoId: string) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
  };

  const getPhotoCount = () => photos.length;

  const value: PhotoContextType = {
    photos,
    addPhoto,
    deletePhoto,
    getPhotoCount,
  };

  return (
    <PhotoContext.Provider value={value}>
      {children}
    </PhotoContext.Provider>
  );
};
