import { PureComponent } from 'react';

interface State {};
interface Props {
  label: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  onClick?: (e: MouseEvent) => void;
  primaryColor?: string;
  secondaryColor?: string;
  isHovered?: boolean;
  isActive?: boolean;
};

export default class extends PureComponent<Props, State> {}
