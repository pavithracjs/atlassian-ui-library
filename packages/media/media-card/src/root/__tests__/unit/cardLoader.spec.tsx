import * as React from 'react';
import { mount } from 'enzyme';
import CardLoader from '../../card/cardLoader';
import { CardLoading } from '../../..';

describe('CardLoader', () => {
  it('should pass dimensions to the loading component', () => {
    const dimensions = {
      width: 10,
      height: 10,
    };
    const context = {} as any;
    const identifier = {} as any;

    const component = mount(
      <CardLoader
        context={context}
        identifier={identifier}
        dimensions={dimensions}
      />,
    );

    expect(component.find(CardLoading).props()['dimensions']).toEqual(
      dimensions,
    );
  });
});
