import Sound from 'react-native-sound';

let currentTrackSound;
let loadedTrackSounds = [];


_loadTrackSound = function (trackSound) {
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

_loadTrackSounds = function (trackSounds) {
    return trackSounds.reduce((promise, track) => {
        return promise
            .then((trackSound) => {
                console.log('item: ', track);
                return _loadTrackSound(track).then(trackSound => loadedTrackSounds.push(trackSound));
            })
            .catch(console.error);
    }, Promise.resolve());
}

export function playTracks(tracks) {

    return new Promise((resolve, reject) => {

        _loadTrackSounds(tracks)
            .then(() => {
                console.log('loadedTrackSounds: ', loadedTrackSounds);
                let duration = 0;

                loadedTrackSounds.forEach( (lts) => {
                    duration += lts._duration;
                });

                console.log('duration: ', duration);

                _playTracks(loadedTrackSounds).then( () => {
                    console.log('successfully finished playing tracks.');
                    loadedTrackSounds = [];
                    resolve('success');
                } );
            });
    });
}


_playTracks = function (trackSounds) {
    var p = Promise.resolve();

    trackSounds.forEach(trackSound =>
        p = p.then(() => _playTrack(trackSound))
    );

    return p;
};

_playTrack = function (trackSound) {

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
