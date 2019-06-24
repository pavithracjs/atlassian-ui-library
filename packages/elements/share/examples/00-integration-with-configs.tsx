import Select from '@atlaskit/select';
import { ToggleStateless as Toggle } from '@atlaskit/toggle';
import { OptionData } from '@atlaskit/user-picker';
import { userPickerData } from '@atlaskit/util-data-test';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import styled from 'styled-components';
import App from '../example-helpers/AppWithFlag';
import RestrictionMessage from '../example-helpers/RestrictionMessage';
import { ShareDialogContainer, ShareDialogContainerProps } from '../src';
import {
  Comment,
  ConfigResponse,
  ConfigResponseMode,
  Content,
  KeysOfType,
  MetaData,
  OriginTracing,
  RenderCustomTriggerButton,
  ShareClient,
  ShareResponse,
  User,
} from '../src/types';
import {
  ShortenResponse,
  UrlShortenerClient,
} from '../src/clients/AtlassianUrlShortenerClient';

type UserData = {
  avatarUrl?: string;
  id: string;
  includesYou?: boolean;
  fixed?: boolean;
  lozenge?: string;
  memberCount?: number;
  name: string;
  publicName?: string;
  type?: string;
};

const WrapperWithMarginTop = styled.div`
  margin-top: 10px;
`;

let factoryCount = 0;
function originTracingFactory(): OriginTracing {
  factoryCount++;
  const id = `id#${factoryCount}`;
  return {
    id,
    addToUrl: (l: string) => `${l}&atlOrigin=mockAtlOrigin:${id}`,
    toAnalyticsAttributes: () => ({
      originIdGenerated: id,
      originProduct: 'product',
    }),
  };
}

const loadUserOptions = (searchText?: string): OptionData[] => {
  if (!searchText) {
    return userPickerData;
  }

  return userPickerData
    .map((user: UserData) => ({
      ...user,
      type: user.type || 'user',
    }))
    .filter((user: UserData) => {
      const searchTextInLowerCase = searchText.toLowerCase();
      const propertyToMatch: (KeysOfType<UserData, string | undefined>)[] = [
        'id',
        'name',
        'publicName',
      ];

      return propertyToMatch.some(
        (property: KeysOfType<UserData, string | undefined>) => {
          const value = property && user[property];
          return !!(
            value && value.toLowerCase().includes(searchTextInLowerCase)
          );
        },
      );
    });
};

const dialogPlacementOptions: Array<{
  label: string;
  value: State['dialogPlacement'];
}> = [
  { label: 'bottom-end', value: 'bottom-end' },
  { label: 'bottom', value: 'bottom' },
  { label: 'bottom-start', value: 'bottom-start' },
  { label: 'top-start', value: 'top-start' },
  { label: 'top', value: 'top' },
  { label: 'top-end', value: 'top-end' },
  { label: 'right-start', value: 'right-start' },
  { label: 'right', value: 'right' },
  { label: 'right-end', value: 'right-end' },
  { label: 'left-start', value: 'left-start' },
  { label: 'left', value: 'left' },
  { label: 'left-end', value: 'left-end' },
];

const modeOptions: Array<{ label: string; value: ConfigResponseMode }> = [
  { label: 'Existing users only', value: 'EXISTING_USERS_ONLY' },
  { label: 'Invite needs approval', value: 'INVITE_NEEDS_APPROVAL' },
  { label: 'Only domain based invite', value: 'ONLY_DOMAIN_BASED_INVITE' },
  { label: 'Domain based invite', value: 'DOMAIN_BASED_INVITE' },
  { label: 'Anyone', value: 'ANYONE' },
];

const triggerButtonAppearanceOptions: Array<{
  label: string;
  value: State['triggerButtonAppearance'];
}> = [
  { label: 'default', value: 'default' },
  { label: 'danger', value: 'danger' },
  { label: 'link', value: 'link' },
  { label: 'primary', value: 'primary' },
  { label: 'subtle', value: 'subtle' },
  { label: 'subtle-link', value: 'subtle-link' },
  { label: 'warning', value: 'warning' },
];

const triggerButtonStyleOptions: Array<{
  label: string;
  value: State['triggerButtonStyle'];
}> = [
  { label: 'icon-only', value: 'icon-only' },
  { label: 'icon-with-text', value: 'icon-with-text' },
  { label: 'text-only', value: 'text-only' },
];

type ExampleState = {
  customButton: boolean;
  customTitle: boolean;
  escapeOnKeyPress: boolean;
  restrictionMessage: boolean;
  useUrlShortener: boolean;
};

type State = ConfigResponse & Partial<ShareDialogContainerProps> & ExampleState;

const renderCustomTriggerButton: RenderCustomTriggerButton = ({ onClick }) => (
  <button onClick={onClick}>Custom Button</button>
);

class MockUrlShortenerClient implements UrlShortenerClient {
  count = 0;

  public isSupportedProduct(): boolean {
    return true;
  }

  public shorten(): Promise<ShortenResponse> {
    return new Promise<ShortenResponse>(resolve => {
      this.count++;
      setTimeout(() => {
        resolve({
          shortLink: `https://foo.atlassian.net/short#${this.count}`,
        });
      }, 350);
    });
  }
}

