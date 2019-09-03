import { default as emotionStyled, CreateStyled } from '@emotion/styled';
import { AppNavigationTheme } from './types';

export const styled = emotionStyled as CreateStyled<AppNavigationTheme>;
