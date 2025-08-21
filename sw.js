const CACHE_NAME = 'tonejs-samples-v1';
const SAMPLE_BASE_URL = '/samples/';

// すべてのサンプルファイルのURLを生成
function generateSampleUrls() {
    const urls = [];
    
    // 楽器とそのサンプルファイルのマッピング
    const instrumentSamples = {
        'bass-electric': ['As1', 'As2', 'As3', 'As4', 'Cs1', 'Cs2', 'Cs3', 'Cs4', 'E1', 'E2', 'E3', 'E4', 'G1', 'G2', 'G3', 'G4'],
        'bassoon': ['A4', 'C3', 'C4', 'C5', 'E4', 'G2', 'G3', 'G4', 'A2', 'A3'],
        'cello': ['E3', 'E4', 'F2', 'F3', 'F4', 'Fs3', 'Fs4', 'G2', 'G3', 'G4', 'Gs2', 'Gs3', 'Gs4', 'A2', 'A3', 'A4', 'As2', 'As3', 'B2', 'B3', 'B4', 'C2', 'C3', 'C4', 'C5', 'Cs3', 'Cs4', 'D2', 'D3', 'D4', 'Ds2', 'Ds3', 'Ds4', 'E2'],
        'clarinet': ['D4', 'D5', 'D6', 'F3', 'F4', 'F5', 'Fs6', 'As3', 'As4', 'As5', 'D3'],
        'contrabass': ['C2', 'Cs3', 'D2', 'E2', 'E3', 'Fs1', 'Fs2', 'G1', 'Gs2', 'Gs3', 'A2', 'As1', 'B3'],
        'flute': ['A6', 'C4', 'C5', 'C6', 'C7', 'E4', 'E5', 'E6', 'A4', 'A5'],
        'french-horn': ['D3', 'D5', 'Ds2', 'F3', 'F5', 'G2', 'A1', 'A3', 'C2', 'C4'],
        'guitar-acoustic': ['F4', 'Fs2', 'Fs3', 'Fs4', 'G2', 'G3', 'G4', 'Gs2', 'Gs3', 'Gs4', 'A2', 'A3', 'A4', 'As2', 'As3', 'As4', 'B2', 'B3', 'B4', 'C3', 'C4', 'C5', 'Cs3', 'Cs4', 'Cs5', 'D2', 'D3', 'D4', 'D5', 'Ds2', 'Ds3', 'Ds3', 'E2', 'E3', 'E4', 'F2', 'F3'],
        'guitar-electric': ['Ds3', 'Ds4', 'Ds5', 'E2', 'Fs2', 'Fs3', 'Fs4', 'Fs5', 'A2', 'A3', 'A4', 'A5', 'C3', 'C4', 'C5', 'C6', 'Cs2'],
        'guitar-nylon': ['Fs2', 'Fs3', 'Fs4', 'Fs5', 'G3', 'G3', 'Gs2', 'Gs4', 'Gs5', 'A2', 'A3', 'A4', 'A5', 'As5', 'B1', 'B2', 'B3', 'B4', 'Cs3', 'Cs4', 'Cs5', 'D2', 'D3', 'D5', 'Ds4', 'E2', 'E3', 'E4', 'E5'],
        'harmonium': ['C2', 'C3', 'C4', 'C5', 'Cs2', 'Cs3', 'Cs4', 'Cs5', 'D2', 'D3', 'D4', 'D5', 'Ds2', 'Ds3', 'Ds4', 'E2', 'E3', 'E4', 'F2', 'F3', 'F4', 'Fs2', 'Fs3', 'G2', 'G3', 'G4', 'Gs2', 'Gs3', 'Gs4', 'A2', 'A3', 'A4', 'As2', 'As3', 'As4'],
        'harp': ['C5', 'D2', 'D4', 'D6', 'D7', 'E1', 'E3', 'E5', 'F2', 'F4', 'F6', 'F7', 'G1', 'G3', 'G5', 'A2', 'A4', 'A6', 'B1', 'B3', 'B5', 'B6', 'C3'],
        'organ': ['C3', 'C4', 'C5', 'C6', 'Ds1', 'Ds2', 'Ds3', 'Ds4', 'Ds5', 'Fs1', 'Fs2', 'Fs3', 'Fs4', 'Fs5', 'A1', 'A2', 'A3', 'A4', 'A5', 'C1', 'C2'],
        'piano': ['A7', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'As7', 'As1', 'As2', 'As3', 'As4', 'As5', 'As6', 'B7', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'C7', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'Cs7', 'Cs1', 'Cs2', 'Cs3', 'Cs4', 'Cs5', 'Cs6', 'D7', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'Ds7', 'Ds1', 'Ds2', 'Ds3', 'Ds4', 'Ds5', 'Ds6', 'E7', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'F7', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'Fs7', 'Fs1', 'Fs2', 'Fs3', 'Fs4', 'Fs5', 'Fs6', 'G7', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'Gs7', 'Gs1', 'Gs2', 'Gs3', 'Gs4', 'Gs5', 'Gs6'],
        'saxophone': ['Ds5', 'E3', 'E4', 'E5', 'F3', 'F4', 'F5', 'Fs3', 'Fs4', 'Fs5', 'G3', 'G4', 'G5', 'Gs3', 'Gs4', 'Gs5', 'A4', 'A5', 'As3', 'As4', 'B3', 'B4', 'C4', 'C5', 'Cs3', 'Cs4', 'Cs5', 'D3', 'D4', 'D5', 'Ds3', 'Ds4'],
        'trombone': ['As3', 'C3', 'C4', 'Cs2', 'Cs4', 'D3', 'D4', 'Ds2', 'Ds3', 'Ds4', 'F2', 'F3', 'F4', 'Gs2', 'Gs3', 'As1', 'As2'],
        'trumpet': ['C6', 'D5', 'Ds4', 'F3', 'F4', 'F5', 'G4', 'A3', 'A5', 'As4', 'C4'],
        'tuba': ['As2', 'As3', 'D3', 'D4', 'Ds2', 'F1', 'F2', 'F3', 'As1'],
        'violin': ['A3', 'A4', 'A5', 'A6', 'C4', 'C5', 'C6', 'C7', 'E4', 'E5', 'E6', 'G4', 'G5', 'G6'],
        'xylophone': ['C8', 'G4', 'G5', 'G6', 'G7', 'C5', 'C6', 'C7'],
        'bell': ['B4'],
        'casio': ['A1', 'A2', 'As1', 'B1', 'C2', 'Cs2', 'D2', 'Ds2', 'E2', 'F2', 'Fs2', 'G2', 'Gs1'],
        'chord-tone': ['C1', 'C4', 'fs3'],
        'femalevoice-aa': ['femalevoice_aa_A3', 'femalevoice_aa_A4', 'femalevoice_aa_A5', 'femalevoice_aa_C6', 'femalevoice_aa_Db4', 'femalevoice_aa_Db5', 'femalevoice_aa_Eb4', 'femalevoice_aa_F5'],
        'femalevoice-oo': ['femalevoice_oo_A3', 'femalevoice_oo_A4', 'femalevoice_oo_A5', 'femalevoice_oo_C6', 'femalevoice_oo_Db4', 'femalevoice_oo_Db5'],
        'femalevoices-aa2': ['femalevoices_aa2_A3', 'femalevoices_aa2_A4', 'femalevoices_aa2_A5', 'femalevoices_aa2_C5', 'femalevoices_aa2_C6', 'femalevoices_aa2_Cs4', 'femalevoices_aa2_Fs5'],
        'femalevoices-oo2': ['femalevoices_oo2_A3', 'femalevoices_oo2_A4', 'femalevoices_oo2_A5', 'femalevoices_oo2_c6', 'femalevoices_oo2_Cs4', 'femalevoices_oo2_Cs5'],
        'malevoice-aa': ['malevoice_aa_A2', 'malevoice_aa_A3', 'malevoice_aa_Ab4', 'malevoice_aa_C3', 'malevoice_aa_Cs4', 'malevoice_aa_F4'],
        'malevoice-oo': ['malevoice_oo_A2', 'malevoice_oo_A3', 'malevoice_oo_A4', 'malevoice_oo_C3', 'malevoice_oo_Ds4', 'malevoice_oo_F3', 'malevoice_oo_F4', 'malevoice_oo_G2'],
        'malevoices-aa2': ['malevoices_aa2_A2', 'malevoices_aa2_C3', 'malevoices_aa2_Cs4', 'malevoices_aa2_F3', 'malevoices_aa2_F4'],
        'malevoices-oo2': ['malevoices_oo2_A2', 'malevoices_oo2_A3', 'malevoices_oo2_A4', 'malevoices_oo2_C3', 'malevoices_oo2_Cs4', 'malevoices_oo2_F3', 'malevoices_oo2_F4'],
        'music-box': ['D4', 'D5'],
        'prepared-piano': ['prep_piano_C0_2', 'prep_pianoC1_2', 'prep_pianoC2_2', 'prep_pianoC4', 'prep_pianoC5', 'prep_pianoDs4', 'prep_pianoE0_2', 'prep_pianoE1', 'prep_pianoE2', 'prep_pianoE4', 'prep_pianoF3', 'prep_pianoGs0', 'prep_pianoGs1', 'prep_pianoGs2', 'prep_pianoGs3'],
        'small-bell': ['G4']
    };
    
    // 各楽器のサンプルファイルを追加
    Object.entries(instrumentSamples).forEach(([instrument, samples]) => {
        samples.forEach(filename => {
            // 標準的な楽器の場合は.[mp3|ogg]形式、特殊な楽器は.mp3のみ
            if (['bell', 'chord-tone', 'femalevoice-aa', 'femalevoice-oo', 'femalevoices-aa2', 'femalevoices-oo2', 'malevoice-aa', 'malevoice-oo', 'malevoices-aa2', 'malevoices-oo2', 'music-box', 'prepared-piano', 'small-bell'].includes(instrument)) {
                urls.push(SAMPLE_BASE_URL + instrument + '/' + filename + '.mp3');
            } else {
                urls.push(SAMPLE_BASE_URL + instrument + '/' + filename + '.mp3');
                urls.push(SAMPLE_BASE_URL + instrument + '/' + filename + '.ogg');
            }
        });
    });
    
    return urls;
}

