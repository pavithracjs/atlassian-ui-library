import * as React from 'react';
import styled from '@emotion/styled';
import Lorem from 'react-lorem-component';

import Button, { ButtonGroup } from '@atlaskit/button';

import ModalDialog, { ModalTransition } from '../src';

const oneLineNonBreakableString = 'one line heading without spaces';
const multiLineNonBreakableString = 'multiline heading without spaces';
const oneLineBreakableString = 'one line heading with spaces';
const multiLineBreakableString = 'multiline heading with spaces';

const variants = [
  oneLineNonBreakableString,
  oneLineBreakableString,
  multiLineNonBreakableString,
  multiLineBreakableString,
];

const variantToHeading = (variant: string) => {
  switch (variant) {
    case oneLineNonBreakableString:
    case multiLineNonBreakableString:
      return `ThisIs${'long'.repeat(20)}NonBreakableHeading`;

    case oneLineBreakableString:
    case multiLineBreakableString:
      return `This is ${'long '.repeat(20)} breakable heading`;

    default:
      return 'This should never happen';
  }
};

const variantToMultiline = (variant: string) =>
  variant in [oneLineBreakableString, oneLineNonBreakableString];

const H4 = styled.h4`
  margin-bottom: 0.66em;
`;

type State = { isOpen: string | null };
// eslint-disable-next-line react/no-multi-comp
export default class ModalDemo extends React.Component<{}, State> {
  state = { isOpen: null };

  open = (isOpen: string) => this.setState({ isOpen });

  close = (isOpen: string) => this.setState({ isOpen });

  secondaryAction = ({ target }: { [index: string]: any }) =>
    console.log(target.innerText);

  render() {
    const { isOpen } = this.state;
    const btn = (name: string) => (
      <Button key={name} onClick={() => this.open(name)}>
        {name}
      </Button>
    );
    const actions = [
      { text: 'Close', onClick: this.close },
      { text: 'Secondary Action', onClick: this.secondaryAction },
    ];

    return (
      <div style={{ padding: 16 }}>
        <H4>Variants</H4>
        <ButtonGroup>{variants.map(btn)}</ButtonGroup>

        <ModalTransition>
          {variants
            .filter(w => w === isOpen)
            .map(name => (
              <ModalDialog
                key={name}
                appearance="warning"
                actions={actions}
                heading={variantToHeading(name)}
                onClose={() => this.close(name)}
                isHeadingMultiline={variantToMultiline(name)}
                width="medium"
                {...this.props}
              >
                <Lorem count="5" />
              </ModalDialog>
            ))}
        </ModalTransition>
      </div>
    );
  }
}
