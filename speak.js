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
};
