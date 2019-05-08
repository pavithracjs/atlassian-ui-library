import * as React from 'react';
import { md, code, Example, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`

${(
  <SectionMessage appearance="warning">
    <p>
      <strong>
        Note: @atlaskit/help-panel is currently a developer preview.
      </strong>
    </p>
    <p>
      Please experiment with and test this package, but be aware that the API
      may change at any time. Use at your own risk, preferrably not in
      production.
    </p>
  </SectionMessage>
)}


  ## Usage

  ${code`
  import * as React from 'react';

  import HelpArticle from '../src';

  export default class extends React.Component {
    render() {
      return (
        <HelpArticle
          title="Article Title"
          body="Quisque eros orci, sagittis vitae augue eget, ultrices varius dolor. Nunc mi leo, accumsan id massa nec, commodo placerat libero. Phasellus ullamcorper ligula facilisis massa tempor auctor. Praesent malesuada, eros sit amet posuere rutrum, justo ex tempor dui, at suscipit metus lacus non dui. Phasellus vehicula urna eu rhoncus sagittis. Integer at risus molestie, rutrum nibh nec, vehicula lacus. Nulla mollis dictum felis vitae facilisis. Nam faucibus non orci eget gravida."
        />
      );
    }
  }
  
  `}

  ${(
    <Example
      Component={require('../examples/1-Help-article').default}
      title="Help Article"
      source={require('!!raw-loader!../examples/1-Help-article')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/HelpArticle')}
    />
  )}
`;
