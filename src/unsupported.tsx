import * as React from 'react';
import { Jumbotron } from 'react-bootstrap';

interface IProps {
}
interface IState {
}

export default class Unsupported extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { };
  }

  public render(): JSX.Element {
    return <Jumbotron style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}>
    <h1>This browser is not supported</h1>
    </Jumbotron>;
  }
}