// Service Workerのインストール時にサンプルファイルをキャッシュ
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: キャッシュを開きました');
                const sampleUrls = generateSampleUrls();
                // 基本的なファイルをキャッシュ（存在するファイルのみ）
                return cache.addAll([
                    './',
                    './index.html',
                    './settings.html', 
                    './scores.html',
                    './styles.css',
                    './app.js',
                    './settings.js',
                    './scores.js',
                    './Tonejs-Instruments.js'
                ]).then(() => {
                    // サンプルファイルを個別にキャッシュ（エラーを無視）
                    return Promise.allSettled(
                        sampleUrls.map(url => 
                            cache.add(url).catch(err => {
                                console.warn('サンプルファイルのキャッシュに失敗:', url, err);
                            })
                        )
                    );
                });
            })
    );
    self.skipWaiting();
});

// Service Workerのアクティベート時に古いキャッシュを削除
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: 古いキャッシュを削除:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// ネットワークリクエストをインターセプト
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // キャッシュにある場合はキャッシュから返す
                if (response) {
                    return response;
                }
                
                // キャッシュにない場合はネットワークから取得
                return fetch(event.request)
                    .then(response => {
                        // レスポンスが有効でない場合はそのまま返す
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // サンプルファイルの場合はキャッシュに保存
                        if (event.request.url.includes('/samples/')) {
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        
                        return response;
                    })
                    .catch(() => {
                        // ネットワークエラーの場合、オフライン用のレスポンスを返す
                        if (event.request.url.includes('/samples/')) {
                            return new Response('', { status: 404 });
                        }
                    });
            })
    );
});
