import * as React from 'react';
import { ExtensionHandlers, ExtensionParams } from '@atlaskit/editor-common';

const FakeExtension = ({
  colour,
  minWidth = 85,
  children,
}: {
  colour: string;
  minWidth?: number;
  children: React.ReactChild;
}) => {
  return (
    <div
      style={{
        backgroundColor: colour,
        color: 'white',
        padding: 10,
        minWidth,
      }}
    >
      {children}
    </div>
  );
};

const InlineExtension = ({ node }: { node: ExtensionParams<any> }) => {
  return <FakeExtension colour="green">{node.content as string}</FakeExtension>;
};

class InlineAsyncExtension extends React.Component<{
  node: ExtensionParams<any>;
}> {
  state = {
    width: 85,
  };

  render() {
    const { node } = this.props;
    const { width } = this.state;
    return (
      <FakeExtension minWidth={width} colour="green">
        {node.content as string}
      </FakeExtension>
    );
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ width: 285 });
    }, 2000);
  }
}

const BlockExtension = ({ node }: { node: ExtensionParams<any> }) => {
  return (
    <FakeExtension colour="black">
      <div style={node.parameters.style}>{node.content}</div>
    </FakeExtension>
  );
};

const BodiedExtension = () => {
  return <FakeExtension colour="blue">Bodied extension demo</FakeExtension>;
};

const IFrameExtension = () => {
  return (
    <FakeExtension colour="red">
      <div>
        <div>
          <iframe style={{ background: 'blue', width: 400, height: 200 }} />
        </div>
        <iframe style={{ background: 'yellow', width: 600, height: 300 }} />
      </div>
    </FakeExtension>
  );
};

export const extensionHandlers: ExtensionHandlers = {
  'com.atlassian.confluence.macro.core': ext => {
    const { extensionKey } = ext;

    // using any here because most props are going to be injected through the extension handler
    // and typescript won't accept that as valid
    const macroProps: any = {
      node: ext,
    };

    switch (extensionKey) {
      case 'block-eh':
        return <BlockExtension {...macroProps} />;
      case 'block-layout-eh':
        return <BlockExtension {...macroProps} />;
      case 'block-iframe-eh':
        return <IFrameExtension {...macroProps} />;
      case 'bodied-eh':
        return <BodiedExtension {...macroProps} />;
      case 'inline-eh':
        return <InlineExtension {...macroProps} />;
      case 'jql-table':
        return (
          <table>
            <tbody>
              <tr>
                <td>a1</td>
                <td>a2</td>
                <td>a3</td>
              </tr>
              <tr>
                <td>b1</td>
                <td>b2</td>
                <td>b3</td>
              </tr>
              <tr>
                <td>c1</td>
                <td>c2</td>
                <td>c3</td>
              </tr>
            </tbody>
          </table>
        );
      case 'inline-async-eh':
        return <InlineAsyncExtension {...macroProps} />;
    }

    return null;
  },
  'com.atlassian.extensions.update': {
    render: ext => {
      return <div>{ext.parameters.count}</div>;
    },
    update: async params => ({
      count: params.count + 1,
    }),
  },
  'com.atlassian.extensions.noupdate': {
    render: () => {
      return <button>This is a test extension</button>;
    },
  },
};
