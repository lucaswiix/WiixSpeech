import { useFonts } from '@expo-google-fonts/inter';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Linking, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import WordSpeech from './components/WordSpeech/WordSpeech';
import { WordToSpeech } from './interfaces';

export default function App() {
  const [fontLoaded] = useFonts({
    'HachiMaruPop-Regular': require('./assets/fonts/HachiMaruPop-Regular.ttf'),
  });

  const [value, setValue] = useState<string>("");
  const [wordList, setWordList] = useState<WordToSpeech[]>([]);
  const [error, setError] = useState<{
    error: boolean,
    message: string  
  }>();
  const [isOn, setOn] = useState<Boolean>(false);
  const [getIntervalId, setIntervalId] = useState<any>();
  const [isLoading, setLoading] = useState<Boolean>(false);
  const [currentKey, setCurrentKey] = useState<number>();
  const [activeId, setActiveId] = useState<number>();
  const PERSIST_KEY = 'wordListKey'

  const SPEAKCONFIG = { 
    language: 'en-US',
         voice: 'com.apple.ttsbundle.Samantha-compact'
  }

  useEffect(() => {
    async function getByStorage() {
      setLoading(true);
      const list = await AsyncStorage.getItem(PERSIST_KEY);
      if(list){
        setWordList(JSON.parse(list));
      }
      setLoading(false);
    }
    getByStorage();
  }, []);

  const handleSubmit = async (): Promise<void> => {
    if (value.trim()){
      if(value.trim().length > 50) {
        setValue("");
        return setError({
          error: true,
          message: "Input field is too long, max 50 characters."
        })
      }
      setWordList([...wordList, { text: value, completed: false }]);
      await AsyncStorage.setItem(PERSIST_KEY, JSON.stringify(wordList))
    }
    else setError({
      error: true,
      message: "Input field is empty dude"
    });
    setValue("");
  };

  const removeItem = (index: number): void => {
    const newToDoList = [...wordList];
    newToDoList.splice(index, 1);
    setWordList(newToDoList);
  };

  const handlePlaySpeech = async():Promise<void> => {
    
    var currentWord = -1;
    
    const intervalId = setInterval(() => {
       currentWord++;
       if(currentWord >= wordList.length){
         currentWord = 0;
       }
       setCurrentKey(currentWord);
       Speech.speak(wordList[currentWord].text, {
         onStopped: () => {
           clearInterval(intervalId)
         },
         ...SPEAKCONFIG
       });
    }, 2000);

    if(!isOn){
      setOn(true);
    } 

    setIntervalId(intervalId);
  };

  const speechTheWord = async (word:string, index:number) => {
    setActiveId(index);
    Speech.speak(word, {
      ...SPEAKCONFIG
    });
    setTimeout(() => setActiveId(undefined), 1000);
  }

  const StopSpeech = async() => {
    clearInterval(getIntervalId);
    Speech.stop();
    setOn(false);
  }

  if (!fontLoaded) {
    return <AppLoading />;
  }
  
  return ( 
  <SafeAreaView 
    style={styles.container}
>
  <KeyboardAvoidingView
   behavior="padding"
   enabled={Platform.OS == "ios"}
   >

    {isLoading ? (
      <ActivityIndicator />
    ): (
    <View style={styles.container}>
    <Text style={{...styles.title, fontFamily: 'HachiMaruPop-Regular'}}>Wiix Speech</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        placeholder="Enter your word..."
        value={value}
        onChangeText={e => {
          setValue(e);
          setError({ 
            error: false,
            message: ""
          });
        }}
        style={styles.inputBox}
      />
      <View style={{alignItems: "center",
    flexDirection: "row"}}>

      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        marginLeft: 10

          
        }}
        ><Ionicons name="add-circle-outline" color="crimson"
    size={30}   
    iconStyle={{
      padding:10,
    }}/></TouchableOpacity>


      {isOn ? (    <TouchableOpacity
        onPress={StopSpeech}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        marginLeft: 10

        }}
        ><Ionicons name="stop-circle-outline" color="crimson"
    size={30} iconStyle={{
      padding:10 
    }}/></TouchableOpacity>) : (<TouchableOpacity
      onPress={handlePlaySpeech}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10
      }}
      ><Ionicons name="play-circle-outline" color="crimson"
  size={30} iconStyle={{
    padding:10 
  }}/></TouchableOpacity>)}
      </View>

    </View>
    {error && (
      <Text style={styles.error}>{error.message}</Text>
    )}
    <Text style={styles.subtitle}>Your words :</Text>
    {wordList.length === 0 && <Text>No words available</Text>}
    <ScrollView style={{
      flexDirection: 'column',
    }}>
      {wordList.map((word, index) => (
        <WordSpeech 
        key={index}
        
        word={{
          ...word,
          index: index,
          completed: (index === currentKey && isOn || index === activeId)
        }} 
        removeItem={removeItem}
        speechTheWord={(word) => speechTheWord(word, index)}
        />
      ))}
    </ScrollView>

  </View>
  )}
  </KeyboardAvoidingView>

  <View style={{
      backgroundColor: "#E9C46A",
      padding: 10,
      alignItems: "center",
      justifyContent: "center"
    }}>
    <Text>
     I do it with my heart, but the company that produces beer doesn't.&nbsp;     
     <Text onPress={() => Linking.openURL('https://www.paypal.com/donate/?hosted_button_id=HVT7JM4KL3532')} style={{textDecorationLine: "underline",fontWeight: "bold", color: "rgba(0,0,32,0.9)"}}>
      Consider donating to us by Paypal. 
    </Text>
   </Text>
  </View>
  </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex:1,
        backgroundColor:'#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
  },
  inputWrapper: {
    position: 'relative',
    alignItems: 'center',
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  inputBox: {
    width: 200,
    borderColor: "#2A9D8F",
    borderRadius: 8,
    paddingTop: 5,
    paddingBottom: 5,
    borderWidth: 2,
    paddingLeft: 8
  },
  title: {
    fontSize: 40,
    marginBottom: 40,
    fontFamily: 'HachiMaru',    
    fontWeight: "bold",
    color:"#FCA311",
    textDecorationLine: "none"
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    color: "#2A9D8F"
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10
  },
  addButton: {
    alignItems: "flex-end"
  },
  task: {
    width: 200
  },
  error: {
    color: "red"
  },
  actionSoundBtn: {
    borderRadius: 20,
    borderColor: 'red',
    borderStyle: 'solid',
    borderWidth: 2,
    padding: 10
  }
});
