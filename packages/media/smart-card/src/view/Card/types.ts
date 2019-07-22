export type CardAppearance = 'inline' | 'block';

type BaseCardProps = {
  appearance: CardAppearance;
  isSelected?: boolean;
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  importer?: (target: any) => void;
  container?: HTMLElement;
  onResolve?: (data: { url?: string; title?: string }) => void;
};

export type CardWithData = BaseCardProps & {
  data: any;
};

export type CardWithUrl = BaseCardProps & {
  url: string;
};

export type CardProps = CardWithUrl | CardWithData;
