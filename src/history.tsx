import * as React from 'react';
import { Button, ButtonGroup, Glyphicon, Pagination } from 'react-bootstrap';

interface IProps {
  history: string[];

  disabled: boolean;

  onClick: (text: string) => void;
  speak: (text: string) => void;
  remove: (text: string) => void;
}

interface IState {
  activePage: number;
}

const ITEM_PER_PAGE = 10;

export default class History extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const activePage = 1;
    this.state = { activePage };
  }

  public render(): JSX.Element {
    const { disabled, history } = this.props;
    const { activePage } = this.state;

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

    const onPageSelect = this.onPageSelect.bind(this);

    const numberOfPages = Math.ceil(history.length / ITEM_PER_PAGE);

    const historyToShow = history.slice((activePage - 1) * ITEM_PER_PAGE, activePage * ITEM_PER_PAGE);

    return <div>
    <ul className='list-group'>
      {historyToShow.map((history, i) => {
        const key = history + '-' + i.toString();
        return <li key={key} className='list-group-item' style={{padding: '0'}}>
          <Button title={history} className={className} disabled={disabled} block data-value={history} onClick={onClick}
            style={{border: '0px solid transparent'}}>{history}
            <ButtonGroup className='pull-right'>
              <Button className={className} disabled={disabled}
                data-value={history} onClick={speak}><Glyphicon glyph='play' /></Button>
              <Button className={className} disabled={disabled}
                data-value={history} onClick={remove}><Glyphicon glyph='remove' /></Button>
            </ButtonGroup>
          </Button>
        </li>;
      })}
    </ul>
    <div className='center-block text-center'>
      <Pagination items={numberOfPages} bsSize='medium' activePage={activePage} first last next prev
        onSelect={onPageSelect} />
    </div>
    </div>;
  }

  private onClick(e: React.MouseEvent): void {
    e.preventDefault();

    const { onClick } = this.props;
    const VALUE = 'value';
    onClick((e.target as HTMLButtonElement).dataset[VALUE]);
  }

  private speak(e: React.MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();

    const { speak } = this.props;
    const VALUE = 'value';
    speak((e.currentTarget as HTMLButtonElement).dataset[VALUE]);
  }

  private remove(e: React.MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();

    const { remove } = this.props;
    const VALUE = 'value';
    remove((e.currentTarget as HTMLButtonElement).dataset[VALUE]);
  }

  private onPageSelect(activePage: number): void {
    this.setState({ activePage });
  }
}
