import * as React from 'react';
import Button from '../styled/Button';
import ItemWrapper from '../styled/BreadcrumbsItem';
import Separator from '../styled/Separator';

interface IProps {
  hasSeparator?: boolean;
  onClick?: (event: React.MouseEvent) => any;
}

export default class EllipsisItem extends React.Component<IProps, {}> {
  static defaultProps: IProps = {
    hasSeparator: false,
    onClick: () => {},
  };

  render() {
    return (
      <ItemWrapper>
        <Button
          appearance="subtle-link"
          spacing="none"
          onClick={this.props.onClick}
        >
          &hellip;
        </Button>
        {this.props.hasSeparator ? <Separator>/</Separator> : null}
      </ItemWrapper>
    );
  }
}
/* eslint-enable react/prefer-stateless-function */
