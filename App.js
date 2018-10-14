/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');
// Load the sound file 'en_one.mp3' from the app bundle
// See notes below about preloading sounds within initialization code below.
var en_one = new Sound('en1.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
    // loaded successfully
    console.log('duration in seconds: ' + en_one.getDuration() + 'number of channels: ' + en_one.getNumberOfChannels());
});
var en_two = new Sound('en2.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
    // loaded successfully
    console.log('duration in seconds: ' + en_two.getDuration() + 'number of channels: ' + en_two.getNumberOfChannels());
});

let currentSound;

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

export default class App extends Component<Props> {

  constructor() {
    super();
    this.state = {
      num: '',
    }
  }

  render() {
      return (
      <View style={styles.container}>
{/*

        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
*/}
        <TextInput  value={this.state.num} onChangeText={ (num) => this.setState({num})} style={[styles.welcome, {borderColor: 'gray'}]}/>
        <TouchableOpacity onPress={ () => this._play()} style={[ styles.container, {backgroundColor: 'blue',  flex: 0.2, }]}>
          <Text style={[ styles.welcome, {color: 'white', fontWeight: 'bold', width: 200, }]}>{'PLAY'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => this._stop()} style={[ styles.container, {backgroundColor: 'green',  flex: 0.2, }]}>
          <Text style={[ styles.welcome, {color: 'white', fontWeight: 'bold', width: 200, }]}>{'STOP'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => this._pause()} style={[ styles.container, {backgroundColor: 'orange',  flex: 0.2, }]}>
          <Text style={[ styles.welcome, {color: 'white', fontWeight: 'bold', width: 200, }]}>{'PAUSE'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => this._resume()} style={[ styles.container, {backgroundColor: 'yellow',  flex: 0.2, }]}>
          <Text style={[ styles.welcome, {color: 'white', fontWeight: 'bold', width: 200, }]}>{'RESUME'}</Text>
        </TouchableOpacity>

      </View>
    );
  }

  _stop() {
      currentSound.stop();
  }


    _pause() {
        currentSound.pause();
    }

    _resume() {
        currentSound.play();
    }


    _play1(sound) {

      currentSound = sound;

      return new Promise((resolve, reject) => {
          sound.play((success) => {
              if (success) {
                  console.log('successfully finished playing');
                  resolve('success')
              } else {
                  console.log('playback failed due to audio decoding errors');
                  // reset the player to its uninitialized state (android only)
                  // this is the only option to recover after an error occured and use the player again
                  sound.reset();
                  reject('error 1');
              }
          });
      });
  }


  _playSounds(sounds) {
      var p = Promise.resolve(); // Q() in q

      sounds.forEach(sound =>
          p = p.then(() => this._play1(sound))
      );

      return p;
  }

  _audoiPlay(sound) {

      sound.play((success) => {
          if (success) {
              console.log('successfully finished playing');
          } else {
              console.log('playback failed due to audio decoding errors');
              // reset the player to its uninitialized state (android only)
              // this is the only option to recover after an error occured and use the player again
              sound.reset();
          }
      });
  }


    _play() {

      let s3 = new Sound('en3.mp3', Sound.MAIN_BUNDLE, () => {
          console.log(s3.getDuration());
      });
      let s4 = new Sound('en4.mp3', Sound.MAIN_BUNDLE, () => {
        console.log(s4.getDuration());
      });
      let s5 = new Sound('en5.mp3', Sound.MAIN_BUNDLE, () => {
        console.log(s5.getDuration());
      });


      let sounds = [en_one, en_two, s3, s4, s5];

      console.log('num ',this.state.num);

      this._playSounds(sounds).then( () => console.log('end') );

      console.log('start');

// Play the sound with an onEnd callback

    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
