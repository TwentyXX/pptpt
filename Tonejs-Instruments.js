/**
* @fileoverview A sample library and quick-loader for tone.js
*
* @author N.P. Brosowsky (nbrosowsky@gmail.com)
* https://github.com/nbrosowsky/tonejs-instruments
*/

// Service Workerを登録
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker登録成功:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker登録失敗:', error);
            });
    });
}

var SampleLibrary = {
    minify: false,
    ext: '.[mp3|ogg]', // use setExt to change the extensions on all files // do not change this variable //
    baseUrl: '/samples/',
    list: ['bass-electric','bassoon','cello','clarinet','contrabass','flute','french-horn','guitar-acoustic','guitar-electric','guitar-nylon', 'harmonium','harp','organ','piano','saxophone','trombone','trumpet','tuba','violin','xylophone','bell','casio','chord-tone','femalevoice-aa','femalevoice-oo','femalevoices-aa2','femalevoices-oo2','malevoice-aa','malevoice-oo','malevoices-aa2','malevoices-oo2','music-box','prepared-piano','small-bell',],
    onload: null,

    setExt: function (newExt) {
        var i
        for (i = 0; i <= this.list.length - 1; i++) {
            for (var property in this[this.list[i]]) {

                this[this.list[i]][property] = this[this.list[i]][property].replace(this.ext, newExt)
            }


        }
        this.ext = newExt;
        return console.log("sample extensions set to " + this.ext)
    },

    load: function (arg) {
        var t, rt, i;
        (arg) ? t = arg: t = {};
        t.instruments = t.instruments || this.list;
        t.baseUrl = t.baseUrl || this.baseUrl;
        t.onload = t.onload || this.onload;

        // update extensions if arg given
        if (t.ext) {
            if (t.ext != this.ext) {
                this.setExt(t.ext)
            }
            t.ext = this.ext
        }

        rt = {};

        // if an array of instruments is passed...
        if (Array.isArray(t.instruments)) {
            for (i = 0; i <= t.instruments.length - 1; i++) {
                var newT = this[t.instruments[i]];
                //Minimize the number of samples to load
                if (this.minify === true || t.minify === true) {
                    var minBy = 1;
                    if (Object.keys(newT).length >= 17) {
                        minBy = 2
                    }
                    if (Object.keys(newT).length >= 33) {
                        minBy = 4
                    }
                    if (Object.keys(newT).length >= 49) {
                        minBy = 6
                    }

                    var filtered = Object.keys(newT).filter(function (_, i) {
                        return i % minBy != 0;
                    })
                    filtered.forEach(function (f) {
                        delete newT[f]
                    })

                }




                rt[t.instruments[i]] = new Tone.Sampler(
                    newT, {
                        baseUrl: t.baseUrl + t.instruments[i] + "/",
                        onload: t.onload
                    }

                )
            }

            return rt

            // if a single instrument name is passed...
        } else {
            newT = this[t.instruments];

            //Minimize the number of samples to load
            if (this.minify === true || t.minify === true) {
                minBy = 1;
                if (Object.keys(newT).length >= 17) {
                    minBy = 2
                }
                if (Object.keys(newT).length >= 33) {
                    minBy = 4
                }
                if (Object.keys(newT).length >= 49) {
                    minBy = 6
                }

                filtered = Object.keys(newT).filter(function (_, i) {
                    return i % minBy != 0;
                })
                filtered.forEach(function (f) {
                    delete newT[f]
                })
            }




            var s = new Tone.Sampler(
                newT, {
                    baseUrl: t.baseUrl + t.instruments + "/",
                    onload: t.onload
                }
            )

            return s
        }

    },

    'bass-electric': {
        'A#1': 'As1.ogg',
        'A#2': 'As2.ogg',
        'A#3': 'As3.ogg',
        'A#4': 'As4.ogg',
        'C#1': 'Cs1.ogg',
        'C#2': 'Cs2.ogg',
        'C#3': 'Cs3.ogg',
        'C#4': 'Cs4.ogg',
        'E1': 'E1.ogg',
        'E2': 'E2.ogg',
        'E3': 'E3.ogg',
        'E4': 'E4.ogg',
        'G1': 'G1.ogg',
        'G2': 'G2.ogg',
        'G3': 'G3.ogg',
        'G4': 'G4.ogg'
    },

    'bassoon': {
        'A4': 'A4.ogg',
        'C3': 'C3.ogg',
        'C4': 'C4.ogg',
        'C5': 'C5.ogg',
        'E4': 'E4.ogg',
        'G2': 'G2.ogg',
        'G3': 'G3.ogg',
        'G4': 'G4.ogg',
        'A2': 'A2.ogg',
        'A3': 'A3.ogg'

    },

    'cello': {
        'E3': 'E3.ogg',
        'E4': 'E4.ogg',
        'F2': 'F2.ogg',
        'F3': 'F3.ogg',
        'F4': 'F4.ogg',
        'F#3': 'Fs3.ogg',
        'F#4': 'Fs4.ogg',
        'G2': 'G2.ogg',
        'G3': 'G3.ogg',
        'G4': 'G4.ogg',
        'G#2': 'Gs2.ogg',
        'G#3': 'Gs3.ogg',
        'G#4': 'Gs4.ogg',
        'A2': 'A2.ogg',
        'A3': 'A3.ogg',
        'A4': 'A4.ogg',
        'A#2': 'As2.ogg',
        'A#3': 'As3.ogg',
        'B2': 'B2.ogg',
        'B3': 'B3.ogg',
        'B4': 'B4.ogg',
        'C2': 'C2.ogg',
        'C3': 'C3.ogg',
        'C4': 'C4.ogg',
        'C5': 'C5.ogg',
        'C#3': 'Cs3.ogg',
        'C#4': 'Cs4.ogg',
        'D2': 'D2.ogg',
        'D3': 'D3.ogg',
        'D4': 'D4.ogg',
        'D#2': 'Ds2.ogg',
        'D#3': 'Ds3.ogg',
        'D#4': 'Ds4.ogg',
        'E2': 'E2.ogg'

    },

    'clarinet': {
        'D4': 'D4.ogg',
        'D5': 'D5.ogg',
        'D6': 'D6.ogg',
        'F3': 'F3.ogg',
        'F4': 'F4.ogg',
        'F5': 'F5.ogg',
        'F#6': 'Fs6.ogg',
        'A#3': 'As3.ogg',
        'A#4': 'As4.ogg',
        'A#5': 'As5.ogg',
        'D3': 'D3.ogg'

    },

    'contrabass': {
        'C2': 'C2.ogg',
        'C#3': 'Cs3.ogg',
        'D2': 'D2.ogg',
        'E2': 'E2.ogg',
        'E3': 'E3.ogg',
        'F#1': 'Fs1.ogg',
        'F#2': 'Fs2.ogg',
        'G1': 'G1.ogg',
        'G#2': 'Gs2.ogg',
        'G#3': 'Gs3.ogg',
        'A2': 'A2.ogg',
        'A#1': 'As1.ogg',
        'B3': 'B3.ogg'

    },

    'flute': {
        'A6': 'A6.ogg',
        'C4': 'C4.ogg',
        'C5': 'C5.ogg',
        'C6': 'C6.ogg',
        'C7': 'C7.ogg',
        'E4': 'E4.ogg',
        'E5': 'E5.ogg',
        'E6': 'E6.ogg',
        'A4': 'A4.ogg',
        'A5': 'A5.ogg'

    },

    'french-horn': {
        'D3': 'D3.ogg',
        'D5': 'D5.ogg',
        'D#2': 'Ds2.ogg',
        'F3': 'F3.ogg',
        'F5': 'F5.ogg',
        'G2': 'G2.ogg',
        'A1': 'A1.ogg',
        'A3': 'A3.ogg',
        'C2': 'C2.ogg',
        'C4': 'C4.ogg',

    },

    'guitar-acoustic': {
        'F4': 'F4.ogg',
        'F#2': 'Fs2.ogg',
        'F#3': 'Fs3.ogg',
        'F#4': 'Fs4.ogg',
        'G2': 'G2.ogg',
        'G3': 'G3.ogg',
        'G4': 'G4.ogg',
        'G#2': 'Gs2.ogg',
        'G#3': 'Gs3.ogg',
        'G#4': 'Gs4.ogg',
        'A2': 'A2.ogg',
        'A3': 'A3.ogg',
        'A4': 'A4.ogg',
        'A#2': 'As2.ogg',
        'A#3': 'As3.ogg',
        'A#4': 'As4.ogg',
        'B2': 'B2.ogg',
        'B3': 'B3.ogg',
        'B4': 'B4.ogg',
        'C3': 'C3.ogg',
        'C4': 'C4.ogg',
        'C5': 'C5.ogg',
        'C#3': 'Cs3.ogg',
        'C#4': 'Cs4.ogg',
        'C#5': 'Cs5.ogg',
        'D2': 'D2.ogg',
        'D3': 'D3.ogg',
        'D4': 'D4.ogg',
        'D5': 'D5.ogg',
        'D#2': 'Ds2.ogg',
        'D#3': 'Ds3.ogg',
        'D#4': 'Ds3.ogg',
        'E2': 'E2.ogg',
        'E3': 'E3.ogg',
        'E4': 'E4.ogg',
        'F2': 'F2.ogg',
        'F3': 'F3.ogg'

    },


    'guitar-electric': {
        'D#3': 'Ds3.ogg',
        'D#4': 'Ds4.ogg',
        'D#5': 'Ds5.ogg',
        'E2': 'E2.ogg',
        'F#2': 'Fs2.ogg',
        'F#3': 'Fs3.ogg',
        'F#4': 'Fs4.ogg',
        'F#5': 'Fs5.ogg',
        'A2': 'A2.ogg',
        'A3': 'A3.ogg',
        'A4': 'A4.ogg',
        'A5': 'A5.ogg',
        'C3': 'C3.ogg',
        'C4': 'C4.ogg',
        'C5': 'C5.ogg',
        'C6': 'C6.ogg',
        'C#2': 'Cs2.ogg'
    },

    'guitar-nylon': {
        'F#2': 'Fs2.ogg',
        'F#3': 'Fs3.ogg',
        'F#4': 'Fs4.ogg',
        'F#5': 'Fs5.ogg',
        'G3': 'G3.ogg',
        'G5': 'G3.ogg',
        'G#2': 'Gs2.ogg',
        'G#4': 'Gs4.ogg',
        'G#5': 'Gs5.ogg',
        'A2': 'A2.ogg',
        'A3': 'A3.ogg',
        'A4': 'A4.ogg',
        'A5': 'A5.ogg',
        'A#5': 'As5.ogg',
        'B1': 'B1.ogg',
        'B2': 'B2.ogg',
        'B3': 'B3.ogg',
        'B4': 'B4.ogg',
        'C#3': 'Cs3.ogg',
        'C#4': 'Cs4.ogg',
        'C#5': 'Cs5.ogg',
        'D2': 'D2.ogg',
        'D3': 'D3.ogg',
        'D5': 'D5.ogg',
        'D#4': 'Ds4.ogg',
        'E2': 'E2.ogg',
        'E3': 'E3.ogg',
        'E4': 'E4.ogg',
        'E5': 'E5.ogg'
    },


    'harmonium': {
        'C2': 'C2.ogg',
        'C3': 'C3.ogg',
        'C4': 'C4.ogg',
        'C5': 'C5.ogg',
        'C#2': 'Cs2.ogg',
        'C#3': 'Cs3.ogg',
        'C#4': 'Cs4.ogg',
        'C#5': 'Cs5.ogg',
        'D2': 'D2.ogg',
        'D3': 'D3.ogg',
        'D4': 'D4.ogg',
        'D5': 'D5.ogg',
        'D#2': 'Ds2.ogg',
        'D#3': 'Ds3.ogg',
        'D#4': 'Ds4.ogg',
        'E2': 'E2.ogg',
        'E3': 'E3.ogg',
        'E4': 'E4.ogg',
        'F2': 'F2.ogg',
        'F3': 'F3.ogg',
        'F4': 'F4.ogg',
        'F#2': 'Fs2.ogg',
        'F#3': 'Fs3.ogg',
        'G2': 'G2.ogg',
        'G3': 'G3.ogg',
        'G4': 'G4.ogg',
        'G#2': 'Gs2.ogg',
        'G#3': 'Gs3.ogg',
        'G#4': 'Gs4.ogg',
        'A2': 'A2.ogg',
        'A3': 'A3.ogg',
        'A4': 'A4.ogg',
        'A#2': 'As2.ogg',
        'A#3': 'As3.ogg',
        'A#4': 'As4.ogg'
    },

    'harp': {
        'C5': 'C5.ogg',
        'D2': 'D2.ogg',
        'D4': 'D4.ogg',
        'D6': 'D6.ogg',
        'D7': 'D7.ogg',
        'E1': 'E1.ogg',
        'E3': 'E3.ogg',
        'E5': 'E5.ogg',
        'F2': 'F2.ogg',
        'F4': 'F4.ogg',
        'F6': 'F6.ogg',
        'F7': 'F7.ogg',
        'G1': 'G1.ogg',
        'G3': 'G3.ogg',
        'G5': 'G5.ogg',
        'A2': 'A2.ogg',
        'A4': 'A4.ogg',
        'A6': 'A6.ogg',
        'B1': 'B1.ogg',
        'B3': 'B3.ogg',
        'B5': 'B5.ogg',
        'B6': 'B6.ogg',
        'C3': 'C3.ogg'

    },

    'organ': {
        'C3': 'C3.ogg',
        'C4': 'C4.ogg',
        'C5': 'C5.ogg',
        'C6': 'C6.ogg',
        'D#1': 'Ds1.ogg',
        'D#2': 'Ds2.ogg',
        'D#3': 'Ds3.ogg',
        'D#4': 'Ds4.ogg',
        'D#5': 'Ds5.ogg',
        'F#1': 'Fs1.ogg',
        'F#2': 'Fs2.ogg',
        'F#3': 'Fs3.ogg',
        'F#4': 'Fs4.ogg',
        'F#5': 'Fs5.ogg',
        'A1': 'A1.ogg',
        'A2': 'A2.ogg',
        'A3': 'A3.ogg',
        'A4': 'A4.ogg',
        'A5': 'A5.ogg',
        'C1': 'C1.ogg',
        'C2': 'C2.ogg'
    },

    'piano': {
        'A7': 'A7.ogg',
        'A1': 'A1.ogg',
        'A2': 'A2.ogg',
        'A3': 'A3.ogg',
        'A4': 'A4.ogg',
        'A5': 'A5.ogg',
        'A6': 'A6.ogg',
        'A#7': 'As7.ogg',
        'A#1': 'As1.ogg',
        'A#2': 'As2.ogg',
        'A#3': 'As3.ogg',
        'A#4': 'As4.ogg',
        'A#5': 'As5.ogg',
        'A#6': 'As6.ogg',
        'B7': 'B7.ogg',
        'B1': 'B1.ogg',
        'B2': 'B2.ogg',
        'B3': 'B3.ogg',
        'B4': 'B4.ogg',
        'B5': 'B5.ogg',
        'B6': 'B6.ogg',
        'C7': 'C7.ogg',
        'C1': 'C1.ogg',
        'C2': 'C2.ogg',
        'C3': 'C3.ogg',
        'C4': 'C4.ogg',
        'C5': 'C5.ogg',
        'C6': 'C6.ogg',
        'C7': 'C7.ogg',
        'C#7': 'Cs7.ogg',
        'C#1': 'Cs1.ogg',
        'C#2': 'Cs2.ogg',
        'C#3': 'Cs3.ogg',
        'C#4': 'Cs4.ogg',
        'C#5': 'Cs5.ogg',
        'C#6': 'Cs6.ogg',
        'D7': 'D7.ogg',
        'D1': 'D1.ogg',
        'D2': 'D2.ogg',
        'D3': 'D3.ogg',
        'D4': 'D4.ogg',
        'D5': 'D5.ogg',
        'D6': 'D6.ogg',
        'D#7': 'Ds7.ogg',
        'D#1': 'Ds1.ogg',
        'D#2': 'Ds2.ogg',
        'D#3': 'Ds3.ogg',
        'D#4': 'Ds4.ogg',
        'D#5': 'Ds5.ogg',
        'D#6': 'Ds6.ogg',
        'E7': 'E7.ogg',
        'E1': 'E1.ogg',
        'E2': 'E2.ogg',
        'E3': 'E3.ogg',
        'E4': 'E4.ogg',
        'E5': 'E5.ogg',
        'E6': 'E6.ogg',
        'F7': 'F7.ogg',
        'F1': 'F1.ogg',
        'F2': 'F2.ogg',
        'F3': 'F3.ogg',
        'F4': 'F4.ogg',
        'F5': 'F5.ogg',
        'F6': 'F6.ogg',
        'F#7': 'Fs7.ogg',
        'F#1': 'Fs1.ogg',
        'F#2': 'Fs2.ogg',
        'F#3': 'Fs3.ogg',
        'F#4': 'Fs4.ogg',
        'F#5': 'Fs5.ogg',
        'F#6': 'Fs6.ogg',
        'G7': 'G7.ogg',
        'G1': 'G1.ogg',
        'G2': 'G2.ogg',
        'G3': 'G3.ogg',
        'G4': 'G4.ogg',
        'G5': 'G5.ogg',
        'G6': 'G6.ogg',
        'G#7': 'Gs7.ogg',
        'G#1': 'Gs1.ogg',
        'G#2': 'Gs2.ogg',
        'G#3': 'Gs3.ogg',
        'G#4': 'Gs4.ogg',
        'G#5': 'Gs5.ogg',
        'G#6': 'Gs6.ogg'
    },

    'saxophone': {
        'D#5': 'Ds5.ogg',
        'E3': 'E3.ogg',
        'E4': 'E4.ogg',
        'E5': 'E5.ogg',
        'F3': 'F3.ogg',
        'F4': 'F4.ogg',
        'F5': 'F5.ogg',
        'F#3': 'Fs3.ogg',
        'F#4': 'Fs4.ogg',
        'F#5': 'Fs5.ogg',
        'G3': 'G3.ogg',
        'G4': 'G4.ogg',
        'G5': 'G5.ogg',
        'G#3': 'Gs3.ogg',
        'G#4': 'Gs4.ogg',
        'G#5': 'Gs5.ogg',
        'A4': 'A4.ogg',
        'A5': 'A5.ogg',
        'A#3': 'As3.ogg',
        'A#4': 'As4.ogg',
        'B3': 'B3.ogg',
        'B4': 'B4.ogg',
        'C4': 'C4.ogg',
        'C5': 'C5.ogg',
        'C#3': 'Cs3.ogg',
        'C#4': 'Cs4.ogg',
        'C#5': 'Cs5.ogg',
        'D3': 'D3.ogg',
        'D4': 'D4.ogg',
        'D5': 'D5.ogg',
        'D#3': 'Ds3.ogg',
        'D#4': 'Ds4.ogg'

    },

    'trombone': {
        'A#3': 'As3.ogg',
        'C3': 'C3.ogg',
        'C4': 'C4.ogg',
        'C#2': 'Cs2.ogg',
        'C#4': 'Cs4.ogg',
        'D3': 'D3.ogg',
        'D4': 'D4.ogg',
        'D#2': 'Ds2.ogg',
        'D#3': 'Ds3.ogg',
        'D#4': 'Ds4.ogg',
        'F2': 'F2.ogg',
        'F3': 'F3.ogg',
        'F4': 'F4.ogg',
        'G#2': 'Gs2.ogg',
        'G#3': 'Gs3.ogg',
        'A#1': 'As1.ogg',
        'A#2': 'As2.ogg'

    },

    'trumpet': {
        'C6': 'C6.ogg',
        'D5': 'D5.ogg',
        'D#4': 'Ds4.ogg',
        'F3': 'F3.ogg',
        'F4': 'F4.ogg',
        'F5': 'F5.ogg',
        'G4': 'G4.ogg',
        'A3': 'A3.ogg',
        'A5': 'A5.ogg',
        'A#4': 'As4.ogg',
        'C4': 'C4.ogg'

    },

    'tuba': {
        'A#2': 'As2.ogg',
        'A#3': 'As3.ogg',
        'D3': 'D3.ogg',
        'D4': 'D4.ogg',
        'D#2': 'Ds2.ogg',
        'F1': 'F1.ogg',
        'F2': 'F2.ogg',
        'F3': 'F3.ogg',
        'A#1': 'As1.ogg'

    },

    'violin': {
        'A3': 'A3.ogg',
        'A4': 'A4.ogg',
        'A5': 'A5.ogg',
        'A6': 'A6.ogg',
        'C4': 'C4.ogg',
        'C5': 'C5.ogg',
        'C6': 'C6.ogg',
        'C7': 'C7.ogg',
        'E4': 'E4.ogg',
        'E5': 'E5.ogg',
        'E6': 'E6.ogg',
        'G4': 'G4.ogg',
        'G5': 'G5.ogg',
        'G6': 'G6.ogg'

    },

    'xylophone': {
        'C8': 'C8.ogg',
        'G4': 'G4.ogg',
        'G5': 'G5.ogg',
        'G6': 'G6.ogg',
        'G7': 'G7.ogg',
        'C5': 'C5.ogg',
        'C6': 'C6.ogg',
        'C7': 'C7.ogg'

    },
    'bell': {
        'B4': 'B4.mp3'
    },
    'casio': {
        'A1': 'A1.ogg',
        'A2': 'A2.ogg',
        'A#1': 'As1.ogg',
        'B1': 'B1.ogg',
        'C2': 'C2.ogg',
        'C#2': 'Cs2.ogg',
        'D2': 'D2.ogg',
        'D#2': 'Ds2.ogg',
        'E2': 'E2.ogg',
        'F2': 'F2.ogg',
        'F#2': 'Fs2.ogg',
        'G2': 'G2.ogg',
        'G#1': 'Gs1.ogg'
    },
    'chord-tone': {
        'C1': 'C1.mp3',
        'C4': 'C4.mp3',
        'F#3': 'fs3.mp3'
    },
    'femalevoice-aa': {
        'A3': 'femalevoice_aa_A3.mp3',
        'A4': 'femalevoice_aa_A4.mp3',
        'A5': 'femalevoice_aa_A5.mp3',
        'C6': 'femalevoice_aa_C6.mp3',
        'Db4': 'femalevoice_aa_Db4.mp3',
        'Db5': 'femalevoice_aa_Db5.mp3',
        'Eb4': 'femalevoice_aa_Eb4.mp3',
        'F5': 'femalevoice_aa_F5.mp3'
    },
    'femalevoice-oo': {
        'A3': 'femalevoice_oo_A3.mp3',
        'A4': 'femalevoice_oo_A4.mp3',
        'A5': 'femalevoice_oo_A5.mp3',
        'C6': 'femalevoice_oo_C6.mp3',
        'Db4': 'femalevoice_oo_Db4.mp3',
        'Db5': 'femalevoice_oo_Db5.mp3'
    },
    'femalevoices-aa2': {
        'A3': 'femalevoices_aa2_A3.mp3',
        'A4': 'femalevoices_aa2_A4.mp3',
        'A5': 'femalevoices_aa2_A5.mp3',
        'C5': 'femalevoices_aa2_C5.mp3',
        'C6': 'femalevoices_aa2_C6.mp3',
        'C#4': 'femalevoices_aa2_Cs4.mp3',
        'F#5': 'femalevoices_aa2_Fs5.mp3'
    },
    'femalevoices-oo2': {
        'A3': 'femalevoices_oo2_A3.mp3',
        'A4': 'femalevoices_oo2_A4.mp3',
        'A5': 'femalevoices_oo2_A5.mp3',
        'C6': 'femalevoices_oo2_c6.mp3',
        'C#4': 'femalevoices_oo2_Cs4.mp3',
        'C#5': 'femalevoices_oo2_Cs5.mp3'
    },
    'malevoice-aa': {
        'A2': 'malevoice_aa_A2.mp3',
        'A3': 'malevoice_aa_A3.mp3',
        'Ab4': 'malevoice_aa_Ab4.mp3',
        'C3': 'malevoice_aa_C3.mp3',
        'C#4': 'malevoice_aa_Cs4.mp3',
        'F4': 'malevoice_aa_F4.mp3'
    },
    'malevoice-oo': {
        'A2': 'malevoice_oo_A2.mp3',
        'A3': 'malevoice_oo_A3.mp3',
        'A4': 'malevoice_oo_A4.mp3',
        'C3': 'malevoice_oo_C3.mp3',
        'D#4': 'malevoice_oo_Ds4.mp3',
        'F3': 'malevoice_oo_F3.mp3',
        'F4': 'malevoice_oo_F4.mp3',
        'G2': 'malevoice_oo_G2.mp3'
    },
    'malevoices-aa2': {
        'A2': 'malevoices_aa2_A2.mp3',
        'C3': 'malevoices_aa2_C3.mp3',
        'C#4': 'malevoices_aa2_Cs4.mp3',
        'F3': 'malevoices_aa2_F3.mp3',
        'F4': 'malevoices_aa2_F4.mp3'
    },
    'malevoices-oo2': {
        'A2': 'malevoices_oo2_A2.mp3',
        'A3': 'malevoices_oo2_A3.mp3',
        'A4': 'malevoices_oo2_A4.mp3',
        'C3': 'malevoices_oo2_C3.mp3',
        'C#4': 'malevoices_oo2_Cs4.mp3',
        'F3': 'malevoices_oo2_F3.mp3',
        'F4': 'malevoices_oo2_F4.mp3'
    },
    'music-box': {
        'D4': 'D4.mp3',
        'D5': 'D5.mp3'
    },
    'prepared-piano': {
        'C0': 'prep_piano_C0_2.mp3',
        'C1': 'prep_pianoC1_2.mp3',
        'C2': 'prep_pianoC2_2.mp3',
        'C4': 'prep_pianoC4.mp3',
        'C5': 'prep_pianoC5.mp3',
        'D#4': 'prep_pianoDs4.mp3',
        'E0': 'prep_pianoE0_2.mp3',
        'E1': 'prep_pianoE1.mp3',
        'E2': 'prep_pianoE2.mp3',
        'E4': 'prep_pianoE4.mp3',
        'F3': 'prep_pianoF3.mp3',
        'G#0': 'prep_pianoGs0.mp3',
        'G#1': 'prep_pianoGs1.mp3',
        'G#2': 'prep_pianoGs2.mp3',
        'G#3': 'prep_pianoGs3.mp3'
    },
    'small-bell': {
        'G4': 'G4.mp3'
    }


}
