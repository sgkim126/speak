import * as React from 'react';
import * as ReactDOM from 'react-dom';
import History from './history.tsx';
import HistoryStorage from './history-storage.ts';
import Speak from './speak.tsx';
import Utterances from './utterances.ts';
import VoiceOption from './voice-option.tsx';
import VolumeOption from './volume-option.tsx';
import { Col, Grid, Row } from 'react-bootstrap';

interface IProps {
  voices: SpeechSynthesisVoice[];

  utterances: Utterances;
  historyStorage: HistoryStorage;
}
interface IState {
  history?: string[];

  voice?: SpeechSynthesisVoice;
  volume?: number;

  disabled?: boolean;
}

const DEFAULT_VOLUME = 100;

const SPEAK = 'speakRef';

export default class Main extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const { historyStorage, voices } = this.props;

    const history = historyStorage.get();
    const voice = voices.find(voice => voice.default);
    const volume = DEFAULT_VOLUME;
    const disabled = false;

    this.state = { history, voice, volume, disabled };
  }

  public render(): JSX.Element {
    const speak = this.speak.bind(this);

    const onHistoryClick = this.onHistoryClick.bind(this);
    const onVolumeChange = this.onVolumeChange.bind(this);
    const onVoiceChange = this.onVoiceChange.bind(this);

    const { utterances, voices } = this.props;
    const { disabled, voice, volume, history } = this.state;

    return <Grid style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
    <Row>
      <Col xs={12}>
        <Speak speak={speak} disabled={disabled} ref={SPEAK}/>
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <History history={history} disabled={disabled} onClick={onHistoryClick} />
      </Col>
    </Row>
    <Row style={{position: 'absolute', left: 0, right: 0, bottom: 0}}>
      <Col xs={6} className='btn-group form-group'>
        <VoiceOption voices={voices} selected={voice} onChange={onVoiceChange} disabled={disabled} />
      </Col>
      <Col xs={6}>
        <VolumeOption defaultVolume={volume} onChange={onVolumeChange} disabled={disabled} />
      </Col>
    </Row>
  </Grid>
  }

  private onHistoryClick(text: string): void {
    (this.refs[SPEAK] as any).change(text);
  }

  private speak(text: string): void {
    this.setState({ disabled: true });

    const { utterances } = this.props;
    const { voice, volume } = this.state;

    speak(text, voice, volume, utterances).then(() => {
      const { historyStorage } = this.props;
      historyStorage.add(text);
      const history = historyStorage.get();
      this.setState({ history });
    }).catch(e => console.log(e)).then(() => {
      this.setState({ disabled: false });
    });
  }

  private onVolumeChange(volume: number): void {
    this.setState({ volume });
  }
  private onVoiceChange(voice: SpeechSynthesisVoice): void {
    this.setState({ voice });
  }
}

function speak(text: string, voice: SpeechSynthesisVoice, volume: number, utterances: Utterances): Promise<{}> {
  const [ utterance, utteranceIndex ] = utterances.create(text, voice, volume);
  const result = new Promise((resolve, reject) => {
    if (text === '') {
      reject(new Error('no text'));
      return;
    }
    utterance.onend = resolve;
    utterance.onerror = reject;
    speechSynthesis.speak(utterance);
  });
  result.then(() => utterances.delete(utteranceIndex), () => utterances.delete(utteranceIndex));
  return result;
}
