import * as React from 'react';

interface IProps {
  history: string[];

  disabled: boolean;

  onClick: (text: string) => void;
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
      const className = ['list-group-item'];
      if (disabled) {
        className.push('disabled');
      }
      return className.join(' ');
    })();

    const onClick = this.onClick.bind(this);

    return <div className='list-group' id='history-list' style={{height: '80%', overflowX: 'hidden', overflowY: 'scroll'}}>
      {history.map((history, i) => {
        const key = history + '-' + i.toString();
        return <button key={key} title={history} className={className} disabled={disabled}
          data-value={history} onClick={onClick}>{history}</button>;
      })}
    </div>;
  }

  private onClick(e: React.MouseEvent): void {
    e.preventDefault();

    const { onClick } = this.props;
    const VALUE = 'value';
    onClick((e.target as HTMLButtonElement).dataset[VALUE]);
  }
}
