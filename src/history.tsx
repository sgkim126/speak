import * as React from 'react';
import { Button, ButtonGroup, ButtonToolbar, Glyphicon } from 'react-bootstrap';

interface IProps {
  history: string[];

  disabled: boolean;

  onClick: (text: string) => void;
  speak: (text: string) => void;
  remove: (text: string) => void;
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
    const remove = this.remove.bind(this);

    return <ul className='list-group' style={{height: '80%', overflowX: 'hidden', overflowY: 'scroll'}}>
      {history.map((history, i) => {
        const key = history + '-' + i.toString();
        return <li key={key} className='list-group-item'>
          <ButtonToolbar>
            <Button title={history} className={className} disabled={disabled}
              data-value={history} onClick={onClick}>{history}</Button>
            <ButtonGroup>
              <Button className={className} disabled={disabled}
                data-value={history} onClick={speak}><Glyphicon glyph='play' /></Button>
              <Button className={className} disabled={disabled}
                data-value={history} onClick={remove}><Glyphicon glyph='remove' /></Button>
            </ButtonGroup>
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

  private remove(e: React.MouseEvent): void {
    e.preventDefault();

    const { remove } = this.props;
    const VALUE = 'value';
    remove((e.currentTarget as HTMLButtonElement).dataset[VALUE]);
  }
}
