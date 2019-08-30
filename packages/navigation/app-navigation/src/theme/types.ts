export type ContextColors = {
  background: {
    /**
     * Color provided to the mode generator.
     */
    default: string;
    /**
     * Generated color, usually brighter. Used as nav item hover background
     */
    hint: string;
    /**
     * Generated color, gentle variation over default
     * Used as nav item active background
     */
    interact: string;
    /**
     * Generated color, either lighter or darker of default
     * Used as nav item selected background, separator background, ...
     */
    static: string;
  };
  text: {
    /**
     * Color provided to the mode generator
     */
    default: string;
    /**
     * Generated color, slighly faded out
     * Used as nav item sub text color and group headings color
     */
    subtle: string;
  };
};

// This is the shape of a theme 'mode', e.g. light, dark, settings or custom
export type AppNavigationMode = {
  primary: ContextColors;
};

export type AppNavigationTheme = {
  mode: AppNavigationMode;
  context?: string;
};
