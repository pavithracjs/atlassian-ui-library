import * as React from 'react';
import { Messages } from 'react-intl';
import { UIAnalyticsEventInterface } from '@atlaskit/analytics-next';
import isEqual from 'lodash.isequal';

import {
  SwitcherWrapper,
  SwitcherItem,
  Section,
  ManageButton,
  Skeleton,
  ExpandLink,
} from '../primitives';
import { SwitcherItemType, RecentItemType } from '../utils/links';

import {
  analyticsAttributes,
  NavigationAnalyticsContext,
  SWITCHER_SUBJECT,
  RenderTracker,
  ViewedTracker,
} from '../utils/analytics';
import now from '../utils/performance-now';
import FormattedMessage from '../primitives/formatted-message';
import TryLozenge from '../primitives/try-lozenge';
import { TriggerXFlowCallback, TriggerProductStore } from '../types';
import { urlToHostname } from '../utils/url-to-hostname';

const noop = () => void 0;

type SwitcherProps = {
  messages: Messages;
  triggerXFlow: TriggerXFlowCallback;
  triggerProductStore: TriggerProductStore;
  isLoading: boolean;
  licensedProductLinks: SwitcherItemType[];
  suggestedProductLinks: SwitcherItemType[];
  fixedLinks: SwitcherItemType[];
  adminLinks: SwitcherItemType[];
  recentLinks: RecentItemType[];
  customLinks: SwitcherItemType[];
  manageLink?: string;
  expandLink?: string;
};

const getAnalyticsContext = (itemsCount: number) => ({
  ...analyticsAttributes({
    itemsCount,
  }),
});

const getItemAnalyticsContext = (
  index: number,
  id: string | null,
  type: string,
  href: string,
) => ({
  ...analyticsAttributes({
    groupItemIndex: index,
    itemId: id,
    itemType: type,
    domain: urlToHostname(href),
  }),
});

export default class Switcher extends React.Component<SwitcherProps> {
  mountedAt?: number;

  componentDidMount() {
    this.mountedAt = now();
  }

  shouldComponentUpdate(nextProps: SwitcherProps) {
    return !(isEqual(this.props, nextProps) as boolean);
  }

  timeSinceMounted(): number {
    return this.mountedAt ? Math.round(now() - this.mountedAt) : 0;
  }

  triggerXFlow = (key: string) => (
    event: any,
    analyticsEvent: UIAnalyticsEventInterface,
  ) => {
    const { triggerXFlow } = this.props;
    triggerXFlow(key, 'atlassian-switcher', event, analyticsEvent);
  };

  onFixedLinkClick = (key: string) =>
    key === 'product-store'
      ? (event: any, analyticsEvent: UIAnalyticsEventInterface) => {
          const { triggerProductStore } = this.props;
          triggerProductStore(event, analyticsEvent);
        }
      : noop;

