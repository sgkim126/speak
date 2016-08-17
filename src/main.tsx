import HistoryStorage from './history-storage.ts';
import History from './history.tsx';
import Speak from './speak.tsx';
import Utterances from './utterances.ts';
import VoiceOption from './voice-option.tsx';
import VolumeOption from './volume-option.tsx';
import * as React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';

interface IProps {
  voices: SpeechSynthesisVoice[];

  utterances: Utterances;
  historyStorage: HistoryStorage;
}
interface IState {
  history?: string[];

  voice?: SpeechSynthesisVoice;

  disabled?: boolean;
}

const SPEAK = 'speakRef';

const VOLUME = 'volumeRefOption';

export default class Main extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const { historyStorage, voices } = this.props;

    const history = historyStorage.get();
    const voice = voices.find(voice => voice.default);
    const disabled = false;

    this.state = { history, voice, disabled };
  }

  public render(): JSX.Element {
    const speak = this.speak.bind(this);
    const remove = this.remove.bind(this);

    const onHistoryClick = this.onHistoryClick.bind(this);
    const onVoiceChange = this.onVoiceChange.bind(this);

    const { voices } = this.props;
    const { disabled, voice, history } = this.state;

    return <Grid style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}>
    <Row>
      <Col xs={12}>
        <Speak speak={speak} disabled={disabled} ref={SPEAK}/>
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <History history={history} disabled={disabled} onClick={onHistoryClick} speak={speak} remove={remove} />
      </Col>
    </Row>
    <Row style={{ bottom: 0, left: 0, position: 'absolute', right: 0 }}>
      <Col xs={6} className='btn-group form-group'>
        <VoiceOption voices={voices} selected={voice} onChange={onVoiceChange} disabled={disabled} />
      </Col>
      <Col xs={6}>
        <VolumeOption disabled={disabled} ref={VOLUME} />
      </Col>
    </Row>
  </Grid>;
  }

  private onHistoryClick(text: string): void {
    (this.refs[SPEAK] as any).change(text);
  }

  private speak(text: string): void {
    this.setState({ disabled: true });

    const { utterances } = this.props;
    const { voice } = this.state;

    const volume = (this.refs[VOLUME] as VolumeOption).volume;

    speak(text, voice, volume, utterances).then(() => {
      const { historyStorage } = this.props;
      historyStorage.add(text);
      const history = historyStorage.get();
      this.setState({ history });
    }).catch(e => console.log(e)).then(() => {
      this.setState({ disabled: false });
    });
  }

  private remove(text: string): void {
    const { historyStorage } = this.props;
    historyStorage.delete(text);
    const history = historyStorage.get();
    this.setState({ history });
  }

  private onVoiceChange(voice: SpeechSynthesisVoice): void {
    this.setState({ voice });
  }
}

function speak(text: string, voice: SpeechSynthesisVoice, volume: number, utterances: Utterances): Promise<{}> {
  if (text == null || text === '') {
    return Promise.reject<{}>(new Error('no text'));
  }
  const [ utterance, utteranceIndex ] = utterances.create(text, voice, volume);
  const result = new Promise((resolve, reject) => {
    utterance.onend = resolve;
    utterance.onerror = reject;
    speechSynthesis.speak(utterance);
  });
  result.then(() => utterances.delete(utteranceIndex), () => utterances.delete(utteranceIndex));
  return result;
}
