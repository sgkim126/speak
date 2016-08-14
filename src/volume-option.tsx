import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface IProps {
  defaultVolume: number;

  disabled: boolean;

  onChange: (volume: number) => void;
}
interface IState {
}

export default class VolumeOption extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { };
  }

  public render(): JSX.Element {
    const { defaultVolume, disabled } = this.props;
    return <input type='range' min='0' max='100' step='1' defaultValue={defaultVolume} onChange={this.onChange.bind(this)} disabled={disabled} />;
  }

  private onChange(e: React.FormEvent): void {
    this.props.onChange((e.target as any).value / 100);
  };
}
