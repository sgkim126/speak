function isSpeechSupport(window) {
  return window.speechSynthesis != null && window.SpeechSynthesisUtterance != null;
}

document.body.onload = function() {
  if (!isSpeechSupport(window)) {
    return;
  }

  var notSupported = document.getElementById('not_supported');
  notSupported.classList.add('hide');
  var supported = document.getElementById('supported');
  supported.classList.remove('hide');
};
