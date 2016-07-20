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
  option.textContent = voice.name;
  return option;
}

function speakIt(text, voiceName, speechSynthesis) {
  return new Promise(function (resolve, reject) {
    if (text === '') {
      reject(new Error('no text'));
    }

    var utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = speechSynthesis.getVoices().find(function (voice) {
      return voice.name === voiceName;
    });
    speechSynthesis.speak(utterance);

    utterance.onend = function() {
      resolve();
    };
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
  speakItForm.onsubmit = function(e) {
    e.preventDefault();

    var text = speakItInput.value;
    var voice = voiceOptions.value;
    var speak = speakIt(text, voice, window.speechSynthesis);
  };
};
