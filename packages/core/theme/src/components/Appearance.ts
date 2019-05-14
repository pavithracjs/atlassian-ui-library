// TODO: TS no index signature for Props['theme']

type LooseObject = {
  [key: string]: any;
};

type Props = {
  children: Function;
  props: LooseObject | string;
  theme: LooseObject;
};

export default ({ children, props, theme }: Props) => {
  const appearance = typeof props === 'object' ? 'default' : props;
  const merged = typeof props === 'object' ? { ...props } : {};
  Object.keys(theme).forEach(key => {
    if (!(key in merged)) {
      merged[key] = theme[key]({ appearance });
    }
  });
  return children(merged);
};
