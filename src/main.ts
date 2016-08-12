import HistoryStorage from './history-storage.ts';

function isSpeechSupport(window: Window): boolean {
  return window['speechSynthesis'] != null && window['SpeechSynthesisUtterance'] != null;
}

function getVoices(speechSynthesis: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> {
  return (new Promise(resolve => {
    speechSynthesis.onvoiceschanged = resolve;
  })).then(() => speechSynthesis.getVoices().map((voice) => {
    return { lang: voice.lang, name: voice.name }
  }));
}

function makeVoiceOption(voice: SpeechSynthesisVoice, document: Document): HTMLOptionElement {
  const option = document.createElement('option');
  option.dataset['lang'] = voice.lang;
  option.dataset['name'] = voice.name;
  if (voice.default) {
    option.selected = true;
  }
  option.textContent = voice.name;
  return option;
}

function getVolume(volumeDOM: HTMLInputElement): number {
  const volume = parseInt(volumeDOM.value, 10);
  if (volume == null) {
    return 1;
  }
  return volume / 100;
}

var utteranceIndex: number = 0;
function saveUtterance(utterance: SpeechSynthesisUtterance): number {
  utteranceIndex += 1;
  window['utterances'].set(utteranceIndex, utterance);
  return utteranceIndex;
}
function removeUtterance(index: number): void {
  window['utterances'].delete(index);
}

function speakIt(text: string, voiceName: string, speechSynthesis: SpeechSynthesis, volume: number, historyStorage: HistoryStorage): Promise<{}> {
  return new Promise((resolve, reject) => {
    if (text === '') {
      reject(new Error('no text'));
    }

    const utterance = new SpeechSynthesisUtterance(text)
    const utteranceIndex = saveUtterance(utterance);
    const voice: SpeechSynthesisVoice = speechSynthesis.getVoices().find(voice => voice.name === voiceName);
    utterance.voice = voice;
    utterance.lang = voice.lang as string;
    utterance.volume = volume;
    historyStorage.add(text);
    speechSynthesis.speak(utterance);

    utterance.onend = () => {
      resolve();
      removeUtterance(utteranceIndex);
    };
    utterance.onerror = (e) => {
      reject(e);
      removeUtterance(utteranceIndex);
    };
  });
}

function enable(tag: { disabled: boolean, classList: DOMTokenList }): void {
  tag.disabled = false;
  tag.classList.remove('disabled');
};

function disable(tag: { disabled: boolean, classList: DOMTokenList }): void {
  tag.disabled = true;
  tag.classList.add('disabled');
};

function setHistoryList(target: HTMLDivElement, voiceOptions: HTMLSelectElement, volumeInput: HTMLInputElement, historyDOM: HTMLDivElement, historyStorage: HistoryStorage, doms: HTMLElement[], window: Window): void {
  var child = target.firstChild;
  for (; child != null; child = target.firstChild) {
    target.removeChild(child);
  }

  const history = historyStorage.get();
  history.map(message => {
    const item = getHistoryItem(message, voiceOptions, volumeInput, historyDOM, historyStorage, doms, window);
    target.appendChild(item);
  });
}

function getHistoryItem(text: string, voiceOptions: HTMLSelectElement, volumeInput: HTMLInputElement, historyDOM: HTMLDivElement, historyStorage: HistoryStorage, doms: HTMLElement[], window: Window): HTMLButtonElement {
  const button = window.document.createElement('button');
  button.className = 'list-group-item';
  button.textContent = text;
  button.onclick = (e) => {
    e.preventDefault();
    speak(text, voiceOptions, volumeInput, historyDOM, historyStorage, doms, window);
  };
  return button;
}

function speak(text: string, voiceOptions: HTMLSelectElement, volumeInput: HTMLInputElement, historyDOM: HTMLDivElement, historyStorage: HistoryStorage, doms: any[], window: Window): void {
  const voice = voiceOptions.value;
  const volume = getVolume(volumeInput);

  doms.map(disable);
  const speak = speakIt(text, voice, window.speechSynthesis, volume, historyStorage);
  speak.catch(e => {
    console.log(e);
  }).then(() => {
    doms.map(enable);
    setHistoryList(historyDOM, voiceOptions, volumeInput, historyDOM, historyStorage, doms, window);
  });
}

document.body.onload = () => {
  if (!isSpeechSupport(window)) {
    return;
  }

  const notSupported = document.getElementById('not_supported') as HTMLDivElement;
  notSupported.classList.add('hide');
  const supported = document.getElementById('supported') as HTMLDivElement;
  supported.classList.remove('hide');

  const voiceOptions = document.getElementById('voice_options') as HTMLSelectElement;

  const voices = getVoices(window.speechSynthesis);
  voices.then(voices =>
    voices.map(voice => makeVoiceOption(voice, document))
    .forEach(option => voiceOptions.appendChild(option))
  );

  const speakItForm = document.getElementById('speak-it-form') as HTMLFormElement;
  const speakItInput = document.getElementById('speak-it-input') as HTMLInputElement;
  const speakItSubmit = document.getElementById('speak-it-submit') as HTMLButtonElement;
  const volumeInput = document.getElementById('volume') as HTMLInputElement;

  const historyStorage = new HistoryStorage([ window.localStorage, window.sessionStorage ]);
  const historyDOM = document.getElementById('history-list') as HTMLDivElement;
  const doms = [ voiceOptions, speakItInput, speakItSubmit, volumeInput ] as HTMLElement[];
  setHistoryList(historyDOM, voiceOptions, volumeInput, historyDOM, historyStorage, doms, window);

  window['utterances'] = new Map();
  speakItForm.onsubmit = (e) => {
    e.preventDefault();

    const text = speakItInput.value;
    speak(text, voiceOptions, volumeInput, historyDOM, historyStorage, doms, window);
  };
};
