import * as React from 'react';
import { Button, ButtonToolbar, Glyphicon } from 'react-bootstrap';

interface IProps {
  history: string[];

  disabled: boolean;

  onClick: (text: string) => void;
  speak: (text: string) => void;
}

interface IState {
}

export default class Main extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { };
  }

  public render(): JSX.Element {
    const { disabled, history } = this.props;
    const className = (() => {
      const className = [] as string[];
      if (disabled) {
        className.push('disabled');
      }
      return className.join(' ');
    })();

    const onClick = this.onClick.bind(this);
    const speak = this.speak.bind(this);

    return <ul className='list-group' style={{height: '80%', overflowX: 'hidden', overflowY: 'scroll'}}>
      {history.map((history, i) => {
        const key = history + '-' + i.toString();
        return <li key={key} className='list-group-item'>
          <ButtonToolbar>
            <Button title={history} className={className} disabled={disabled}
              data-value={history} onClick={onClick}>{history}</Button>
            <Button className={className} disabled={disabled}
              data-value={history} onClick={speak}><Glyphicon glyph='play' /></Button>
          </ButtonToolbar>
        </li>;
      })}
    </ul>;
  }

  private onClick(e: React.MouseEvent): void {
    e.preventDefault();

    const { onClick } = this.props;
    const VALUE = 'value';
    onClick((e.target as HTMLButtonElement).dataset[VALUE]);
  }

  private speak(e: React.MouseEvent): void {
    e.preventDefault();

    const { speak } = this.props;
    const VALUE = 'value';
    speak((e.currentTarget as HTMLButtonElement).dataset[VALUE]);
  }
}
