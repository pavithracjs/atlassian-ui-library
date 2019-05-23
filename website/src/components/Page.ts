import styled from 'styled-components';
import { gridSize, math } from '@atlaskit/theme';

const PageContainer = styled.main`
  width: 100vw;
  max-width: calc(640px + 4rem);
  box-sizing: border-box;
  margin: 2rem auto;
  padding: 0 2rem;
`;

export default PageContainer;

export const Title = styled.h1`
  margin-bottom: 1em;
`;

export const Section = styled.section`
  margin-top: 3em;

  p {
    line-height: 1.4em;
  }
`;

export const Intro = styled.p`
  font-size: ${math.multiply(gridSize, 2)}px;
  font-weight: 300;
  line-height: 1.4em;
`;
