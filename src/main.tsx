import HistoryStorage from './history-storage.ts';
import History from './history.tsx';
import Option from './option.tsx';
import Speak from './speak.tsx';
import Stage from './stage.ts';
import Utterances from './utterances.ts';
import * as React from 'react';
import { Col, Grid, Row, Well } from 'react-bootstrap';

interface IProps {
  voices: SpeechSynthesisVoice[];

  utterances: Utterances;
  historyStorage: HistoryStorage;
}
interface IState {
  history?: string[];

  stage?: Stage;
}

const SPEAK = 'speakRef';
const OPTION = 'optionRef';

export default class Main extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const { historyStorage } = this.props;

    const history = historyStorage.get();
    const stage = Stage.Idle;

    this.state = { history, stage };
  }

  public render(): JSX.Element {
    const speak = this.speak.bind(this);
    const remove = this.remove.bind(this);

    const onHistoryClick = this.onHistoryClick.bind(this);

    const { voices } = this.props;
    const { stage, history } = this.state;

    const disabled = stage === Stage.Speaking;

    return <div className='container-fluid'>
      <Option voices={voices} disabled={disabled} ref={OPTION} />
      <Well>
        <Grid fluid>
          <Row>
            <Col xs={12}>
              <Speak speak={speak} stage={stage} ref={SPEAK}/>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <History history={history} disabled={disabled} onClick={onHistoryClick} speak={speak} remove={remove} />
            </Col>
          </Row>
        </Grid>
      </Well>
  </div>;
  }

  private onHistoryClick(text: string): void {
    (this.refs[SPEAK] as any).change(text);
  }

  private speak(text: string): void {
    this.setState({ stage: Stage.Speaking });

    const { utterances } = this.props;

    const option = this.refs[OPTION] as Option;

    const voice = option.voice;
    const volume = option.volume;
    const rate = option.rate;
    const pitch = option.pitch;

    speak(text, voice, volume, rate, pitch, utterances).then(() => {
      const { historyStorage } = this.props;
      historyStorage.add(text);
      const history = historyStorage.get();
      this.setState({ history });
    }).catch(e => console.log(e)).then(() => {
      this.setState({ stage: Stage.Idle });
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
