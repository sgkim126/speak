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
    return <Jumbotron className='container-fluid'>
    <h1>This browser is not supported</h1>
    </Jumbotron>;
  }
}