export default class Example extends React.Component<{}, State> {
  state: State = {
    allowComment: true,
    allowedDomains: ['atlassian.com'],
    customButton: false,
    customTitle: false,
    restrictionMessage: false,
    useUrlShortener: false,
    dialogPlacement: dialogPlacementOptions[2].value,
    escapeOnKeyPress: true,
    mode: modeOptions[0].value,
    triggerButtonAppearance: triggerButtonAppearanceOptions[0].value,
    triggerButtonStyle: triggerButtonStyleOptions[0].value,
  };

  key: number = 0;

  getConfig = (product: string, cloudId: string): Promise<ConfigResponse> =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(this.state);
      }, 1000);
    });

  share = (
    _content: Content,
    _users: User[],
    _metaData: MetaData,
    _comment?: Comment,
  ) => {
    console.info('Share', {
      _content,
      _users,
      _metaData,
      _comment,
    });

    return new Promise<ShareResponse>(resolve => {
      setTimeout(
        () =>
          resolve({
            shareRequestId: 'c41e33e5-e622-4b38-80e9-a623c6e54cdd',
          }),
        2000,
      );
    });
  };

  shareClient: ShareClient = {
    getConfig: this.getConfig,
    share: this.share,
  };

  urlShortenerClient: UrlShortenerClient = new MockUrlShortenerClient();

  render() {
    const {
      allowComment,
      allowedDomains,
      customButton,
      customTitle,
      dialogPlacement,
      escapeOnKeyPress,
      mode,
      triggerButtonAppearance,
      triggerButtonStyle,
      restrictionMessage,
      useUrlShortener,
    } = this.state;

    this.key++;
    return (
      <IntlProvider locale="en">
        <App>
          {showFlags => (
            <>
              <h4>Share Component</h4>
              <WrapperWithMarginTop>
                <ShareDialogContainer
                  key={`key-${this.key}`}
                  shareClient={this.shareClient}
                  urlShortenerClient={this.urlShortenerClient}
                  cloudId="12345-12345-12345-12345"
                  dialogPlacement={dialogPlacement}
                  loadUserOptions={loadUserOptions}
                  originTracingFactory={originTracingFactory}
                  productId="confluence"
                  renderCustomTriggerButton={
                    customButton ? renderCustomTriggerButton : undefined
                  }
                  shareAri="ari"
                  shareContentType="issue"
                  shareFormTitle={customTitle ? 'Custom Title' : undefined}
                  shareLink={window.location.href}
                  shareTitle="My Share"
                  shouldCloseOnEscapePress={escapeOnKeyPress}
                  showFlags={showFlags}
                  triggerButtonAppearance={triggerButtonAppearance}
                  triggerButtonStyle={triggerButtonStyle}
                  bottomMessage={
                    restrictionMessage ? <RestrictionMessage /> : null
                  }
                  useUrlShortener={useUrlShortener}
                />
              </WrapperWithMarginTop>
              <h4>Options</h4>
              <div>
                <WrapperWithMarginTop>
                  Allow comments
                  <Toggle
                    isChecked={allowComment}
                    onChange={() =>
                      this.setState({ allowComment: !allowComment })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Allowed domains: {allowedDomains && allowedDomains.join(', ')}
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Close Share Dialog on escape key press
                  <Toggle
                    isChecked={escapeOnKeyPress}
                    onChange={() =>
                      this.setState({ escapeOnKeyPress: !escapeOnKeyPress })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Custom Share Dialog Trigger Button
                  <Toggle
                    isChecked={customButton}
                    onChange={() =>
                      this.setState({ customButton: !customButton })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Custom Share Dialog Title
                  <Toggle
                    isChecked={customTitle}
                    onChange={() =>
                      this.setState({ customTitle: !customTitle })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Show Restriction Message
                  <Toggle
                    isChecked={restrictionMessage}
                    onChange={() =>
                      this.setState({ restrictionMessage: !restrictionMessage })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Use an URL shortener
                  <Toggle
                    isChecked={useUrlShortener}
                    onChange={() =>
                      this.setState({ useUrlShortener: !useUrlShortener })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Dialog Placement
                  <Select
                    value={dialogPlacementOptions.find(
                      option => option.value === dialogPlacement,
                    )}
                    options={dialogPlacementOptions}
                    onChange={(option: any) =>
                      this.setState({ dialogPlacement: option.value })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Share Configs
                  <Select
                    value={modeOptions.find(option => option.value === mode)}
                    options={modeOptions}
                    onChange={(mode: any) =>
                      this.setState({ mode: mode.value })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Trigger Button Style
                  <Select
                    value={{
                      label: triggerButtonStyle,
                      value: triggerButtonStyle,
                    }}
                    options={triggerButtonStyleOptions}
                    onChange={(option: any) =>
                      this.setState({ triggerButtonStyle: option.value })
                    }
                  />
                </WrapperWithMarginTop>
                <WrapperWithMarginTop>
                  Trigger Button Appearance
                  <Select
                    value={{
                      label: triggerButtonAppearance,
                      value: triggerButtonAppearance,
                    }}
                    options={triggerButtonAppearanceOptions}
                    onChange={(option: any) =>
                      this.setState({ triggerButtonAppearance: option.value })
                    }
                  />
                </WrapperWithMarginTop>
              </div>
            </>
          )}
        </App>
      </IntlProvider>
    );
  }
}
