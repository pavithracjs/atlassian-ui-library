import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Button from '@atlaskit/button';
import { FormattedMessage } from 'react-intl';
import { messages } from '@atlaskit/media-ui';
import { startFileBrowser } from '../../../actions/startFileBrowser';
import { State } from '../../../domain';
import { BrowserReact } from '../../../../components/browserReact';

export interface LocalBrowserButtonProps {
  readonly browserRef: React.RefObject<BrowserReact>;
}

export interface LocalBrowserButtonDispatchProps {
  onClick: () => void;
}

export type Props = LocalBrowserButtonProps & LocalBrowserButtonDispatchProps;

export class LocalBrowserButton extends React.Component<Props> {
  private onUploadClick = (): void => {
    const { browserRef, onClick } = this.props;

    onClick();

    if (browserRef.current) {
      browserRef.current.browse();
    }
  };

  render() {
    const { browserRef } = this.props;
    // const browser = renderBrowser();

    return (
      <Button
        className="e2e-upload-button"
        appearance="default"
        onClick={this.onUploadClick}
        isDisabled={!browserRef} // TODO: why is this needed when mpBrowser/renderBrowser is a required prop?
      >
        <FormattedMessage {...messages.upload_file} />
        {/* {renderBrowser()} */}
      </Button>
    );
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<State>,
): LocalBrowserButtonDispatchProps => ({
  onClick: () => dispatch(startFileBrowser()),
});

export default connect<
  {},
  LocalBrowserButtonDispatchProps,
  LocalBrowserButtonProps
>(
  null,
  mapDispatchToProps,
)(LocalBrowserButton);
