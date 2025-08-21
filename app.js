//@ts-check

class AbsolutePitchTrainer {
    constructor() {
        this.settings = {
            noteRangeFrom: 48,
            noteRangeTo: 72,
            timeLimit: 10,
            avoidCloseNotes: true,
            closeNotesRange: 6,
            avoidOctaveNotes: true,
            octaveNotesRange: 3,
            playCorrectNote: true,
            enablePinkNoise: true,
            pinkNoiseVolume: 30,
            pinkNoiseDuration: 2,
            buttonType: 'normal',
            shuffleButtons: true
        };
        
        this.gameState = {
            isPlaying: false,
            currentNote: null,
            lastNote: null,
            score: { correct: 0, total: 0 },
            sessionStart: null,
            logs: []
        };
        
        this.instruments = [];
        this.pinkNoise = null;
        this.currentInstrument = null;
        this.timer = null;
        this.timeRemaining = 0;
        
        this.noteNames = ['ド', 'ガ', 'レ', 'ポ', 'ミ', 'ファ', 'ウェ', 'ゾ', 'ビ', 'ナ', 'テ', 'シ'];
        this.vowelMap = { 'ド': 'お', 'ガ': 'あ', 'レ': 'え', 'ポ': 'お', 'ミ': 'い', 'ファ': 'あ', 'ウェ': 'え', 'ゾ': 'お', 'ビ': 'い', 'ナ': 'あ', 'テ': 'え', 'シ': 'い' };
        
        this.init();
    }
    
