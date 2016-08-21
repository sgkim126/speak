import Stage from './stage.ts';
import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';

interface IProps {
  stage: Stage;

  speak: (result: string) => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
}
interface IState {
}

const SEPAK_INPUT = 'speakInputRef';
const SPEAK_INPUT_NAME = 'speakInput';

export default class Speak extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { };
  }

  public render(): JSX.Element {
    const onSubmit = this.onSubmit.bind(this);
    const { pause, resume, cancel, stage } = this.props;
    const disabled = stage !== Stage.Idle;

    const resumeDisabled = stage !== Stage.Paused;
    const pauseDisabled = stage !== Stage.Speaking;
    const stopDisabled = stage === Stage.Idle;

    return <form className='input-group' onSubmit={onSubmit}>
      <input type='text' className='form-control' placeholder='Speak it' autoComplete='off' disabled={disabled}
        name={SPEAK_INPUT_NAME} ref={SEPAK_INPUT} />
      <span className="input-group-btn">
        <button className='btn' type='button' title='resume' disabled={resumeDisabled} onClick={resume}>&nbsp;<Glyphicon glyph='play' /></button>
        <button className='btn' type='button' title='pause' disabled={pauseDisabled} onClick={pause}>&nbsp;<Glyphicon glyph='pause' /></button>
        <button className='btn' type='button' title='stop' disabled={stopDisabled} onClick={cancel}>&nbsp;<Glyphicon glyph='stop' /></button>
        <button className='btn' type='submit' title='Speak' disabled={disabled}>Speak</button>
      </span>
    </form>;
  }

  public change(text: string): void {
    (this.refs[SEPAK_INPUT] as any).value = text;
  }

  private onSubmit(e: React.FormEvent): void {
    e.preventDefault();

    const text = e.target[SPEAK_INPUT_NAME].value;
    const { speak } = this.props;
    speak(text);
  }
}
