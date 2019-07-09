import styled from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';

export const Actions = styled.div`
  justify-content: flex-end;
`;

export const Title = styled.div`
  flex: auto;
`;

export const Heading = styled.div`
  flex-direction: row;
  display: flex;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${colors.P50};
  padding: ${gridSize() * 1.75}px;
`;

export const Section = styled.div`
  flex-direction: column;
`;

export const Aside = styled.div`
  flex-direction: column;
  margin-right: ${gridSize() * 1}px;
  opacity: 0.7;
`;

export const Body = styled.div`
  flex-direction: column;
`;

export const iconUrl =
  'https://ptc-directory-sited-static.us-east-1.staging.public.atl-paas.net/teams/avatars/2.svg';
