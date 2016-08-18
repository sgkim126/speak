import HistoryStorage from './history-storage.ts';
import History from './history.tsx';
import PitchOption from './pitch-option.tsx';
import RateOption from './rate-option.tsx';
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

  disabled?: boolean;
}

const SPEAK = 'speakRef';

const VOLUME = 'volumeRefOption';
const VOICE = 'voiceRefOption';
const RATE = 'rateOptionRef';
const PITCH = 'pitchOptionRef';

export default class Main extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const { historyStorage } = this.props;

    const history = historyStorage.get();
    const disabled = false;

    this.state = { history, disabled };
  }

  public render(): JSX.Element {
    const speak = this.speak.bind(this);
    const remove = this.remove.bind(this);

    const onHistoryClick = this.onHistoryClick.bind(this);

    const { voices } = this.props;
    const { disabled, history } = this.state;

    return <Grid className='container-fluid'>
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
    <Row>
      <Col xs={12} sm={6} md={3} className='btn-group form-group'>
        <VoiceOption voices={voices} disabled={disabled} ref={VOICE} />
      </Col>
      <Col xs={2} sm={1} md={1}>Volume:</Col>
      <Col xs={10} sm={5} md={2}>
        <VolumeOption disabled={disabled} ref={VOLUME} />
      </Col>
      <Col xs={2} sm={1} md={1}>Rate:</Col>
      <Col xs={10} sm={5} md={2}>
        <RateOption disabled={disabled} ref={RATE} />
      </Col>
      <Col xs={2} sm={1} md={1}>Pitch:</Col>
      <Col xs={10} sm={5} md={2}>
        <PitchOption disabled={disabled} ref={PITCH} />
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

    const volume = (this.refs[VOLUME] as VolumeOption).volume;
    const voice = (this.refs[VOICE] as VoiceOption).voice;
    const rate = (this.refs[RATE] as RateOption).rate;
    const pitch = (this.refs[PITCH] as PitchOption).pitch;

    speak(text, voice, volume, rate, pitch, utterances).then(() => {
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
}

function speak(text: string, voice: SpeechSynthesisVoice,
               volume: number, rate: number, pitch: number, utterances: Utterances): Promise<{}> {
  if (text == null || text === '') {
    return Promise.reject<{}>(new Error('no text'));
  }
  const [ utterance, utteranceIndex ] = utterances.create(text, voice, volume, rate, pitch);
  const result = new Promise((resolve, reject) => {
    utterance.onend = resolve;
    utterance.onerror = reject;
    speechSynthesis.speak(utterance);
  });
  result.then(() => utterances.delete(utteranceIndex), () => utterances.delete(utteranceIndex));
  return result;
}
