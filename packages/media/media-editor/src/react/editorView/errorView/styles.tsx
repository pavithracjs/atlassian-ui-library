// tslint:disable:variable-name
import * as React from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import Button, { ButtonProps } from '@atlaskit/button';

export const ErrorPopup: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  width: 290px;
  padding: 16px;
  background-color: ${colors.N0};
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const ErrorIconWrapper: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  width: 92px;
`;

export const ErrorMessage: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  color: ${colors.N900};
  margin-top: 16px;
  margin-bottom: 4px;
  width: 256px;
  text-align: center;
  font-weight: bold;
`;

export const ErrorHint: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  color: ${colors.N70};
  margin-top: 4px;
  margin-bottom: 20px;
  width: 256px;
  text-align: center;
`;

export const ErrorButton = (props: ButtonProps) => (
  <Button
    {...props}
    theme={(currentTheme: any, themeProps: any) => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);
      return {
        buttonStyles: {
          ...buttonStyles,
          display: 'inline-flex',
          width: '84px',
          margin: '2px',
          justifyContent: 'center',
        },
        ...rest,
      }
    }}
  />
);
