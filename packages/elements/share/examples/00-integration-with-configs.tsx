import Select from '@atlaskit/select';
import { ToggleStateless as Toggle } from '@atlaskit/toggle';
import { OptionData } from '@atlaskit/user-picker';
import { userPickerData } from '@atlaskit/util-data-test';
import styled from 'styled-components';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import App from '../example-helpers/AppWithFlag';
import { ShareDialogContainer, ShareDialogContainerProps } from '../src';
import {
  Comment,
  ConfigResponse,
  ConfigResponseMode,
  Content,
  KeysOfType,
  MetaData,
  OriginTracing,
  ShareClient,
  ShareResponse,
  User,
} from '../src/types';

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

const mockOriginTracing: OriginTracing = {
  id: 'id',
  addToUrl: (l: string) => `${l}&atlOrigin=mockAtlOrigin`,
  toAnalyticsAttributes: () => ({
    originIdGenerated: 'id',
    originProduct: 'product',
  }),
};

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

const modeOptions = [
  { label: 'Existing users only', value: 'EXISTING_USERS_ONLY' },
  { label: 'Invite needs approval', value: 'INVITE_NEEDS_APPROVAL' },
  { label: 'Only domain based invite', value: 'ONLY_DOMAIN_BASED_INVITE' },
  { label: 'Domain based invite', value: 'DOMAIN_BASED_INVITE' },
  { label: 'Anyone', value: 'ANYONE' },
];

const triggerButtonAppearanceOptions = [
  { label: 'default', value: 'default' },
  { label: 'danger', value: 'danger' },
  { label: 'link', value: 'link' },
  { label: 'primary', value: 'primary' },
  { label: 'subtle', value: 'subtle' },
  { label: 'subtle-link', value: 'subtle-link' },
  { label: 'warning', value: 'warning' },
  { label: 'help', value: 'help' },
];

const triggerButtonStyleOptions = [
  { label: 'icon-only', value: 'icon-only' },
  { label: 'icon-with-text', value: 'icon-with-text' },
];

type State = ConfigResponse & Partial<ShareDialogContainerProps>;

export default class Example extends React.Component<{}, State> {
  state: State = {
    allowComment: true,
    allowedDomains: ['atlassian.com'],
    mode: modeOptions[0].value as ConfigResponseMode,
    triggerButtonAppearance: triggerButtonAppearanceOptions[0]
      .value as 'subtle',
    triggerButtonStyle: triggerButtonStyleOptions[0].value as 'icon-only',
  };

  key: number = 0;

  getConfig = () => Promise.resolve(this.state);

  share = (
    _content: Content,
    _users: User[],
    _metaData: MetaData,
    _comment?: Comment,
  ) =>
    new Promise<ShareResponse>(resolve => {
      setTimeout(
        () =>
          resolve({
            shareRequestId: 'c41e33e5-e622-4b38-80e9-a623c6e54cdd',
          }),
        3000,
      );
    });

  client: ShareClient = {
    getConfig: this.getConfig,
    share: this.share,
  };

  render() {
    const {
      allowComment,
      allowedDomains,
      mode,
      triggerButtonAppearance,
      triggerButtonStyle,
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
                  client={this.client}
                  cloudId="12345-12345-12345-12345"
                  loadUserOptions={loadUserOptions}
                  originTracingFactory={() => mockOriginTracing}
                  productId="confluence"
                  shareAri="ari"
                  shareContentType="issue"
                  shareLink={window.location.href}
                  shareTitle="My Share"
                  showFlags={showFlags}
                  triggerButtonAppearance={triggerButtonAppearance}
                  triggerButtonStyle={triggerButtonStyle}
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
