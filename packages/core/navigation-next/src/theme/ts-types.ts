type Size = 'large' | 'small';

// Fixme - move to global types
type GlobalItemPresentationProps = {
  /** Whether the Item is currently in the 'active' interaction state. */
  isActive: boolean;
  /** Whether the Item is currently in the 'select' interaction state. */
  isSelected: boolean;
  /** Whether the Item is currently in the 'hover' interaction state. */
  isHover: boolean;
  /** Whether the Item is currently in the 'focused' interaction state. */
  isFocused: boolean;
  /** The size of the GlobalItem. */
  size: Size;
};

// Fixme - move to global types
export type GlobalNavigationComponentTheme<
  Props extends {} | void,
  Styles extends {}
> = (props: Props) => Styles;

// Fixme - move to global types
type GlobalItemStyles = {
  itemBase: { [key: string]: any };
  badgeWrapper: { [key: string]: any };
  itemWrapper: { [key: string]: any };
};

// Fixme - move to item types
type Spacing = 'compact' | 'default';

// Fixme - move to item types
export type ItemPresentationProps = {
  /** Whether the Item is currently in the 'active' interaction state. */
  isActive: boolean;
  /** Whether the Item is inside a SortableContext, and is being dragged. */
  isDragging?: boolean;
  /** Whether the Item is currently in the 'hover' interaction state. */
  isHover: boolean;
  /** Whether the Item should display as being selected. */
  isSelected: boolean;
  /** Whether the Item is currently in the 'focus' interaction state. */
  isFocused: boolean;
  /** How tight the spacing between the elements inside the Item should be. */
  spacing: Spacing;
};

export type SectionPresentationProps = {
  /** Whether to always render the shadow at the top of the section to indicate
   * that the container can be scrolled up. This can be used to create a
   * consistent visual distinction between this section and the one above it.
   * This prop is only applied if shouldGrow = true, since it only applies to
   * sections which can scroll. */
  alwaysShowScrollHint: boolean;
};

type ObjectType = { [key: string]: any };

type ContentNavigationComponentThemeObject = {
  container: ObjectType;
  product: ObjectType;
};

type ContentNavigationComponentTheme<Props extends {} | void> = (
  props: Props,
) => ContentNavigationComponentThemeObject;

export type Mode = {
  // Allow GlobalItemPresentationProps to be optional, need to spread it into an
  // object type since $Shape allows void/undefined instead of always enforcing an object
  globalItem: GlobalNavigationComponentTheme<
    Partial<GlobalItemPresentationProps>,
    GlobalItemStyles
  >;
  globalNav: GlobalNavigationComponentTheme<void, {}>;
  heading: ContentNavigationComponentTheme<void>;
  item: ContentNavigationComponentTheme<ItemPresentationProps>;
  contentNav: ContentNavigationComponentTheme<void>;
  section: ContentNavigationComponentTheme<SectionPresentationProps>;
  separator: ContentNavigationComponentTheme<void>;
  skeletonItem: ContentNavigationComponentTheme<void>;
};

export type GlobalTheme = {
  mode: Mode;
  context?: string;
  topOffset?: string;
};

export type ProductTheme = {
  mode: Mode;
  context: string;
};

export type Theme = GlobalTheme | ProductTheme | void;

export type WithThemeProps = {
  theme: Theme;
};

export type StyleReducer = (
  Styles: ObjectType,
  State?: ObjectType,
  Theme?: ProductTheme,
) => ObjectType;

export type ContextColors = {
  background: {
    /**
     * Color provided to the mode generator */
    default: string;
    /**
     * Generated color, usually brighter
     * Used as nav item hover background */
    hint: string;
    /**
     * Generated color, gentle variation over default
     * Used as nav item active background */
    interact: string;
    /**
     * Generated color, either lighter or darker of default
     * Used as nav item selected background, separator background, ... */
    static: string;
  };
  text: {
    /**
     * Color provided to the mode generator */
    default: string;
    /**
     * Generated color, slighly faded out
     * Used as nav item sub text color and group headings color */
    subtle: string;
  };
};

export type ModeColors = {
  product: ContextColors;
};
