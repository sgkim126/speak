var index: number = 0;

export default class Utterances {
  private utterances: Map<number, SpeechSynthesisUtterance>;

  constructor() {
    this.utterances = new Map<number, SpeechSynthesisUtterance>();
  }

  create(text: string, voice: SpeechSynthesisVoice, volume: number): [ SpeechSynthesisUtterance, number ] {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.volume = volume;

    index += 1;
    this.utterances.set(index, utterance);

    return [ utterance, index ];
  }

  delete(index: number): void {
    this.utterances.delete(index);
  }
}
