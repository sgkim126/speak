import * as React from 'react';

interface IProps {
  voices: SpeechSynthesisVoice[];

  disabled: boolean;
}
interface IState {
}

const VOICE_REF = 'voiceRef';

export default class VoiceOption extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { };
  }

  public render(): JSX.Element {
    const { voices, disabled } = this.props;
    const selected = voices.find(voice => voice.default).name;

    return <select className='form-control' defaultValue={selected} disabled={disabled} ref={VOICE_REF}>
    {voices.map(voice => <option key={voice.name} data-lang={voice.lang} data-name={voice.name}>{voice.name}</option>)}
    </select>;
  }

  public get voice(): SpeechSynthesisVoice {
    const name = (this.refs[VOICE_REF] as HTMLInputElement).value;
    return this.props.voices.find(voice => voice.name === name);
  }
}