    async init() {
        await this.registerServiceWorker();
        await this.initTone();
        this.setupEventListeners();
        this.setupVisibilityChange();
        // 設定を読み込んでからボタンを描画
        await this.loadSettings();
        this.updateUI();
        
        console.log('Absolute Pitch Trainer initialized', {
            settings: this.settings,
            instrumentsLoaded: this.instruments.length
        });
    }
    
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('./sw.js');
                console.log('Service Worker registered');
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }
    
    async initTone() {
        try {
            this.pinkNoise = new Tone.Noise('pink').toDestination();
            this.pinkNoise.volume.value = -20;
            
            console.log('=== Tone.js初期化開始 ===');
            console.log('SampleLibrary available:', typeof SampleLibrary !== 'undefined');
            
            // Tonejs-Instruments.jsのSampleLibraryを使用して全楽器を読み込み
            if (typeof SampleLibrary !== 'undefined') {
                console.log('Loading all instruments from SampleLibrary...');
                console.log('Available instruments:', SampleLibrary.list);
                
                // 全楽器を一括読み込み（SampleLibrary.listにある全楽器）
                const samplers = SampleLibrary.load({
                    instruments: SampleLibrary.list,
                    baseUrl: "./samples/",
                    onload: () => {
                        console.log('All samples loaded successfully');
                    }
                });
                
                // 各楽器をインスタンスリストに追加
                SampleLibrary.list.forEach(name => {
                    if (samplers[name]) {
                        samplers[name].toDestination();
                        this.instruments.push({ name, sampler: samplers[name] });
                        console.log(`Loaded instrument: ${name}`);
                    } else {
                        console.warn(`Failed to load instrument: ${name}`);
                    }
                });
            }
            
            // 正弦波も追加（concept.txtに明記）
            this.instruments.push({ 
                name: 'sine', 
                sampler: { 
                    triggerAttackRelease: (note, duration) => {
                        const osc = new Tone.Oscillator({
                            frequency: Tone.Frequency(note).toFrequency(),
                            type: 'sine'
                        }).toDestination();
                        osc.start();
                        osc.stop(Tone.now() + Tone.Time(duration).toSeconds());
                    }
                }
            });
            console.log('Added sine wave oscillator');
            
            console.log(`Total instruments loaded: ${this.instruments.length}`);
            console.log('Instrument names:', this.instruments.map(i => i.name));
            
        } catch (error) {
            console.error('Failed to initialize Tone.js:', error);
        }
    }
    
    
    setupEventListeners() {
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        document.getElementById('back-to-title').addEventListener('click', () => this.backToTitle());
    }
    
    setupVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.gameState.isPlaying) {
                this.backToTitle();
                this.saveData();
            } else if (!document.hidden) {
                // ページが表示された時に設定を再読み込み
                this.loadSettings();
            }
        });
        
        // ページフォーカス時にも設定を再読み込み
        window.addEventListener('focus', () => {
            this.loadSettings();
        });
    }
    
    async startGame() {
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }
        
        this.gameState.isPlaying = true;
        this.gameState.sessionStart = Date.now();
        this.gameState.score = { correct: 0, total: 0 };
        this.gameState.logs = [];
        
        this.nextQuestion();
        
        console.log('Game started', {
            sessionStart: this.gameState.sessionStart,
            settings: this.settings
        });
    }
    
    nextQuestion() {
        if (!this.gameState.isPlaying) return;
        
        this.stopAllAudio();
        this.clearTimer();
        this.resetButtonStates();
        
        this.currentInstrument = this.getRandomInstrument();
        this.gameState.currentNote = this.generateNote();
        
        this.playNote(this.gameState.currentNote);
        this.startTimer();
        this.updateUI();
        
        console.log('Next question', {
            note: this.gameState.currentNote,
            instrument: this.currentInstrument.name,
            timeLimit: this.settings.timeLimit
        });
    }
    
    generateNote() {
        // console.log('=== generateNote ===');
        // console.log('Note range from:', this.settings.noteRangeFrom, 'MIDI note');
        // console.log('Note range to:', this.settings.noteRangeTo, 'MIDI note');
        // console.log('Note range from note name:', Tone.Frequency(this.settings.noteRangeFrom, 'midi').toNote());
        // console.log('Note range to note name:', Tone.Frequency(this.settings.noteRangeTo, 'midi').toNote());
        // console.log('Avoid close notes:', this.settings.avoidCloseNotes);
        // console.log('Avoid octave notes:', this.settings.avoidOctaveNotes);
        // console.log('Last note:', this.gameState.lastNote);
        
        const availableNotes = [];
        
        for (let note = this.settings.noteRangeFrom; note <= this.settings.noteRangeTo; note++) {
            if (this.isNoteAvailable(note)) {
                availableNotes.push(note);
            }
        }
        
        // console.log('Total notes in range:', this.settings.noteRangeTo - this.settings.noteRangeFrom + 1);
        // console.log('Available notes after filtering:', availableNotes.length);
        // console.log('Available MIDI notes:', availableNotes);
        // console.log('Available note names:', availableNotes.map(n => Tone.Frequency(n, 'midi').toNote()));
        
        if (availableNotes.length === 0) {
            const randomNote = Math.floor(Math.random() * (this.settings.noteRangeTo - this.settings.noteRangeFrom + 1)) + this.settings.noteRangeFrom;
            // console.log('No available notes, using random:', randomNote, Tone.Frequency(randomNote, 'midi').toNote());
            return randomNote;
        }
        
        const selectedNote = availableNotes[Math.floor(Math.random() * availableNotes.length)];
        // console.log('Selected MIDI note:', selectedNote);
        // console.log('Selected note name:', Tone.Frequency(selectedNote, 'midi').toNote());
        return selectedNote;
    }
    
    isNoteAvailable(note) {
        if (!this.gameState.lastNote) {
            console.log(`Note ${note} is available (no last note)`);
            return true;
        }
        
        const lastNote = this.gameState.lastNote;
        // console.log(`Checking note ${note} against last note ${lastNote}`);
        
        if (this.settings.avoidCloseNotes) {
            const distance = Math.abs(note - lastNote);
            // console.log(`Close notes check: distance=${distance}, range=${this.settings.closeNotesRange}`);
            if (distance <= this.settings.closeNotesRange) {
                // console.log(`Note ${note} rejected: too close to last note`);
                return false;
            }
        }
        
        if (this.settings.avoidOctaveNotes) {
            const noteClass = note % 12;
            const lastNoteClass = lastNote % 12;
            const distance = Math.min(Math.abs(noteClass - lastNoteClass), 12 - Math.abs(noteClass - lastNoteClass));
            // console.log(`Octave notes check: noteClass=${noteClass}, lastNoteClass=${lastNoteClass}, distance=${distance}, range=${this.settings.octaveNotesRange}`);
            if (distance <= this.settings.octaveNotesRange) {
                // console.log(`Note ${note} rejected: same pitch class within range`);
                return false;
            }
        }
        
        // console.log(`Note ${note} is available`);
        return true;
    }
    
    getRandomInstrument() {
        if (Math.random() < 0.2) {
            return { name: 'sine', sampler: new Tone.Oscillator().toDestination() };
        }
        
        if (this.instruments.length === 0) {
            return { name: 'sine', sampler: new Tone.Oscillator().toDestination() };
        }
        
        return this.instruments[Math.floor(Math.random() * this.instruments.length)];
    }
    
    handleVowelAnswer(button) {
        let selectedNote;
        
        if (this.settings.buttonType === 'vowel') {
            // 母音ボタンの場合、現在の問題音に対応する母音かチェック
            const vowelNotes = JSON.parse(button.dataset.vowelNotes || '[]');
            const currentNoteIndex = this.gameState.currentNote % 12;
            
            console.log('Vowel button pressed:', button.textContent);
            console.log('Vowel covers notes:', vowelNotes);
            console.log('Current note index:', currentNoteIndex);
            
            // 母音にマッピングされた音名の中に現在の音が含まれているかチェック
            if (vowelNotes.includes(currentNoteIndex)) {
                selectedNote = currentNoteIndex; // 正解
            } else {
                selectedNote = vowelNotes[0]; // 不正解（最初の音名を選択音として設定）
            }
        } else {
            selectedNote = parseInt(button.dataset.note);
        }
        
        this.handleAnswer(selectedNote);
    }
    
    playNote(midiNote) {
        try {
            console.log(midiNote)
            const noteName = Tone.Frequency(midiNote, 'midi').toNote();
            console.log(noteName)
            
            console.log(`Playing note ${noteName} on ${this.currentInstrument.name}`);
            
            if (this.currentInstrument.name === "sine") {
                const osc = new Tone.Oscillator(Tone.Frequency(midiNote, 'midi').toFrequency()).toDestination();
                osc.start();
                osc.stop(Tone.now() + 1);
            } else {
                this.currentInstrument.sampler.triggerAttackRelease(noteName, '1n');
            }
            console.log(`Played ${this.currentInstrument.name} with note ${noteName}`);
            
        } catch (error) {
            console.error('Failed to play note:', error);
            // フォールバック: 基本的な正弦波
            const osc = new Tone.Oscillator(Tone.Frequency(midiNote, 'midi').toFrequency()).toDestination();
            osc.start();
            osc.stop(Tone.now() + 1);
        }
    }
    
    startTimer() {
        this.timeRemaining = this.settings.timeLimit;
        this.updateTimer();
        
        console.log('=== startTimer ===');
        console.log('Time limit setting:', this.settings.timeLimit);
        console.log('Time remaining:', this.timeRemaining);
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimer();
            
            if (this.timeRemaining <= 0) {
                this.handleTimeout();
            }
        }, 1000);
    }
    
    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    handleTimeout() {
        this.clearTimer();
        this.handleAnswer(null, true);
    }
    
    handleAnswer(selectedNote, isTimeout = false) {
        if (!this.gameState.isPlaying) return;
        
        const correct = selectedNote === this.gameState.currentNote % 12;
        const responseTime = this.settings.timeLimit - this.timeRemaining;
        
        this.gameState.score.total++;
        if (correct) {
            this.gameState.score.correct++;
        }
        
        this.logAnswer(selectedNote, correct, responseTime, isTimeout);
        this.showAnswerFeedback(selectedNote, correct);
        
        if (this.settings.playCorrectNote) {
            setTimeout(() => {
                this.playNote(this.gameState.currentNote);
            }, 500);
        }
        
        setTimeout(() => {
            this.playPinkNoise();
            this.gameState.lastNote = this.gameState.currentNote;
            
            setTimeout(() => {
                this.nextQuestion();
            }, this.settings.enablePinkNoise ? this.settings.pinkNoiseDuration * 1000 : 1000);
        }, 1000);
        
        console.log('Answer handled', {
            selected: selectedNote,
            correct: this.gameState.currentNote % 12,
            isCorrect: correct,
            responseTime,
            isTimeout
        });
    }
    
    logAnswer(selectedNote, correct, responseTime, isTimeout) {
        const log = {
            timestamp: Date.now(),
            question: this.gameState.currentNote,
            answer: selectedNote,
            correct,
            responseTime,
            isTimeout,
            instrument: this.currentInstrument.name
        };
        
        this.gameState.logs.push(log);
    }
    
    showAnswerFeedback(selectedNote, correct) {
        const buttons = document.querySelectorAll('.answer-button');
        const correctNote = this.gameState.currentNote % 12;
        if (this.settings.buttonType === "vowel") {
            buttons.forEach(button => {
                const noteValue = JSON.parse(button.dataset.vowelNotes);
                button.classList.remove('selected');
                
                if (noteValue.includes(correctNote)) {
                    button.classList.add('correct');
                } else if (noteValue.includes(selectedNote) && !correct) {
                    button.classList.add('wrong');
                }
            });
        } else {
            buttons.forEach(button => {
                const noteValue = parseInt(button.dataset.note);
                button.classList.remove('selected');
                
                if (noteValue === correctNote) {
                    button.classList.add('correct');
                } else if (noteValue === selectedNote && !correct) {
                    button.classList.add('wrong');
                }
            });
        }
        
        document.getElementById('correct-note').textContent = this.noteNames[correctNote];
        
        setTimeout(() => {
            this.resetButtonStates();
        }, 2000);
    }
    
    resetButtonStates() {
        document.querySelectorAll('.answer-button').forEach(button => {
            button.classList.remove('selected', 'correct', 'wrong');
        });
        document.getElementById('correct-note').textContent = '--';
    }
    
    playPinkNoise() {
        console.log('=== playPinkNoise ===');
        console.log('Enable pink noise:', this.settings.enablePinkNoise);
        console.log('Pink noise duration:', this.settings.pinkNoiseDuration);
        console.log('Pink noise volume:', this.settings.pinkNoiseVolume);
        
        if (!this.settings.enablePinkNoise || this.settings.pinkNoiseDuration === 0) {
            console.log('Pink noise skipped');
            return;
        }
        
        try {
            const volume = -40 + (this.settings.pinkNoiseVolume / 100) * 20;
            console.log('Calculated volume:', volume);
            this.pinkNoise.volume.value = volume;
            this.pinkNoise.start();
            this.pinkNoise.stop(Tone.now() + this.settings.pinkNoiseDuration);
            console.log('Pink noise played');
        } catch (error) {
            console.error('Failed to play pink noise:', error);
        }
    }
    
    stopAllAudio() {
        try {
            Tone.Transport.cancel();
            if (this.pinkNoise && this.pinkNoise.state === 'started') {
                this.pinkNoise.stop();
            }
        } catch (error) {
            console.error('Failed to stop audio:', error);
        }
    }
    
    renderAnswerButtons() {
        const container = document.getElementById('answer-buttons');
        container.innerHTML = '';
        
        console.log('=== renderAnswerButtons ===');
        console.log('Current buttonType setting:', this.settings.buttonType);
        console.log('Current shuffleButtons setting:', this.settings.shuffleButtons);
        console.log('All current settings:', this.settings);
        
        let buttons = [];
        
        if (this.settings.buttonType === 'vowel') {
            buttons = ['あ', 'い', 'え', 'お'];
            console.log('Using vowel buttons:', buttons);
        } else {
            buttons = [...this.noteNames];
            console.log('Using note name buttons:', buttons);
        }
        
        if (this.settings.shuffleButtons && this.settings.buttonType !== 'vowel') {
            buttons = this.shuffleArray([...buttons]);
            console.log('Buttons shuffled:', buttons);
        }
        
        buttons.forEach((label, index) => {
            const button = document.createElement('button');
            button.className = 'answer-button';
            button.textContent = label;
            
            let noteValues;
            if (this.settings.buttonType === 'vowel') {
                // 母音にマッピングされる全ての音名のインデックスを取得
                noteValues = Object.keys(this.vowelMap)
                    .filter(key => this.vowelMap[key] === label)
                    .map(noteName => this.noteNames.indexOf(noteName));
                // データ属性には最初の音名を設定（表示用）
                button.dataset.note = noteValues[0];
                // 実際の判定用に全ての音名インデックスを保存
                button.dataset.vowelNotes = JSON.stringify(noteValues);
            } else {
                noteValues = [this.noteNames.indexOf(label)];
                button.dataset.note = noteValues[0];
            }
            
            console.log(`Button "${label}" maps to note values:`, noteValues);
            
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.gameState.isPlaying) {
                    button.classList.add('selected');
                    this.handleVowelAnswer(button);
                }
            });
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.gameState.isPlaying) {
                    button.classList.add('selected');
                    this.handleVowelAnswer(button);
                }
            });
            
            container.appendChild(button);
        });
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    backToTitle() {
        this.gameState.isPlaying = false;
        this.stopAllAudio();
        this.clearTimer();
        this.resetButtonStates();
        this.saveData();
        this.updateUI();
        
        console.log('Back to title', {
            sessionEnd: Date.now(),
            finalScore: this.gameState.score
        });
    }
    
    updateTimer() {
        document.getElementById('countdown').textContent = this.timeRemaining;
    }
    
    updateUI() {
        const accuracy = this.gameState.score.total > 0 ? 
            Math.round((this.gameState.score.correct / this.gameState.score.total) * 100) : 0;
        
        document.getElementById('accuracy').textContent = `${accuracy}%`;
        
        if (!this.gameState.isPlaying) {
            document.getElementById('countdown').textContent = '--';
            document.getElementById('correct-note').textContent = '--';
        }
    }
    
    
    
    
    
    
    async loadSettings() {
        try {
            const db = await this.openDB();
            const transaction = db.transaction(['settings'], 'readonly');
            const store = transaction.objectStore('settings');
            const request = store.get('current');
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    if (request.result) {
                        this.settings = { ...this.settings, ...request.result.data };
                        console.log('Settings loaded in app.js:', this.settings);
                        // 設定読み込み後にボタンを再描画
                        this.renderAnswerButtons();
                    } else {
                        console.log('No saved settings found, using defaults');
                        this.renderAnswerButtons();
                    }
                    resolve();
                };
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Failed to load settings:', error);
            this.renderAnswerButtons(); // エラー時もボタンは描画
        }
    }
    
    async saveData() {
        try {
            const db = await this.openDB();
            const transaction = db.transaction(['settings', 'scores'], 'readwrite');
            
            const settingsStore = transaction.objectStore('settings');
            settingsStore.put({ id: 'current', data: this.settings });
            
            const scoresStore = transaction.objectStore('scores');
            const scoreData = {
                id: Date.now(),
                timestamp: Date.now(),
                score: this.gameState.score,
                logs: this.gameState.logs,
                sessionDuration: this.gameState.sessionStart ? Date.now() - this.gameState.sessionStart : 0
            };
            scoresStore.add(scoreData);
        } catch (error) {
            console.error('Failed to save data:', error);
        }
    }
    
    openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('AbsolutePitchTrainer', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'id' });
                }
                
                if (!db.objectStoreNames.contains('scores')) {
                    const scoresStore = db.createObjectStore('scores', { keyPath: 'id' });
                    scoresStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.trainer = new AbsolutePitchTrainer();
});