import * as React from 'react';
import Lorem from 'react-lorem-component';
import Button, { ButtonGroup } from '@atlaskit/button';
import Modal, { ModalTransition, ModalAppearances } from '../src';

const appearances: ModalAppearances[] = ['warning', 'danger'];

export default class ExampleAppearance extends React.PureComponent<
  {},
  { isOpen: string | null }
> {
  state = { isOpen: null };

  open = (isOpen: string) => this.setState({ isOpen });

  close = () => this.setState({ isOpen: null });

  secondaryAction = ({ target }: any) => console.log(target.innerText);

  render() {
    const { isOpen } = this.state;
    const actions = [
      { text: 'Close', onClick: this.close },
      { text: 'Secondary Action', onClick: this.secondaryAction },
    ];

    return (
      <div>
        <ButtonGroup>
          {appearances.map(name => (
            <Button key={`${name}-trigger`} onClick={() => this.open(name)}>
              Open: {name}
            </Button>
          ))}
        </ButtonGroup>

        <ModalTransition>
          {appearances
            .filter(a => a === isOpen)
            .map(name => (
              <Modal
                key="active-modal"
                actions={actions}
                appearance={name}
                onClose={this.close}
                heading={`Modal: ${name}`}
              >
                <Lorem count={2} />
              </Modal>
            ))}
        </ModalTransition>
      </div>
    );
  }
}
