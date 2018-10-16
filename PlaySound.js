import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import Sound from 'react-native-sound';


Sound.setCategory('Playback');

type Props = {tracks:['en1', 'en2', 'en1', 'en2', 'en1', 'en2']};

let _interval;

let currentTrackSound;
let loadedTrackSounds = [];


export default class PlaySound extends Component<Props> {

    constructor(props) {
        super(props);

        console.log(props);

        this.state = {
            _counter: 0,
            _duration: -1,
            _number: '012345',
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>{'PLAY SOUND'}</Text>
                <TouchableOpacity onPress={ () => this._play()} style={[ styles.container, {backgroundColor: 'purple',  flex: 0.2, }]}>
                    <Text style={[ styles.welcome, {color: 'white', fontWeight: 'bold', width: 200, }]}>{'PLAY'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={ () => this._stop()} style={[ styles.container, {backgroundColor: 'green',  flex: 0.2, }]}>
                    <Text style={[ styles.welcome, {color: 'white', fontWeight: 'bold', width: 200, }]}>{'STOP'}</Text>
                </TouchableOpacity>

                <Text style={[ styles.welcome, {color: 'gray', fontWeight: 'bold', width: 200, }]}>{this.state._counter}</Text>
                <Text style={[ styles.welcome, {color: 'gray', fontWeight: 'bold', width: 200, }]}>{this.state._duration}</Text>
                <Text style={[ styles.welcome, {color: 'gray', fontWeight: 'bold', width: 200, }]}>{this.props.tracks}</Text>

            </View>
        )
    }


    _play() {
        _interval = setInterval( () => {
            console.log('counter', this.state._counter);
            this.setState({_counter: this.state._counter===0 ? 0 : this.state._counter-1});
        }, 1000);


        this.playTracks(this.props.tracks).then( (t) => {
            console.log('end: ', t);
            clearInterval(_interval);
        });
    }

    playTracks(tracks) {

        return new Promise((resolve, reject) => {

            this._loadTrackSounds(tracks)
                .then(() => {
                    console.log('loadedTrackSounds: ', loadedTrackSounds);
                    let duration = 0;

                    loadedTrackSounds.forEach( (lts) => {
                        duration += lts._duration;
                    });

                    console.log('duration: ', duration);
                    this.setState({_duration:Math.floor(duration)});
                    this.setState({_counter:Math.ceil(duration)});

                    this._playTracks(loadedTrackSounds).then( () => {
                        console.log('successfully finished playing tracks.');
                        loadedTrackSounds = [];
                        resolve('success');
                    } );
                });
        });
    }

    _playTrack(trackSound) {

        currentTrackSound = trackSound;

        return new Promise((resolve, reject) => {

            trackSound.play((success) => {
                if (success) {
                    console.log('successfully finished playing: ', trackSound);
                    resolve('success');
                } else {
                    console.log('playback failed due to audio decoding errors: ', trackSound);
                    // reset the player to its uninitialized state (android only)
                    // this is the only option to recover after an error occured and use the player again
                    trackSound.reset();
                    reject('error');
                }
            });
        });
    };

    _loadTrackSound(trackSound) {
        return new Promise((resolve, reject) => {

            let trackSoundLoad = new Sound(trackSound + '.mp3', Sound.MAIN_BUNDLE, (error) => {
                if (error) {
                    console.log('failed to load the sound: ' + trackSound, error);
                    reject('failed to load the sound: ' + trackSound + ' ' + error)
                } else {
                    console.log('track duration: ' + trackSound, trackSoundLoad.getDuration());
                    console.log('trackSoundLoad ', trackSoundLoad);
                    resolve(trackSoundLoad);
                }
            });
        });
    }

    _playTracks(trackSounds) {
        var p = Promise.resolve();

        trackSounds.forEach(trackSound =>
            p = p.then(() => this._playTrack(trackSound))
        );

        return p;
    };

    _loadTrackSounds(trackSounds) {
        return trackSounds.reduce((promise, track) => {
            return promise
                .then((trackSound) => {
                    console.log('item: ', track);
                    return this._loadTrackSound(track).then(trackSound => loadedTrackSounds.push(trackSound));
                })
                .catch(console.error);
        }, Promise.resolve());
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
