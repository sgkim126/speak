import * as React from 'react';

interface IProps {
  disabled: boolean;
}
interface IState {
}

const RATE_REF = 'rateRef';

export default class RateOption extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { };
  }

  public render(): JSX.Element {
    const { disabled } = this.props;
    return <input type='range' min='0' max='4' step='0.1' defaultValue='1' disabled={disabled} ref={RATE_REF} />;
  }

  public get rate(): number {
    return parseInt((this.refs[RATE_REF] as HTMLInputElement).value, 10);
  }
}
