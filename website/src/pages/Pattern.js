// @flow
import React from 'react';
import { Redirect } from 'react-router-dom';
import * as fs from '../utils/fs';
import type { Directory } from '../types';
import Page from '../components/Page';
import FourOhFour from './FourOhFour';
import Loading from '../components/Loading';
import Loadable from 'react-loadable';

type Props = {
  patterns: Directory,
  patternId: string,
};

export default function Pattern(props: Props) {
  const filePath = `patterns/${props.patternId}`;
  const found = fs.findNormalized(props.patterns, filePath);

  if (!found) {
    return <FourOhFour/>;
  }

  const Content = Loadable({
    loader: () => found && found.exports(),
    loading: Loading,
    render(mod) {
      if (mod && mod.default) {
        return React.createElement(mod.default);
      } else {
        return <FourOhFour/>;
      }
    }
  });

  return (
    <Page>
      <Content/>
    </Page>
  );
};