  render() {
    const {
      messages,
      expandLink,
      licensedProductLinks,
      suggestedProductLinks,
      fixedLinks,
      adminLinks,
      recentLinks,
      customLinks,
      manageLink,
      isLoading,
    } = this.props;

    /**
     * It is essential that switchToLinks reflects the order corresponding nav items
     * are rendered below in the 'Switch to' section.
     */
    const switchToLinks = [
      ...licensedProductLinks,
      ...suggestedProductLinks,
      ...fixedLinks,
      ...adminLinks,
    ];

    const itemsCount =
      switchToLinks.length + recentLinks.length + customLinks.length;

    const firstContentArrived = Boolean(licensedProductLinks.length);

    return (
      <NavigationAnalyticsContext data={getAnalyticsContext(itemsCount)}>
        <SwitcherWrapper>
          <ViewedTracker
            subject={SWITCHER_SUBJECT}
            data={{
              switcherItems: {
                licensedProducts: licensedProductLinks.map(item => item.key),
                suggestedProducts: suggestedProductLinks.map(item => item.key),
              },
            }}
          />
          {firstContentArrived && (
            <RenderTracker
              subject={SWITCHER_SUBJECT}
              data={{ duration: this.timeSinceMounted() }}
            />
          )}
          <Section
            sectionId="switchTo"
            title={
              expandLink ? (
                <ExpandLink
                  href={expandLink}
                  title={<FormattedMessage {...messages.switchTo} />}
                />
              ) : (
                <FormattedMessage {...messages.switchTo} />
              )
            }
          >
            {licensedProductLinks.map(item => (
              <NavigationAnalyticsContext
                key={item.key}
                data={getItemAnalyticsContext(
                  switchToLinks.indexOf(item),
                  item.key,
                  'product',
                  item.href,
                )}
              >
                <SwitcherItem
                  icon={<item.Icon theme="product" />}
                  description={item.description}
                  href={item.href}
                >
                  {item.label}
                </SwitcherItem>
              </NavigationAnalyticsContext>
            ))}
            {suggestedProductLinks.map(item => (
              <NavigationAnalyticsContext
                key={item.key}
                data={getItemAnalyticsContext(
                  switchToLinks.indexOf(item),
                  item.key,
                  'try',
                  item.href,
                )}
              >
                <SwitcherItem
                  icon={<item.Icon theme="product" />}
                  onClick={this.triggerXFlow(item.key)}
                >
                  {item.label}
                  <TryLozenge>
                    <FormattedMessage {...messages.try} />
                  </TryLozenge>
                </SwitcherItem>
              </NavigationAnalyticsContext>
            ))}
            {fixedLinks.map(item => (
              <NavigationAnalyticsContext
                key={item.key}
                data={getItemAnalyticsContext(
                  switchToLinks.indexOf(item),
                  item.key,
                  'product',
                  item.href,
                )}
              >
                <SwitcherItem
                  icon={<item.Icon theme="product" />}
                  href={item.href}
                  onClick={this.onFixedLinkClick(item.href)}
                >
                  {item.label}
                </SwitcherItem>
              </NavigationAnalyticsContext>
            ))}
            {adminLinks.map(item => (
              <NavigationAnalyticsContext
                key={item.key}
                data={getItemAnalyticsContext(
                  switchToLinks.indexOf(item),
                  item.key,
                  'admin',
                  item.href,
                )}
              >
                <SwitcherItem
                  icon={<item.Icon theme="admin" />}
                  href={item.href}
                >
                  {item.label}
                </SwitcherItem>
              </NavigationAnalyticsContext>
            ))}
          </Section>
          <Section
            sectionId="recent"
            title={<FormattedMessage {...messages.recent} />}
          >
            {recentLinks.map(
              ({ key, label, href, type, description, Icon }, idx) => (
                <NavigationAnalyticsContext
                  key={key}
                  data={getItemAnalyticsContext(idx, type, 'recent', href)}
                >
                  <SwitcherItem
                    icon={<Icon theme="recent" />}
                    description={description}
                    href={href}
                  >
                    {label}
                  </SwitcherItem>
                </NavigationAnalyticsContext>
              ),
            )}
          </Section>
          <Section
            sectionId="customLinks"
            title={<FormattedMessage {...messages.more} />}
          >
            {customLinks.map(({ label, href, Icon }, idx) => (
              // todo: id in SwitcherItem should be consumed from custom link resolver
              <NavigationAnalyticsContext
                key={idx + '.' + label}
                data={getItemAnalyticsContext(idx, null, 'customLink', href)}
              >
                <SwitcherItem icon={<Icon theme="custom" />} href={href}>
                  {label}
                </SwitcherItem>
              </NavigationAnalyticsContext>
            ))}
          </Section>
          {isLoading && <Skeleton />}
          {manageLink && <ManageButton href={manageLink} />}
        </SwitcherWrapper>
      </NavigationAnalyticsContext>
    );
  }
}
