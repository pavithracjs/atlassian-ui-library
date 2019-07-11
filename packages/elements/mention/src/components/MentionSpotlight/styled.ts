import styled from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';

export const Actions = styled.div`
  justify-content: flex-end;
`;

export const Title = styled.div``;

export const Heading = styled.div`
  margin-left: ${gridSize() * 2}px;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${colors.P50};
  padding: ${gridSize() * 1.75}px ${gridSize() * 1}px;
  overflow: hidden;
  line-height: 21px;
  padding-left: 16px;
  padding-right: 0px;
`;

export const Content = styled.div`
  max-width: 290px;
  display: flex;
`;
export const Section = styled.div``;

export const Aside = styled.div`
  opacity: 0.7;
`;

export const Body = styled.div`
  margin-left: ${gridSize() * 2}px;
`;

export const iconUrl =
  'https://ptc-directory-sited-static.us-east-1.staging.public.atl-paas.net/teams/avatars/2.svg';
