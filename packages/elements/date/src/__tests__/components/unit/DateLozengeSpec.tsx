import { resolveColors } from '../../../components/DateLozenge';
import { colors } from '@atlaskit/theme';

describe('resolveColors', () => {
  it('return default colors', () => {
    expect(resolveColors()).toEqual({
      light: [colors.N30A, colors.N800, colors.N40],
      dark: [colors.DN70, colors.DN800, colors.DN60],
    });
  });

  it('return red colors', () => {
    expect(resolveColors('red').light).toEqual([
      colors.R50,
      colors.R500,
      colors.R75,
    ]);
  });

  it('return blue colors', () => {
    expect(resolveColors('blue').light).toEqual([
      colors.B50,
      colors.B500,
      colors.B75,
    ]);
  });

  it('return green colors', () => {
    expect(resolveColors('green').light).toEqual([
      colors.G50,
      colors.G500,
      colors.G75,
    ]);
  });

  it('return purple colors', () => {
    expect(resolveColors('purple').light).toEqual([
      colors.P50,
      colors.P500,
      colors.P75,
    ]);
  });

  it('return yellow colors', () => {
    expect(resolveColors('yellow').light).toEqual([
      colors.Y50,
      colors.Y500,
      colors.Y75,
    ]);
  });
});
