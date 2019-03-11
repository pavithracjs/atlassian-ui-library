// @flow
// Spacing Tokens

export const gridSize = (factor: 0.25 | 0.5 | 1 | 2 | 3) => {
  return factor * 8;
};

export const spacing = {
  'grid_0.25x': gridSize(0.25),
  'grid_0.5x': gridSize(0.5),
  grid_1x: gridSize(1),
  grid_2x: gridSize(2),
  grid_3x: gridSize(3),
};

// Outline Tokens
// NOT A REFERENCE TO OUTLINE STYLE PROP
export const borderRadius = '3px';

// Do we need these?
export const scalable = 'max-width: 100%';
export const responsive = 'width: 100%';

// COLORS
// Reds
export const R50 = '#FFEBE6';
export const R75 = '#FFBDAD';
export const R100 = '#FF8F73';
export const R200 = '#FF7452';
export const R300 = '#FF5630';
export const R400 = '#DE350B';
export const R500 = '#BF2600';

// Yellows
export const Y50 = '#FFFAE6';
export const Y75 = '#FFF0B3';
export const Y100 = '#FFE380';
export const Y200 = '#FFC400';
export const Y300 = '#FFAB00';
export const Y400 = '#FF991F';
export const Y500 = '#FF8B00';

// Greens
export const G50 = '#E3FCEF';
export const G75 = '#ABF5D1';
export const G100 = '#79F2C0';
export const G200 = '#57D9A3';
export const G300 = '#36B37E';
export const G400 = '#00875A';
export const G500 = '#006644';

// Blues
export const B50 = '#DEEBFF';
export const B75 = '#B3D4FF';
export const B100 = '#4C9AFF';
export const B200 = '#2684FF';
export const B300 = '#0065FF';
export const B400 = '#0052CC';
export const B500 = '#0747A6';

// Purples
export const P50 = '#EAE6FF';
export const P75 = '#C0B6F2';
export const P100 = '#998DD9';
export const P200 = '#8777D9';
export const P300 = '#6554C0';
export const P400 = '#5243AA';
export const P500 = '#403294';

// Teals
export const T50 = '#E6FCFF';
export const T75 = '#B3F5FF';
export const T100 = '#79E2F2';
export const T200 = '#00C7E6';
export const T300 = '#00B8D9';
export const T400 = '#00A3BF';
export const T500 = '#008DA6';

// Neutrals
export const N0 = '#FFFFFF';
export const N10 = '#FAFBFC';
export const N20 = '#F4F5F7';
export const N30 = '#EBECF0';
export const N40 = '#DFE1E6';
export const N50 = '#C1C7D0';
export const N60 = '#B3BAC5';
export const N70 = '#A5ADBA';
export const N80 = '#97A0AF';
export const N90 = '#8993A4';
export const N100 = '#7A869A';
export const N200 = '#6B778C';
export const N300 = '#5E6C84';
export const N400 = '#505F79';
export const N500 = '#42526E';
export const N600 = '#344563';
export const N700 = '#253858';
export const N800 = '#172B4D';

// ATTENTION: update the tints if you update this
export const N900 = '#091E42';

// TODO: WE SHOULD GET RID OF THESE.
// Each tint is made of N900 and an alpha channel
export const N10A = 'rgba(9, 30, 66, 0.02)';
export const N20A = 'rgba(9, 30, 66, 0.04)';
export const N30A = 'rgba(9, 30, 66, 0.08)';
export const N40A = 'rgba(9, 30, 66, 0.13)';
export const N50A = 'rgba(9, 30, 66, 0.25)';
export const N60A = 'rgba(9, 30, 66, 0.31)';
export const N70A = 'rgba(9, 30, 66, 0.36)';
export const N80A = 'rgba(9, 30, 66, 0.42)';
export const N90A = 'rgba(9, 30, 66, 0.48)';
export const N100A = 'rgba(9, 30, 66, 0.54)';
export const N200A = 'rgba(9, 30, 66, 0.60)';
export const N300A = 'rgba(9, 30, 66, 0.66)';
export const N400A = 'rgba(9, 30, 66, 0.71)';
export const N500A = 'rgba(9, 30, 66, 0.77)';
export const N600A = 'rgba(9, 30, 66, 0.82)';
export const N700A = 'rgba(9, 30, 66, 0.89)';
export const N800A = 'rgba(9, 30, 66, 0.95)';


// FONTS
export const fontSize = 14;
export const fontSizeSmall = 11;
export const fontFamily = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;
export const codeFontFamily = `'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace`;

// LAYERS
// WHAT TO DO ABOUT THIS?!
export const layers100 = 100; // card
export const layers200 = 200; // dialog
export const layers300 = 300; // navigation
export const layers400 = 400; // layer
export const layers500 = 500; // blanket
export const layers510 = 510; // modal
export const layers600 = 600; // flag
export const layers700 = 700; // spotlight
export const layers800 = 800; // tooltip

// Elevation
// Cards on a board
export const e100 = `box-shadow: 0 1px 1px ${N50A}, 0 0 1px 0 ${N60A};`;
// Inline dialogs
export const e200 = `box-shadow: 0 4px 8px -2px ${N50A}, 0 0 1px ${N60A};`;
// Modals
export const e300 = `box-shadow: 0 8px 16px -4px ${N50A}, 0 0 1px ${N60A};`;
// Panels
export const e400 = `box-shadow: 0 12px 24px -6px ${N50A}, 0 0 1px ${N60A};`;
// Flag messages (notifications)
export const e500 = `box-shadow: 0 20px 32px -8px ${N50A}, 0 0 1px ${N60A};`;
