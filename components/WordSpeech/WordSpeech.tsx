import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WordToSpeech } from '../../interfaces';

export interface IWordSpeech extends WordToSpeech {
    index: number,

} 
export interface WordSpeechProps {
    word: IWordSpeech
    speechTheWord: (word:string) => void
    removeItem: (index:number ) => void
}

const WordSpeech: React.FC<WordSpeechProps> = ({ word, speechTheWord, removeItem }) => {

  return (
    <View style={styles.listItem} key={`${word.index}_${word.text}`}>

      <View style={{...styles.task, alignItems: "center",flexDirection: "row",}}>

    <Text
      style={[
        word.completed ? { color: "red", fontWeight: '600' }: { color: "rgba(0,0,32,0.9)"} 
      ]}
    >{word.text} 
    </Text>
    {word.completed && (
      <Ionicons name="volume-medium-outline" color="crimson" size={20} style={{
        paddingLeft: 5,
        paddingTop:2
      }}/>
    )
    }
    </View>

    <View style={styles.listButtons}>
        <View>
        <TouchableOpacity
      onPress={() => speechTheWord(word.text)}
      style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}
      ><Ionicons name="play-circle-outline" color="crimson"
  size={25} iconStyle={{
    padding:10 
  }}/></TouchableOpacity>
        </View>
        <View style={{marginLeft: 10}}>
        <TouchableOpacity
      onPress={() => removeItem(word.index)}
      style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}
      ><Ionicons name="ios-trash-bin-outline" color="crimson"
  size={25} iconStyle={{
    padding:10 
  }}/></TouchableOpacity>
        </View>
    
  

    </View>
    
  </View>
  );
}


const styles = StyleSheet.create({
    listItem: {
      flexDirection: "row",
    //   justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      maxWidth: "100%",
      marginBottom: 10
    },
    listButtons: {
        flexDirection: "row",
        width:'20%',
      justifyContent: "flex-end",
    },
    task: {
      width: '80%'
    },
  });

  
export default WordSpeech;