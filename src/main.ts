import HistoryStorage from './history-storage.ts';

function isSpeechSupport(window: Window): boolean {
  return window['speechSynthesis'] != null && window['SpeechSynthesisUtterance'] != null;
}

function getVoices(speechSynthesis: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> {
  return (new Promise(function (resolve) {
    speechSynthesis.onvoiceschanged = resolve;
  })).then(function () {
    return speechSynthesis.getVoices().map(function (voice) {
      return { lang: voice.lang, name: voice.name };
    });
  });
}

function makeVoiceOption(voice: SpeechSynthesisVoice, document: Document): HTMLOptionElement {
  var option = document.createElement('option');
  option.dataset['lang'] = voice.lang;
  option.dataset['name'] = voice.name;
  if (voice.default) {
    option.selected = true;
  }
  option.textContent = voice.name;
  return option;
}

function getVolume(volumeDOM: HTMLInputElement): number {
  var volume = parseInt(volumeDOM.value, 10);
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
  return new Promise(function (resolve, reject) {
    if (text === '') {
      reject(new Error('no text'));
    }

    var utterance = new SpeechSynthesisUtterance(text)
    var utteranceIndex = saveUtterance(utterance);
    var voice: SpeechSynthesisVoice = speechSynthesis.getVoices().find(function (voice) {
      return voice.name === voiceName;
    });
    utterance.voice = voice;
    utterance.lang = voice.lang as string;
    utterance.volume = volume;
    historyStorage.add(text);
    speechSynthesis.speak(utterance);

    utterance.onend = function() {
      resolve();
      removeUtterance(utteranceIndex);
    };
    utterance.onerror = function(e) {
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

  var history = historyStorage.get();
  history.map(function (message: string) {
    var item = getHistoryItem(message, voiceOptions, volumeInput, historyDOM, historyStorage, doms, window);
    target.appendChild(item);
  });
}

function getHistoryItem(text: string, voiceOptions: HTMLSelectElement, volumeInput: HTMLInputElement, historyDOM: HTMLDivElement, historyStorage: HistoryStorage, doms: HTMLElement[], window: Window): HTMLButtonElement {
  var button = window.document.createElement('button');
  button.className = 'list-group-item';
  button.textContent = text;
  button.onclick = function (e) {
    e.preventDefault();
    speak(text, voiceOptions, volumeInput, historyDOM, historyStorage, doms, window);
  };
  return button;
}

function speak(text: string, voiceOptions: HTMLSelectElement, volumeInput: HTMLInputElement, historyDOM: HTMLDivElement, historyStorage: HistoryStorage, doms: any[], window: Window): void {
  var voice = voiceOptions.value;
  var volume = getVolume(volumeInput);

  doms.map(disable);
  var speak = speakIt(text, voice, window.speechSynthesis, volume, historyStorage);
  speak.catch(function(e) {
    console.log(e);
  }).then(function () {
    doms.map(enable);
    setHistoryList(historyDOM, voiceOptions, volumeInput, historyDOM, historyStorage, doms, window);
  });
}

document.body.onload = function(): void {
  if (!isSpeechSupport(window)) {
    return;
  }

  var notSupported = document.getElementById('not_supported') as HTMLDivElement;
  notSupported.classList.add('hide');
  var supported = document.getElementById('supported') as HTMLDivElement;
  supported.classList.remove('hide');

  var voiceOptions = document.getElementById('voice_options') as HTMLSelectElement;

  var voices = getVoices(window.speechSynthesis);
  voices.then(function(voices: SpeechSynthesisVoice[]) {
    voices.map(function (voice: SpeechSynthesisVoice) { return makeVoiceOption(voice, document); })
    .forEach(function (option: HTMLOptionElement) {
      voiceOptions.appendChild(option);
    });
  });

  var speakItForm = document.getElementById('speak-it-form') as HTMLFormElement;
  var speakItInput = document.getElementById('speak-it-input') as HTMLInputElement;
  var speakItSubmit = document.getElementById('speak-it-submit') as HTMLButtonElement;
  var volumeInput = document.getElementById('volume') as HTMLInputElement;

  var historyStorage = new HistoryStorage([ window.localStorage, window.sessionStorage ]);
  var historyDOM = document.getElementById('history-list') as HTMLDivElement;
  var doms = [ voiceOptions, speakItInput, speakItSubmit, volumeInput ] as HTMLElement[];
  setHistoryList(historyDOM, voiceOptions, volumeInput, historyDOM, historyStorage, doms, window);

  window['utterances'] = new Map();
  speakItForm.onsubmit = function(e) {
    e.preventDefault();

    var text = speakItInput.value;
    speak(text, voiceOptions, volumeInput, historyDOM, historyStorage, doms, window);
  };
};
