import testDataNumeric from './_dataNumeric-json.json';

export const sortKey = 'first_name';
export const numericSortKey = 'numeric';

// Numeric data
export const headNumeric = {
  cells: [
    { key: sortKey, content: 'first name', isSortable: true },
    { key: numericSortKey, content: 'Arbitrary numeric', isSortable: true },
  ],
};

export const rowsNumeric = testDataNumeric;

export const rowsNumericWithKeys: Array<
  object & { key: string; cells: any[] }
> = rowsNumeric.map((tRow: any, rowIndex: any) => {
  return {
    key: `${rowIndex}`,
    ...tRow,
  };
});

export const rowNumericWithKey = rowsNumericWithKeys[0];

export const cellNumericWithKey = rowNumericWithKey.cells[0];
