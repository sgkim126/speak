import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Utterances from './utterances.ts';

interface IProps {
  disabled: boolean;

  speak: (result: string) => void;
}
interface IState {
}

const SEPAK_INPUT = 'speakInputRef';

export default class Speak extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { };
  }

  public render(): JSX.Element {
    const onSubmit = this.onSubmit.bind(this);
    const {disabled } = this.props;

    return <form className='input-group' onSubmit={onSubmit}>
      <input type='text' className='form-control' placeholder='Speak it' autoComplete='off' name='speakInput' ref={SEPAK_INPUT} disabled={disabled} />
      <span className="input-group-btn">
        <button className='btn' type='submit' title='Speak' disabled={disabled}>Speak</button>
      </span>
    </form>;
  }

  public change(text: string): void {
    (this.refs[SEPAK_INPUT] as any).value = text;
  }

  private onSubmit(e: React.FormEvent): void {
    e.preventDefault();

    const text = e.target['speakInput'].value;
    const { speak } = this.props;
    speak(text);
  }
}
