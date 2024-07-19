import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem } from '@ionic/react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import './Home.css';

const Home: React.FC = () => {
  const [videos, setVideos] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      const { publicStorage } = await Filesystem.requestPermissions();
      if (publicStorage === 'granted') {
        const result = await Filesystem.readdir({
          path: '',
          directory: Directory.External,
        });
        const videoFiles = result.files
          .filter(file => file.name.endsWith('.mp4'))
          .map(file => file.uri);
        setVideos(videoFiles);
      } else {
        console.error('Storage permission not granted');
      }
    };

    loadVideos();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Video Files</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Video Files</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {videos.map((video, index) => (
            <IonItem key={index} button onClick={() => setSelectedVideo(video)}>
              {video}
            </IonItem>
          ))}
        </IonList>
        {selectedVideo && (
          <div>
            <video controls style={{ width: '100%' }}>
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
