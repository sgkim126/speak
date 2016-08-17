let index: number = 0;

export default class Utterances {
  private utterances: Map<number, SpeechSynthesisUtterance>;

  constructor() {
    this.utterances = new Map<number, SpeechSynthesisUtterance>();
  }

  public create(text: string, voice: SpeechSynthesisVoice, volume: number, rate: number): [ SpeechSynthesisUtterance, number ] {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.volume = volume;
    utterance.rate = rate;

    index += 1;
    this.utterances.set(index, utterance);

    return [ utterance, index ];
  }

  public delete(index: number): void {
    this.utterances.delete(index);
  }
}
