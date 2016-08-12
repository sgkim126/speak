function isSpeechSupport(window) {
  return window.speechSynthesis != null && window.SpeechSynthesisUtterance != null;
}

function getVoices(speechSynthesis) {
  return (new Promise(function (resolve) {
    speechSynthesis.onvoiceschanged = resolve;
  })).then(function () {
    return speechSynthesis.getVoices().map(function (voice) {
      return { lang: voice.lang, name: voice.name };
    });
  });
}

function makeVoiceOption(voice, document) {
  var option = document.createElement('option');
  option.dataset['lang'] = voice.lang;
  option.dataset['name'] = voice.name;
  if (voice.default) {
    option.selected = true;
  }
  option.textContent = voice.name;
  return option;
}

function getVolume(volumeDOM) {
  var volume = volumeDOM.value;
  if (volume == null) {
    return 1;
  }
  return volume / 100;
}

var utteranceIndex = 0;
function saveUtterance(utterance) {
  utteranceIndex += 1;
  window.utterances.set(utteranceIndex, utterance);
  return utteranceIndex;
}
function removeUtterance(index) {
window.utterances.delete(index);
}

function speakIt(text, voiceName, speechSynthesis, volume, historyStorage) {
  return new Promise(function (resolve, reject) {
    if (text === '') {
      reject(new Error('no text'));
    }

    var utterance = new SpeechSynthesisUtterance(text)
    var utteranceIndex = saveUtterance(utterance);
    utterance.voice = speechSynthesis.getVoices().find(function (voice) {
      return voice.name === voiceName;
    });
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

function enable(tag) {
  tag.disabled = false;
  tag.classList.remove('disabled');
};

function disable(tag) {
  tag.disabled = true;
  tag.classList.add('disabled');
};

function HistoryStorage(storage) {
  this.KEY = 'SPEAK-IT-STORAGE';
  this.storage = storage.find(function (storage) {
    return storage != null;
  });
}
HistoryStorage.prototype.get = function () {
  if (this.storage == null) {
    return [];
  }
  var history = this.storage.getItem(this.KEY);
  if (history == null) {
    return [];
  }
  return JSON.parse(history);
};
HistoryStorage.prototype.add = function (message) {
  if (this.storage == null) {
    return;
  }
  var history = this.get();
  history.unshift(message);
  this.storage.setItem(this.KEY, JSON.stringify(history));
};

function setHistoryList(target, voiceOptions, volumeInput, historyDOM, historyStorage, doms, window) {
  var child = target.firstChild;
  for (; child != null; child = target.firstChild) {
    target.removeChild(child);
  }

  var history = historyStorage.get();
  history.map(function (message) {
    var item = getHistoryItem(message, voiceOptions, volumeInput, historyDOM, historyStorage, doms, window);
    target.appendChild(item);
  });
}

function getHistoryItem(text, voiceOptions, volumeInput, historyDOM, historyStorage, doms, window) {
  var button = window.document.createElement('button');
  button.className = 'list-group-item';
  button.textContent = text;
  button.onclick = function (e) {
    e.preventDefault();
    speak(text, voiceOptions, volumeInput, historyDOM, historyStorage, doms, window);
  };
  return button;
}

function speak(text, voiceOptions, volumeInput, historyDOM, historyStorage, doms, window) {
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

document.body.onload = function() {
  if (!isSpeechSupport(window)) {
    return;
  }

  var notSupported = document.getElementById('not_supported');
  notSupported.classList.add('hide');
  var supported = document.getElementById('supported');
  supported.classList.remove('hide');

  var voiceOptions = document.getElementById('voice_options');

  var voices = getVoices(window.speechSynthesis);
  voices.then(function(voices) {
    voices.map(function (voice) { return makeVoiceOption(voice, document); })
    .forEach(function (option) {
      voiceOptions.appendChild(option);
    });
  });

  var speakItForm = document.getElementById('speak-it-form');
  var speakItInput = document.getElementById('speak-it-input');
  var speakItSubmit = document.getElementById('speak-it-submit');
  var volumeInput = document.getElementById('volume');

  var historyStorage = new HistoryStorage([ window.localStorage, window.sessionStorage ]);
  var historyDOM = document.getElementById('history-list');
  var doms = [ voiceOptions, speakItInput, speakItSubmit, volume ];
  setHistoryList(historyDOM, voiceOptions, volumeInput, historyDOM, historyStorage, doms, window);

  window.utterances = new Map();
  speakItForm.onsubmit = function(e) {
    e.preventDefault();

    var text = speakItInput.value;
    speak(text, voiceOptions, volumeInput, historyDOM, historyStorage, doms, window);
  };
};
