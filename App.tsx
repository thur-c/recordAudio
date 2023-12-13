import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';


export default function App() {
  const [recording, setRecording] = useState<any>();
  const [recordingStatus, setRecordingStatus] = useState('idle');
  const [, setAudioPermission] = useState(Boolean);
  const [color,  setColor] = useState('red');
  

  
  useEffect(() => {
    async function getPermission() {
      await Audio.requestPermissionsAsync().then((permission) => {
        console.log('Permission Granted: ' + permission.granted);
        setAudioPermission(permission.granted);
      }).catch(error => {
        console.log(error);
      });
    }

    getPermission();

    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);

  let pressTimer: any = null;

  function handlePressIn() {
    pressTimer = setTimeout(async () => {
      pressTimer = null;
      try {
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        setRecording(recording);
        setRecordingStatus('recording');
      } catch (error) {
        console.error('Failed to start recording', error);
      }
      //GRAVA O AUDIO
      setColor('green');
    }, 200); // Defina o tempo desejado para iniciar a gravação (em milissegundos)

  }

  function handlePressOut() {
    if (pressTimer !== null) {
      clearTimeout(pressTimer);
    } else {
      stopRecording();
      setColor('red');

    }
  }


  async function stopRecording() {
    try {
      if (recordingStatus === 'recording') {
        console.log('Stopping Recording');
        await recording!.stopAndUnloadAsync();
        const recordingUri = recording!.getURI();

        const playbackObject = new Audio.Sound();
        await playbackObject.loadAsync({ uri: recordingUri });
        await playbackObject.playAsync();

        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'recordings/', { intermediates: true });


        setRecording(null);
        setRecordingStatus('stopped');


        const formData = new FormData();
         
        formData.append('AudioFile',
          {
            uri: recordingUri,
            name: 'audio.m4a',
            type:'audio/m4a'
          });
      
        axios.post('http://10.16.50.115:5001/api/v1/Separacao/teste',
          formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }   
        ).then((data) => console.log(data.data.data.Texto.texto))
          .catch((error) => console.log(error.message)
          );


        return null;
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 128,
          height: 128,
          borderRadius: 64,
          backgroundColor: color
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <FontAwesome name={recording ? 'stop-circle' : 'circle'} size={64} color="white" />
      </TouchableOpacity>

      <Text style={styles.recordingStatusText}>{`Recording status: ${recordingStatus}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
   
  },
  recordingStatusText: {
    marginTop: 16,
  },
});
