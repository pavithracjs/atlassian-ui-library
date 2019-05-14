import * as React from 'react';
import { shallow } from 'enzyme';
import { CardLoading } from '../../..';
import CardLoader from '../../card/cardLoader';

describe('CardLoader', () => {
  it('should pass dimensions to the loading component', () => {
    const dimensions = {
      width: 10,
      height: 10,
    };
    const mediaClient = {} as any;
    const identifier = {} as any;
    const component = shallow(
      <CardLoader
        mediaClient={mediaClient}
        identifier={identifier}
        dimensions={dimensions}
      />,
    );

    expect(component.find(CardLoading).prop('dimensions')).toEqual(dimensions);
  });
});
