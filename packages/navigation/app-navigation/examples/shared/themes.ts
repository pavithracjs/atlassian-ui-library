import { darkTheme, generateTheme, lightTheme } from '../../src';

const customThemes = [
  // White
  generateTheme({
    primary: {
      backgroundColor: '#ffffff',
      color: '#000000',
    },
  }),
  // Red
  generateTheme({
    primary: {
      backgroundColor: '#ff3e15',
      color: '#ffffff',
    },
  }),
  // Orange
  generateTheme({
    primary: {
      backgroundColor: '#ff8c19',
      color: '#ffffff',
    },
  }),
  // Yellow
  generateTheme({
    primary: {
      backgroundColor: '#ffff00',
      color: '#000000',
    },
  }),
  // Green
  generateTheme({
    primary: {
      backgroundColor: '#0fdc60',
      color: '#ffffff',
    },
  }),
  // Blue
  generateTheme({
    primary: {
      backgroundColor: '#3babfd',
      color: '#ffffff',
    },
  }),
  // Violet
  generateTheme({
    primary: {
      backgroundColor: '#4f1c82',
      color: '#ffffff',
    },
  }),
  // Pink
  generateTheme({
    primary: {
      backgroundColor: '#fec8d8',
      color: '#000000',
    },
  }),
];

export const themes = [lightTheme, darkTheme, ...customThemes];
