import styled from 'styled-components';
import {
  onClickStyle,
  truncateStyle,
  cellStyle,
  StyleProps,
} from './constants';

export const TableBodyCell = styled.td`
  ${(props: StyleProps) => onClickStyle(props)} ${props =>
  truncateStyle(props)} ${cellStyle};
`;
