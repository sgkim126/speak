import * as React from 'react';
import * as ReactDOM from 'react-dom';
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
    return <Jumbotron style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
    <h1>This browser is not supported</h1>
    </Jumbotron>;
  }
}
