class SettingsPage {
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
            buttonType: 'vowel',
            shuffleButtons: true
        };
        
        this.init();
    }
    
    async init() {
        await this.loadSettings();
        this.setupEventListeners();
        this.loadSettingsUI();
        
        console.log('Settings page initialized', this.settings);
    }
    
    setupEventListeners() {
        document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());
        
        ['time-limit', 'close-notes-range', 'octave-notes-range', 'pink-noise-volume', 'pink-noise-duration'].forEach(id => {
            const slider = document.getElementById(id);
            const valueSpan = document.getElementById(id + '-value');
            slider.addEventListener('input', (e) => {
                valueSpan.textContent = e.target.value;
            });
        });
    }
    
    loadSettingsUI() {
        document.getElementById('note-range-from').value = this.settings.noteRangeFrom;
        document.getElementById('note-range-to').value = this.settings.noteRangeTo;
        document.getElementById('time-limit').value = this.settings.timeLimit;
        document.getElementById('time-limit-value').textContent = this.settings.timeLimit;
        document.getElementById('avoid-close-notes').checked = this.settings.avoidCloseNotes;
        document.getElementById('close-notes-range').value = this.settings.closeNotesRange;
        document.getElementById('close-notes-range-value').textContent = this.settings.closeNotesRange;
        document.getElementById('avoid-octave-notes').checked = this.settings.avoidOctaveNotes;
        document.getElementById('octave-notes-range').value = this.settings.octaveNotesRange;
        document.getElementById('octave-notes-range-value').textContent = this.settings.octaveNotesRange;
        document.getElementById('play-correct-note').checked = this.settings.playCorrectNote;
        document.getElementById('enable-pink-noise').checked = this.settings.enablePinkNoise;
        document.getElementById('pink-noise-volume').value = this.settings.pinkNoiseVolume;
        document.getElementById('pink-noise-volume-value').textContent = this.settings.pinkNoiseVolume;
        document.getElementById('pink-noise-duration').value = this.settings.pinkNoiseDuration;
        document.getElementById('pink-noise-duration-value').textContent = this.settings.pinkNoiseDuration;
        document.getElementById('button-type').value = this.settings.buttonType;
        document.getElementById('shuffle-buttons').checked = this.settings.shuffleButtons;
    }
    
    saveSettings() {
        this.settings.noteRangeFrom = parseInt(document.getElementById('note-range-from').value);
        this.settings.noteRangeTo = parseInt(document.getElementById('note-range-to').value);
        this.settings.timeLimit = parseInt(document.getElementById('time-limit').value);
        this.settings.avoidCloseNotes = document.getElementById('avoid-close-notes').checked;
        this.settings.closeNotesRange = parseInt(document.getElementById('close-notes-range').value);
        this.settings.avoidOctaveNotes = document.getElementById('avoid-octave-notes').checked;
        this.settings.octaveNotesRange = parseInt(document.getElementById('octave-notes-range').value);
        this.settings.playCorrectNote = document.getElementById('play-correct-note').checked;
        this.settings.enablePinkNoise = document.getElementById('enable-pink-noise').checked;
        this.settings.pinkNoiseVolume = parseInt(document.getElementById('pink-noise-volume').value);
        this.settings.pinkNoiseDuration = parseFloat(document.getElementById('pink-noise-duration').value);
        this.settings.buttonType = document.getElementById('button-type').value;
        this.settings.shuffleButtons = document.getElementById('shuffle-buttons').checked;
        
        this.saveData();
        
        alert('設定を保存しました');
        console.log('Settings saved', this.settings);
    }
    
    async loadSettings() {
        try {
            const db = await this.openDB();
            const transaction = db.transaction(['settings'], 'readonly');
            const store = transaction.objectStore('settings');
            const request = store.get('current');
            
            request.onsuccess = () => {
                if (request.result) {
                    this.settings = { ...this.settings, ...request.result.data };
                    this.loadSettingsUI();
                }
            };
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }
    
    async saveData() {
        try {
            const db = await this.openDB();
            const transaction = db.transaction(['settings'], 'readwrite');
            const settingsStore = transaction.objectStore('settings');
            settingsStore.put({ id: 'current', data: this.settings });
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
    new SettingsPage();
});