import * as React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import EditorUnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';
import { InjectedIntl, InjectedIntlProps } from 'react-intl';
import PanelTextInput from '../../../ui/PanelTextInput';
import Button from '../../floating-toolbar/ui/Button';
import Separator from '../../floating-toolbar/ui/Separator';
import {
  Container,
  UrlInputWrapper,
} from '../../../ui/RecentSearch/ToolbarComponents';
import RecentSearch from '../../../ui/RecentSearch';
import {
  ChildProps,
  RecentSearchSubmitOptions,
  RecentSearchInputTypes,
} from '../../../ui/RecentSearch/types';
import { linkToolbarMessages } from '../../../messages';

// Common Translations will live here
import { defineMessages } from 'react-intl';

export const mediaLinkToolbarMessages = defineMessages({
  backLink: {
    id: 'fabric.editor.backLink',
    defaultMessage: 'Go back',
    description: 'Go back from media linking toolbar to main toolbar',
  },
});

export interface Props {
  intl: InjectedIntl;
  providerFactory: ProviderFactory;
  editing: boolean;
  onBack: (url: string, meta: { inputMethod?: RecentSearchInputTypes }) => void;
  onUnlink: () => void;
  onCancel: () => void;
  onBlur: (href: string) => void;
  onSubmit: (
    href: string,
    meta: { inputMethod: RecentSearchInputTypes },
  ) => void;
  displayUrl?: string;
}

export class LinkAddToolbar extends React.PureComponent<
  Props & InjectedIntlProps
> {
  private handleSubmit = ({ url, inputMethod }: RecentSearchSubmitOptions) => {
    this.props.onSubmit(url, { inputMethod });
  };

  private handleOnBack = ({
    url,
    inputMethod,
  }: {
    url: string;
    inputMethod?: RecentSearchInputTypes;
  }) => {
    const { onBack } = this.props;
    if (onBack) {
      onBack(url, { inputMethod });
    }
  };

  private handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  private handleUnlink = () => {
    const { onUnlink } = this.props;
    if (onUnlink) {
      onUnlink();
    }
  };

  private handleOnBlur = (options: RecentSearchSubmitOptions) => {
    this.props.onBlur(options.url);
  };

  private renderContainer = ({
    activityProvider,
    inputProps: { onChange, onKeyDown, onSubmit, value },
    currentInputMethod,
    renderRecentList,
  }: ChildProps) => {
    const {
      intl: { formatMessage },
      displayUrl,
    } = this.props;
    const getPlaceholder = (hasActivityProvider: boolean) =>
      formatMessage(
        hasActivityProvider
          ? linkToolbarMessages.placeholder
          : linkToolbarMessages.linkPlaceholder,
      );

    const formatLinkAddressText = formatMessage(
      mediaLinkToolbarMessages.backLink,
    );
    const formatUnlinkText = formatMessage(linkToolbarMessages.unlink);
    return (
      <div className="recent-list">
        <Container provider={!!activityProvider}>
          <UrlInputWrapper>
            <Button
              title={formatLinkAddressText}
              icon={<ChevronLeftLargeIcon label={formatLinkAddressText} />}
              onClick={() =>
                this.handleOnBack({
                  url: value,
                  inputMethod: currentInputMethod,
                })
              }
            />
            <PanelTextInput
              placeholder={getPlaceholder(!!activityProvider)}
              onSubmit={onSubmit}
              autoFocus={true}
              onCancel={this.handleCancel}
              defaultValue={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
            />
            {displayUrl && (
              <>
                <Separator />
                <Button
                  title={formatUnlinkText}
                  icon={<EditorUnlinkIcon label={formatUnlinkText} />}
                  onClick={this.handleUnlink}
                />
              </>
            )}
          </UrlInputWrapper>
          {renderRecentList()}
        </Container>
      </div>
    );
  };

  render() {
    const { providerFactory, displayUrl } = this.props;

    return (
      <RecentSearch
        defaultUrl={displayUrl}
        providerFactory={providerFactory}
        onSubmit={this.handleSubmit}
        onBlur={this.handleOnBlur}
        render={this.renderContainer}
      />
    );
  }
}

export default LinkAddToolbar;
