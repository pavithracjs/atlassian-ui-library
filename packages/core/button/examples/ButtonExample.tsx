import * as React from 'react';
import Button, { ButtonAppearances } from '../src';

const appearances: ButtonAppearances[] = ['default', 'primary'];

type State = {
  message: string;
};

const Table = (props: React.HTMLProps<HTMLDivElement>) => (
  <div style={{ display: 'table' }} {...props} />
);
const Row = (props: React.HTMLProps<HTMLDivElement>) => (
  <div style={{ display: 'table-row' }} {...props} />
);
const Cell = (props: React.HTMLProps<HTMLDivElement>) => (
  <div style={{ display: 'table-cell', padding: 4 }} {...props} />
);

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default class ButtonAppearance extends React.Component<{}, State> {
  render() {
    return (
      <React.Fragment>
        <Table>
          {appearances.map(a => (
            <Row key={a}>
              <Cell>
                <Button
                  appearance={a}
                  ariaLabel={a}
                  onClick={() => alert(`${a} clicked`)}
                >
                  {capitalize(a)}
                </Button>
              </Cell>
            </Row>
          ))}
        </Table>
      </React.Fragment>
    );
  }
}
