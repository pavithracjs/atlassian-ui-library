import styled from 'styled-components';
import { sizes } from '../constants';
import { sizeOpts } from '../types';

export default styled.div<{ size?: sizeOpts; weight?: string }>`
  width: ${props => props.size && sizes[props.size]};
  height: ${props => props.size && sizes[props.size]};
  display: inline-block;
  border-radius: 50%;
  background-color: ${({ color }) => color || 'currentColor'};
  opacity: ${({ weight }) => (weight === 'strong' ? 0.3 : 0.15)};
`;
