import PitchOption from './pitch-option.tsx';
import RateOption from './rate-option.tsx';
import VoiceOption from './voice-option.tsx';
import VolumeOption from './volume-option.tsx';
import * as React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';

interface IProps {
  voices: SpeechSynthesisVoice[];

  disabled: boolean;
}

interface IState {
}

const VOLUME = 'volumeRefOption';
const VOICE = 'voiceRefOption';
const RATE = 'rateOptionRef';
const PITCH = 'pitchOptionRef';

export default class Option extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { };
  }

  public render(): JSX.Element {
    const { disabled, voices } = this.props;

    return <Grid fluid>
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

  public get voice(): SpeechSynthesisVoice {
    return (this.refs[VOICE] as VoiceOption).voice;
  }
  public get volume(): number {
    return (this.refs[VOLUME] as VolumeOption).volume;
  }
  public get rate(): number {
    return (this.refs[RATE] as RateOption).rate;
  }
  public get pitch(): number {
    return (this.refs[PITCH] as PitchOption).pitch;
  }
}
