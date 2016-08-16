import HistoryStorage from './history-storage.ts';
import Main from './main.tsx';
import Unsupported from './unsupported.tsx';
import Utterances from './utterances.ts';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

function isSpeechSupport(window: Window): boolean {
  const SPEECH_SYNTHESIS = 'speechSynthesis';
  const SPEECH_SYNTHESIS_UTTERANCE = 'SpeechSynthesisUtterance';
  return window.speechSynthesis != null && window[SPEECH_SYNTHESIS_UTTERANCE] != null;
}

function getVoices(speechSynthesis: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> {
  return (new Promise(resolve => {
    speechSynthesis.onvoiceschanged = resolve;
  })).then(() => speechSynthesis.getVoices());
}

document.body.onload = () => {
  const target: HTMLDivElement = document.getElementById('main') as HTMLDivElement;

  ReactDOM.render(<Unsupported />, target);
  if (!isSpeechSupport(window)) {
    return;
  }

  const utterances = new Utterances();
  const historyStorage = new HistoryStorage([ window.localStorage, window.sessionStorage ]);
  getVoices(window.speechSynthesis)
  .then(voices => ReactDOM.render(<Main voices={voices} historyStorage={historyStorage} utterances={utterances} />, target));
};
