import * as React from 'react';

interface IProps {
  disabled: boolean;
}
interface IState {
}

const VOLUME_REF = 'volumeRef';
const DEFAULT_VOLUME = 100;

export default class VolumeOption extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { };
  }

  public render(): JSX.Element {
    const { disabled } = this.props;
    return <input type='range' min='0' max='100' step='1'
      defaultValue={DEFAULT_VOLUME} disabled={disabled} ref={VOLUME_REF} />;
  }

  public get volume(): number {
    return parseInt((this.refs[VOLUME_REF] as HTMLInputElement).value, 10) / 100;
  }
}
