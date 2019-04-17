import * as React from 'react';
import { shallow } from 'enzyme';
import TableHeader from '../../../../react/nodes/tableHeader';

describe('Renderer - React/Nodes/TableHeader', () => {
  const baseProps = {
    colspan: 6,
    rowspan: 3,
    background: '#fab',
    colwidth: [10],
  };

  it('should create a <th>-tag', () => {
    const tableHeader = shallow(<TableHeader />);
    expect(tableHeader.name()).toEqual('th');
  });

  it('should render the <th> props', () => {
    const tableHeader = shallow(<TableHeader {...baseProps} />);
    expect(tableHeader.name()).toEqual('th');

    expect(tableHeader.prop('rowSpan')).toEqual(3);
    expect(tableHeader.prop('colSpan')).toEqual(6);
    expect(tableHeader.prop('data-colwidth')).toEqual('10');

    expect(tableHeader.prop('style')).toEqual({
      backgroundColor: '#fab',
    });
  });

  it('should render the colwidths', () => {
    const colwidth = [10, 12, 14];
    const tableRow = shallow(<TableHeader colwidth={colwidth} />);

    expect(tableRow.prop('data-colwidth')).toEqual('10,12,14');
  });
});
