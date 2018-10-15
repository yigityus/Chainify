import Sound from 'react-native-sound';

let currentTrackSound;
let loadedTrackSounds = [];

export function playTracks(tracks) {

    let trackSoundsDuration = 0;

    _loadTracks(tracks).then( () => {
        console.log('loaded ');
        console.log('loadedTrackSounds ', loadedTrackSounds);



        _playTracks(loadedTrackSounds).then( () => {
            console.log('successfully finished playing tracks.');
            loadedTrackSounds = [];
        });
        console.log('start playing tracks.');

    }) ;


/*

    let lp = _loadTracks(tracks).then( (loadedPromise) => {
        console.log('loaded');
        console.log('loadedPromise ', loadedPromise);
        console.log('lp ', lp);
    });

*/
}


_loadTracks = function (trackSounds) {

    var p = Promise.resolve();

    trackSounds.forEach(trackSound => {
        p = p.then(() =>  {
            let loadedTrackSound = _loadTrack(trackSound);

            console.log('trackSound ', trackSound);
            console.log('loadedTrackSound ', loadedTrackSound);


        })
    });

    return p;
};

_loadTrack = function (trackSound) {

    console.log('trackSound ', trackSound);

    return new Promise((resolve, reject) => {

        let trackSoundLoad = new Sound(trackSound + '.mp3', Sound.MAIN_BUNDLE, (error) => {

            if (error) {
                console.log('failed to load the sound: ' + trackSound, error);
                reject('failed to load the sound: ' + trackSound + ' ' + error)
            } else {

                console.log('track duration: ' + trackSound, trackSoundLoad.getDuration());
                trackSoundLoad.trackSoundDuration = trackSoundLoad.getDuration();
                console.log('trackSoundLoad ', trackSoundLoad);
                loadedTrackSounds.push(trackSoundLoad);
                resolve(trackSoundLoad);
            }
        });
    });
};


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
