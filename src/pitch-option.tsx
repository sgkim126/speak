import * as React from 'react';

interface IProps {
  disabled: boolean;
}
interface IState {
}

const PITCH_REF = 'pitchRef';

export default class PitchOption extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { };
  }

  public render(): JSX.Element {
    const { disabled } = this.props;
    return <input type='range' min='0' max='2' step='0.1' defaultValue='1' disabled={disabled} ref={PITCH_REF} />;
  }

  public get pitch(): number {
    return parseInt((this.refs[PITCH_REF] as HTMLInputElement).value, 10);
  }
}
