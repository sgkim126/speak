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

function enable(tag) {
  tag.disabled = false;
  tag.classList.remove('disabled');
};

function disable(tag) {
  tag.disabled = true;
  tag.classList.add('disabled');
};

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

  var doms = [ voiceOptions, speakItInput, speakItSubmit ];
  speakItForm.onsubmit = function(e) {
    e.preventDefault();

    var text = speakItInput.value;
    var voice = voiceOptions.value;

    doms.map(disable);
    var speak = speakIt(text, voice, window.speechSynthesis);
    speak.catch(function(e) {
    }).then(function () {
      doms.map(enable);
    });
  };
};
