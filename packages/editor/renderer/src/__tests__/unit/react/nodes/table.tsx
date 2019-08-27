import * as React from 'react';
import { mount } from 'enzyme';
import {
  akEditorTableNumberColumnWidth,
  akEditorDefaultLayoutWidth,
  akEditorTableLegacyCellMinWidth as tableCellMinWidth,
  SortOrder,
} from '@atlaskit/editor-common';
import { defaultSchema as schema } from '@atlaskit/adf-schema';
import Table, {
  calcScalePercent,
  TableContainer,
} from '../../../../react/nodes/table';
import { TableCell, TableHeader } from '../../../../react/nodes/tableCell';
import TableRow from '../../../../react/nodes/tableRow';

describe('Renderer - React/Nodes/Table', () => {
  const renderWidth = akEditorDefaultLayoutWidth;

  it('should render table DOM with all attributes', () => {
    const table = mount(
      <Table
        layout="full-width"
        isNumberColumnEnabled={true}
        renderWidth={renderWidth}
      >
        <TableRow>
          <TableCell />
        </TableRow>
      </Table>,
    );
    expect(table.find('table')).toHaveLength(1);
    expect(table.find('div[data-layout="full-width"]')).toHaveLength(1);
    expect(table.find('table').prop('data-number-column')).toEqual(true);
  });

  it('should render table props', () => {
    const columnWidths = [100, 110, 120];

    const table = mount(
      <Table
        layout="default"
        isNumberColumnEnabled={true}
        columnWidths={columnWidths}
        renderWidth={renderWidth}
      >
        <TableRow>
          <TableCell />
        </TableRow>
      </Table>,
    );

    expect(table.prop('layout')).toEqual('default');
    expect(table.prop('isNumberColumnEnabled')).toEqual(true);
    expect(table.prop('columnWidths')).toEqual(columnWidths);
    expect(table.find(TableRow).prop('isNumberColumnEnabled')).toEqual(true);
  });

  it('should NOT render a colgroup when columnWidths is an empty array', () => {
    const columnWidths: Array<number> = [];

    const table = mount(
      <Table
        layout="default"
        isNumberColumnEnabled={true}
        columnWidths={columnWidths}
        renderWidth={renderWidth}
      >
        <TableRow>
          <TableCell />
          <TableCell />
          <TableCell />
        </TableRow>
      </Table>,
    );

    expect(table.find('colgroup')).toHaveLength(0);
  });

  it('should NOT render a colgroup when columnWidths is an array of zeros', () => {
    const columnWidths: Array<number> = [0, 0, 0];

    const table = mount(
      <Table
        layout="default"
        isNumberColumnEnabled={true}
        columnWidths={columnWidths}
        renderWidth={renderWidth}
      >
        <TableRow>
          <TableCell />
          <TableCell />
          <TableCell />
        </TableRow>
      </Table>,
    );

    expect(table.find('colgroup')).toHaveLength(0);
  });

  it('should render children', () => {
    const table = mount(
      <Table
        layout="default"
        isNumberColumnEnabled={true}
        renderWidth={renderWidth}
      >
        <TableRow>
          <TableCell />
          <TableCell />
        </TableRow>
      </Table>,
    );

    expect(table.prop('layout')).toEqual('default');
    expect(table.prop('isNumberColumnEnabled')).toEqual(true);
    expect(table.find(TableRow)).toHaveLength(1);
    expect(table.find(TableCell)).toHaveLength(2);
  });

  describe('When number column is enabled', () => {
    describe('When header row is enabled', () => {
      it('should start numbers from the second row', () => {
        const table = mount(
          <Table
            layout="default"
            isNumberColumnEnabled={true}
            renderWidth={renderWidth}
          >
            <TableRow>
              <TableHeader />
              <TableHeader />
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
            </TableRow>
          </Table>,
        );

        table.find('tr').forEach((row, index) => {
          expect(
            row
              .find('td')
              .at(0)
              .text(),
          ).toEqual(index === 0 ? '' : `${index}`);
        });
      });
    });
    describe('When header row is disabled', () => {
      it('should start numbers from the first row', () => {
        const table = mount(
          <Table
            layout="default"
            isNumberColumnEnabled={true}
            renderWidth={renderWidth}
          >
            <TableRow>
              <TableCell />
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
            </TableRow>
          </Table>,
        );

        table.find('tr').forEach((row, index) => {
          expect(
            row
              .find('td')
              .at(0)
              .text(),
          ).toEqual(`${index + 1}`);
        });
      });
    });
    it('should add an extra <col> node for number column', () => {
      const columnWidths = [300, 380];
      const resultingColumnWidths = [282, 357];
      const table = mount(
        <Table
          layout="default"
          isNumberColumnEnabled={true}
          columnWidths={columnWidths}
          renderWidth={renderWidth}
        >
          <TableRow>
            <TableCell />
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell />
          </TableRow>
        </Table>,
      );
      expect(table.find('col')).toHaveLength(3);

      table.find('col').forEach((col, index) => {
        if (index === 0) {
          expect(col.prop('style')!.width).toEqual(
            akEditorTableNumberColumnWidth,
          );
        } else {
          expect(col.prop('style')!.width).toEqual(
            `${resultingColumnWidths[index - 1]}px`,
          );
        }
      });
    });
  });

  describe('When number column is disabled', () => {
    it('should not add an extra <col> node for number column', () => {
      const columnWidths = [300, 380];
      const table = mount(
        <Table
          layout="default"
          isNumberColumnEnabled={false}
          columnWidths={columnWidths}
          renderWidth={renderWidth}
        >
          <TableRow>
            <TableCell />
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell />
          </TableRow>
        </Table>,
      );
      expect(table.find('col')).toHaveLength(2);

      table.find('col').forEach((col, index) => {
        expect(col.prop('style')!.width).toEqual(
          `${columnWidths[index] - 1}px`,
        );
      });
    });
  });

  describe('When multiple columns do not have width', () => {
    describe('when renderWidth is smaller than table minimum allowed width', () => {
      it('should add minWidth to zero width columns', () => {
        const columnWidths = [220, 220, 0, 0];

        const table = mount(
          <Table
            layout="default"
            isNumberColumnEnabled={true}
            columnWidths={columnWidths}
            renderWidth={renderWidth}
          >
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </Table>,
        );
        table.setProps({ isNumberColumnEnabled: false });

        expect(table.find('col')).toHaveLength(4);

        table.find('col').forEach((col, index) => {
          if (index < 2) {
            expect(col.prop('style')!.width).toEqual(
              `${columnWidths[index] - 1}px`,
            );
          } else {
            expect(col.prop('style')!.width).toEqual(`${tableCellMinWidth}px`);
          }
        });
      });
    });
    describe('when renderWidth is greater than table minimum allowed width', () => {
      it('should not add minWidth to zero width columns', () => {
        const columnWidths = [200, 200, 0, 0];

        const table = mount(
          <Table
            layout="default"
            isNumberColumnEnabled={true}
            columnWidths={columnWidths}
            renderWidth={renderWidth}
          >
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </Table>,
        );
        table.setProps({ isNumberColumnEnabled: false });

        expect(table.find('col')).toHaveLength(4);

        table.find('col').forEach((col, index) => {
          if (index < 2) {
            expect(col.prop('style')!.width).toEqual(
              `${columnWidths[index] - 1}px`,
            );
          } else {
            expect(typeof col.prop('style')!.width).toEqual('undefined');
          }
        });
      });
    });
  });

  describe('when renderWidth is 10% lower than table width', () => {
    it('should scale down columns widths by 10%', () => {
      const columnWidths = [200, 200, 280];

      const table = mount(
        <Table
          layout="default"
          isNumberColumnEnabled={false}
          columnWidths={columnWidths}
          renderWidth={612}
        >
          <TableRow>
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
        </Table>,
      );

      expect(table.find('col')).toHaveLength(3);
      table.find('col').forEach((col, index) => {
        const width = columnWidths[index] - columnWidths[index] * 0.1;
        expect(col.prop('style')!.width).toEqual(`${width}px`);
      });
    });
  });

  describe('when renderWidth is 20% lower than table width', () => {
    it('should scale down columns widths by 15% and then overflow', () => {
      const columnWidths = [200, 200, 280];

      const table = mount(
        <Table
          layout="default"
          isNumberColumnEnabled={false}
          columnWidths={columnWidths}
          renderWidth={578}
        >
          <TableRow>
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
        </Table>,
      );

      expect(table.find('col')).toHaveLength(3);
      table.find('col').forEach((col, index) => {
        const width = columnWidths[index] - columnWidths[index] * 0.15;
        expect(col.prop('style')!.width).toEqual(`${width}px`);
      });
    });
  });

  describe('tables created when dynamic text sizing is enabled', () => {
    it('should scale down columns widths that were created at a large breakpoint.', () => {
      const columnWidths = [81, 425, 253];

      const table = mount(
        <Table
          layout="default"
          isNumberColumnEnabled={false}
          columnWidths={columnWidths}
          allowDynamicTextSizing={true}
          renderWidth={847}
        >
          <TableRow>
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
        </Table>,
      );

      expect(table.find('col')).toHaveLength(3);
      // Render width is 680 here since the layout is default, we use that over the actual render width for calculations.
      const scale = calcScalePercent({
        renderWidth: 680,
        tableWidth: 759,
        maxScale: 0.15,
      });
      table.find('col').forEach((col, index) => {
        const width = Math.floor(
          columnWidths[index] - columnWidths[index] * scale,
        );
        expect(col.prop('style')!.width).toEqual(`${width}px`);
      });
    });
  });

  describe('tables created when allowColumnSorting is enabled', () => {
    const tableDoc = {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: true,
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Header content 1',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Header content 2',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Header content 3',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Body content 1',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Body content 2',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Body content 3',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const tableDocWithMergedCell = {
      type: 'table',
      attrs: {
        isNumberColumnEnabled: true,
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Header content 1',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Header content 2',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableHeader',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Header content 3',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Body content 1',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Body content 2',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    it('should add sortable props to first table row', () => {
      const tableFromSchema = schema.nodeFromJSON(tableDoc);

      const wrap = mount(
        <Table
          layout="default"
          renderWidth={renderWidth}
          allowColumnSorting={true}
          tableNode={tableFromSchema}
          isNumberColumnEnabled={false}
        >
          <TableRow>
            <TableHeader />
            <TableHeader />
            <TableHeader />
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
        </Table>,
      );

      const container = wrap.find(TableContainer).instance();

      container.setState({
        tableOrderStatus: { columnIndex: 0, sortOrdered: SortOrder.ASC },
      });
      wrap.update();

      const firstRowProps = wrap
        .find(TableRow)
        .first()
        .props();
      expect(firstRowProps.tableOrderStatus).toEqual({
        columnIndex: 0,
        sortOrdered: SortOrder.ASC,
      });
      expect(typeof firstRowProps.onSorting).toBe('function');
    });

    describe('when header row is not enabled', () => {
      it('should not add sortable props to the first table row', () => {
        const tableFromSchema = schema.nodeFromJSON(tableDoc);

        const wrap = mount(
          <Table
            layout="default"
            renderWidth={renderWidth}
            allowColumnSorting={true}
            tableNode={tableFromSchema}
            isNumberColumnEnabled={false}
          >
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </Table>,
        );

        const container = wrap.find(TableContainer).instance();

        container.setState({
          tableOrderStatus: { columnIndex: 0, sortOrdered: SortOrder.ASC },
        });
        wrap.update();

        const firstRowProps = wrap
          .find(TableRow)
          .first()
          .props();
        expect(firstRowProps.tableOrderStatus).toBeUndefined();
        expect(firstRowProps.onSorting).toBeUndefined();
      });
    });

    describe('when there is merged cell on table', () => {
      it('should not add sortable props to the first table row', () => {
        const tableFromSchema = schema.nodeFromJSON(tableDocWithMergedCell);

        const wrap = mount(
          <Table
            layout="default"
            renderWidth={renderWidth}
            allowColumnSorting={true}
            tableNode={tableFromSchema}
            isNumberColumnEnabled={false}
          >
            <TableRow>
              <TableHeader />
              <TableHeader />
              <TableHeader />
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
            </TableRow>
          </Table>,
        );

        const container = wrap.find(TableContainer).instance();

        container.setState({
          tableOrderStatus: { columnIndex: 0, sortOrdered: SortOrder.ASC },
        });
        wrap.update();

        const firstRowProps = wrap
          .find(TableRow)
          .first()
          .props();
        expect(firstRowProps.tableOrderStatus).toBeUndefined();
        expect(firstRowProps.onSorting).toBeUndefined();
      });
    });

    describe('when there is no tableNode', () => {
      it('should not add sortable props to the first table row', () => {
        const wrap = mount(
          <Table
            layout="default"
            renderWidth={renderWidth}
            allowColumnSorting={true}
            isNumberColumnEnabled={false}
          >
            <TableRow>
              <TableHeader />
              <TableHeader />
              <TableHeader />
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </Table>,
        );

        const container = wrap.find(TableContainer).instance();

        container.setState({
          tableOrderStatus: { columnIndex: 0, sortOrdered: SortOrder.ASC },
        });
        wrap.update();

        const firstRowProps = wrap
          .find(TableRow)
          .first()
          .props();
        expect(firstRowProps.tableOrderStatus).toBeUndefined();
        expect(firstRowProps.onSorting).toBeUndefined();
      });
    });
  });
});
