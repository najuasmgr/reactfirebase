import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {v4 as uuidv4} from 'uuid';

export default function ScreenSignup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [showNext, setShowNext] = useState(false);

  const pickImage = () => {
    launchImageLibrary({quality: 0.5}, fileObj => {
      console.log(fileObj.assets[0].uri);
      //const uploadTask =  storage().ref.child(`/users/${uuidv4()}`).putFile(fileObj.uri);
      //const source = {uri: 'data:image/jpeg;base64,' + fileObj.base64};
      setImage(fileObj.assets[0].uri);
    });
  };

  const uploadImage = imageUri => {
    const task = storage().ref(`yo`).putFile(imageUri);
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );
    });

    task.then(() => {
      console.log('Image uploaded to the bucket!');
    });
  };

  return (
    <KeyboardAvoidingView behavior="padding">
      <View style={styles.box1}>
        <Text style={styles.text}>Welcome to WhatsApp</Text>
        <Image style={styles.img} source={require('../assets/logo.png')} />
      </View>
      <View style={styles.box2}>
        {!showNext && (
          <>
            <TextInput
              label="Email"
              value={email}
              onChangeText={text => setEmail(text)}
              mode="outlined"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={text => setPassword(text)}
              secureTextEntry={true}
              mode="outlined"
            />
          </>
        )}
        {showNext ? (
          <>
            <TextInput
              label="Name"
              value={name}
              onChangeText={text => setName(text)}
              mode="outlined"
            />
            <Image source={{uri: image}} style={styles.img2} />
            <Button onPress={() => pickImage()} mode="contained">
              Select Profile Pic
            </Button>
            <Button onPress={() => uploadImage(image)} mode="contained">
              SignUp
            </Button>
          </>
        ) : (
          <Button onPress={() => setShowNext(true)} mode="contained">
            Next
          </Button>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    color: 'green',
    fontWeight: 'bold',
  },
  img: {
    width: 200,
    height: 200,
  },
  img2: {
    alignSelf: 'center',

    width: 100,
    height: 100,
  },
  box1: {
    marginTop: 50,
    alignItems: 'center',
  },
  box2: {
    height: '50%',
    paddingHorizontal: 40,
    justifyContent: 'space-evenly',
  },
});
