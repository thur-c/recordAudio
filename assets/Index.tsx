import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import Voice from 'react-native-voice';

export default function Index(){

  const [textToSpeak, setTextToSpeak] = useState('');
  
  Voice.onSpeechResults = (e) => {
    setTextToSpeak(e.value[0]);
  };
  
  const startSpeaking = async () => {
    try {
      await Voice.start('pt-BR'); // Você pode ajustar o idioma conforme necessário
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <View style={{ backgroundColor: '#f55', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{textToSpeak}</Text>
      <TouchableOpacity  onPress={startSpeaking}><Text>Iniciar Conversão</Text></TouchableOpacity>
    </View>
  );
}
