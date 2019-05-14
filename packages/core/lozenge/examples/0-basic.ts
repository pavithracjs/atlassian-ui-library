/** @jsx jsx */
import { jsx } from '@emotion/core';
import Lozenge from '../src';

const Row = ({ children }) => <div css={{ display: 'flex' }}>{children}</div>;

const Col = ({ children }) => <div css={{ flex: '1 1 auto' }}>{children}</div>;

const Hr = () => (
  <div css={{ height: '1px', backgroundColor: '#ddd', margin: '2em 0' }} />
);

const APPEARANCES = [
  { label: 'Default', value: 'default' },
  { label: 'Success', value: 'success' },
  { label: 'Removed', value: 'removed' },
  { label: 'In Progress', value: 'inprogress' },
  { label: 'New', value: 'new' },
  { label: 'Moved', value: 'moved' },
];

export default () => (
  <div>
    <Row>
      <Col>
        <p>Subtle</p>
        {APPEARANCES.map(a => (
          <p key={a.value}>
            <Lozenge appearance={a.value}>{a.label}</Lozenge>
          </p>
        ))}
      </Col>
      <Col>
        <p>Bold</p>
        {APPEARANCES.map(a => (
          <p key={a.value}>
            <Lozenge appearance={a.value} isBold>
              {a.label}
            </Lozenge>
          </p>
        ))}
      </Col>
    </Row>

    <Hr />

    <p>Overflowed Lozenge</p>
    <p>
      <Lozenge>Long text will be truncated after a point.</Lozenge>
    </p>
  </div>
);
