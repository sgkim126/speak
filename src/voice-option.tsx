import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface IProps {
  voices: SpeechSynthesisVoice[];
  selected: SpeechSynthesisVoice;

  disabled: boolean;

  onChange: (voice: SpeechSynthesisVoice) => void;
}
interface IState {
}

export default class VoiceOption extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { };
  }

  public render(): JSX.Element {
    const { voices, selected, disabled } = this.props;
    return <select className='form-control' defaultValue={selected.name} onChange={this.onChange.bind(this)} disabled={disabled}>
    {voices.map(voice => <option key={voice.name} data-lang={voice.lang} data-name={voice.name}>{voice.name}</option>)}
    </select>;
  }

  private onChange(e: React.FormEvent): void {
    const { voices, onChange } = this.props;
    const name = (e.target as any).value
    const voice = voices.find(voice => voice.name === name);
    onChange(voice);
  }
}
