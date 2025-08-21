class ScoresPage {
    constructor() {
        this.gameState = {
            score: { correct: 0, total: 0 },
            sessionStart: null,
            logs: []
        };
        this.noteNames = ['ド', 'ガ', 'レ', 'ポ', 'ミ', 'ファ', 'ウェ', 'ゾ', 'ビ', 'ナ', 'テ', 'シ'];
        
        this.init();
    }
    
    async init() {
        await this.loadGameData();
        this.setupEventListeners();
        this.updateScoresPage();
        
        console.log('Scores page initialized');
    }
    
    setupEventListeners() {
        document.getElementById('copy-log').addEventListener('click', () => this.copyLog());
    }
    
    updateScoresPage() {
        const details = document.getElementById('score-details');
        const logText = document.getElementById('text-log');
        
        const accuracy = this.gameState.score.total > 0 ? 
            (this.gameState.score.correct / this.gameState.score.total * 100).toFixed(1) : '0.0';
        
        const sessionDuration = this.gameState.sessionStart ? 
            ((Date.now() - this.gameState.sessionStart) / 1000).toFixed(1) : '0.0';
        
        details.innerHTML = `
            <div>最終セッション時間: ${sessionDuration}秒</div>
            <div>問題数: ${this.gameState.score.total}</div>
            <div>正答数: ${this.gameState.score.correct}</div>
            <div>正答率: ${accuracy}%</div>
            <div>ページ開開時刻: ${new Date().toLocaleString('ja-JP')}</div>
        `;
        
        const logEntries = this.gameState.logs.map(log => {
            const timestamp = new Date(log.timestamp).toISOString();
            const questionNote = this.noteNames[log.question % 12];
            const answerNote = log.answer !== null ? this.noteNames[log.answer] : 'TIMEOUT';
            const result = log.correct ? 'CORRECT' : 'WRONG';
            const responseTime = log.responseTime.toFixed(1);
            
            return `${timestamp} ${questionNote} ${answerNote} ${result} ${responseTime}s ${log.instrument}`;
        });
        
        logText.value = logEntries.join('\n');
    }
    
    copyLog() {
        const logText = document.getElementById('text-log');
        logText.select();
        document.execCommand('copy');
        
        const button = document.getElementById('copy-log');
        const originalText = button.textContent;
        button.textContent = 'コピーしました！';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    }
    
    async loadGameData() {
        try {
            const db = await this.openDB();
            
            // 最新のスコアデータを取得
            const transaction = db.transaction(['scores'], 'readonly');
            const store = transaction.objectStore('scores');
            const index = store.index('timestamp');
            const request = index.openCursor(null, 'prev');
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const data = cursor.value;
                    this.gameState.score = data.score;
                    this.gameState.logs = data.logs;
                    this.gameState.sessionStart = data.timestamp - data.sessionDuration;
                    this.updateScoresPage();
                }
            };
        } catch (error) {
            console.error('Failed to load game data:', error);
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
    new ScoresPage();
});