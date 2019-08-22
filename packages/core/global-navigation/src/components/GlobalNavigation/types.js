// @flow

import type { ComponentType, ElementRef, Node } from 'react';
import type { DrawerWidth } from '@atlaskit/drawer';

type NonStringRef<T> = {
  current: ElementRef<T> | null,
};
export type DrawerContentProps = { closeDrawer: () => void };

export type InitialNavigationStateShape = {
  activeDrawer?: string | null,
  isHinting?: boolean,
  isPeeking?: boolean,
  productNavIsCollapsed?: boolean,
  productNavWidth?: number,
};

export type NavigationStateShape = {
  ...$Exact<InitialNavigationStateShape>,
  isResizing?: boolean,
};

export type GlobalNavDrawerProps = {
  /** A prop to take control over the opening and closing of drawer. NOTE:
   * GlobalNavigation controls the drawer behaviour by default. */
  isCreateDrawerOpen?: boolean,
  /** The contents of the create drawer. This is ignored if onCreateClick is
   * passed. */
  createDrawerContents?: ComponentType<*>,
  /** The width of the create drawer. This is "wide" by default. */
  createDrawerWidth?: DrawerWidth,
  /** A callback function which will be fired when the create drawer is opened.
   * */
  onCreateDrawerOpen?: () => void,
  /** A callback function which will be fired when the create drawer is closed.
   * */
  onCreateDrawerClose?: () => void,
  /** A callback function which will be fired when the create drawer has finished its close transition. **/
  onCreateDrawerCloseComplete?: (node: HTMLElement) => void,
  /** A prop to decide if the contents of the drawer should unmount on drawer
   * close. It is true by default. */
  shouldCreateDrawerUnmountOnExit?: boolean,

  /** A prop to take control over the opening and closing of the recent drawer. NOTE:
   * GlobalNavigation controls the drawer behaviour by default. */
  isRecentDrawerOpen?: boolean,
  /** The contents of the recent drawer. */
  recentDrawerContents?: ComponentType<*>,
  /** The width of the recent drawer. This is "wide" by default. */
  recentDrawerWidth?: DrawerWidth,
  /** A callback function which will be called when the recent drawer is
   * opened. */
  onRecentDrawerOpen?: () => void,
  /** A callback function which will be called when the recent drawer is
   * closed. */
  onRecentDrawerClose?: () => void,
  /** A callback function which will be fired when the recent drawer has finished its close transition. **/
  onRecentDrawerCloseComplete?: (node: HTMLElement) => void,
  /** A prop to decide if the contents of the drawer should unmount on drawer
   * close. It is true by default. */
  shouldRecentDrawerUnmountOnExit?: boolean,

  /** A prop to take control over the opening and closing of the Global Invite drawer. NOTE:
   * GlobalNavigation controls the drawer behaviour by default. */
  isInviteDrawerOpen?: boolean,
  /** The contents of the global invite drawer. */
  inviteDrawerContents?: ComponentType<*>,
  /** The width of the global invite drawer. This is "wide" by default. */
  inviteDrawerWidth?: DrawerWidth,
  /** A callback function which will be called when the global invite drawer is
   * opened. */
  onInviteDrawerOpen?: () => void,
  /** A callback function which will be called when the global invite drawer is
   * closed. */
  onInviteDrawerClose?: () => void,
  /** A callback function which will be fired when the global invite drawer has finished its close transition. **/
  onInviteDrawerCloseComplete?: (node: HTMLElement) => void,
  /** A prop to decide if the contents of the drawer should unmount on drawer
   * close. It is true by default. */
  shouldInviteDrawerUnmountOnExit?: boolean,

  /** A prop to take control over the opening and closing of drawer. NOTE:
   * GlobalNavigation controls the drawer behaviour by default. */
  isSearchDrawerOpen?: boolean,
  /** The contents of the search drawer. This is ignored if onSearchClick is
   * passed. */
  searchDrawerContents?: ComponentType<*>,
  /** The width of the search drawer. This is "wide" by default. */
  searchDrawerWidth?: DrawerWidth,
  /** A callback function which will be called when the search drawer is opened.
   * */
  onSearchDrawerOpen?: () => void,
  /** A callback function which will be called when the search drawer is closed.
   * */
  onSearchDrawerClose?: () => void,
  /** A callback function which will be fired when the search drawer has finished its close transition. **/
  onSearchDrawerCloseComplete?: (node: HTMLElement) => void,
  /** A prop to decide if the contents of the drawer should unmount on drawer
   * close. It is true by default. */
  shouldSearchDrawerUnmountOnExit?: boolean,

  /** A prop to take control over the opening and closing of drawer. NOTE:
   * GlobalNavigation controls the drawer behaviour by default. */
  isNotificationDrawerOpen?: boolean,
  /** The contents of the notifications drawer. */
  notificationDrawerContents?: ComponentType<*>,
  /** The width of the notification drawer. This is "wide" by default. */
  notificationDrawerWidth?: DrawerWidth,
  /** A callback function which will be called when the notifications drawer is
   * opened. */
  onNotificationDrawerOpen?: () => void,
  /** A callback function which will be called when the notifications drawer is
   * closed. */
  onNotificationDrawerClose?: () => void,
  /** A callback function which will be fired when the notification drawer has finished its close transition. **/
  onNotificationDrawerCloseComplete?: (node: HTMLElement) => void,

  /** Locale to be passed to the notification iFrame*/
  locale?: string,
  /** Prop to let notification iframe know which product it's being rendered in*/
  product?: 'jira' | 'confluence',
  /** fabricNotificationLogUrl of the user */
  fabricNotificationLogUrl?: string,
  /** cloudId of the user */
  cloudId?: string,

  /** A prop to decide if the contents of the drawer should unmount on drawer
   * close. It is true by default. */
  shouldNotificationDrawerUnmountOnExit?: boolean,

  /** A prop to take control over the opening and closing of the star drawer. NOTE:
   * GlobalNavigation controls the drawer behaviour by default. */
  isStarredDrawerOpen?: boolean,
  /** The contents of the starred drawer. */
  starredDrawerContents?: ComponentType<*>,
  /** The width of the starred drawer. This is "wide" by default. */
  starredDrawerWidth?: DrawerWidth,
  /** A callback function which will be called when the starred drawer is
   * opened. */
  onStarredDrawerOpen?: () => void,
  /** A callback function which will be called when the starred drawer is
   * closed. */
  onStarredDrawerClose?: () => void,
  /** A callback function which will be fired when the starred drawer has finished its close transition. **/
  onStarredDrawerCloseComplete?: (node: HTMLElement) => void,
  /** A prop to decide if the contents of the drawer should unmount on drawer
   * close. It is true by default. */
  shouldStarredDrawerUnmountOnExit?: boolean,

  /** A prop to take control over the opening and closing of the settings drawer. NOTE:
   * GlobalNavigation controls the drawer behaviour by default. */
  isSettingsDrawerOpen?: boolean,
  /** The contents of the settings drawer. */
  settingsDrawerContents?: ComponentType<*>,
  /** A callback function which will be called when the settings drawer is
   * opened. */
  onSettingsDrawerOpen?: () => void,
  /** A callback function which will be called when the settings drawer is
   * closed. */
  onSettingsDrawerClose?: () => void,
  /** A callback function which will be fired when the settings drawer has finished its close transition. **/
  onSettingsDrawerCloseComplete?: (node: HTMLElement) => void,
  /** A prop to decide if the contents of the drawer should unmount on drawer
   * close. It is true by default. */
  shouldSettingsDrawerUnmountOnExit?: boolean,

  /** A prop to take control over the opening and closing of the help drawer. NOTE:
   * GlobalNavigation controls the drawer behaviour by default. */
  isHelpDrawerOpen?: boolean,
  /** The contents of the help drawer. */
  helpDrawerContents?: ComponentType<*>,
  /** The width of the help drawer. This is "wide" by default. */
  HelpDrawerWidth?: DrawerWidth,
  /** A callback function which will be called when the help drawer is
   * opened. */
  onHelpDrawerOpen?: () => void,
  /** A callback function which will be called when the help drawer is
   * closed. */
  onHelpDrawerClose?: () => void,
  /** A callback function which will be fired when the help drawer has finished its close transition. **/
  onHelpDrawerCloseComplete?: (node: HTMLElement) => void,
  /** A prop to decide if the contents of the drawer should unmount on drawer
   * close. It is true by default. */
  shouldHelpDrawerUnmountOnExit?: boolean,

  /** An optional Prop to configure the back icon */

  drawerBackIcon?: Node,
};

export type GlobalNavigationProps = {
  /** The product logo. Expected to be an Atlaskit Logo component. */
  productIcon?: ComponentType<{}>,
  /** A callback function which will be called when the product logo item is
   * clicked. If this is passed, the drawer does not show up. */
  onProductClick?: () => void,
  /** The text to display as the label for the product logo item. */
  productLabel?: string,
  /** The text to display in the tooltip for the product logo item. */
  productTooltip?: string | Node,
  /** An href attribute for the product logo item. */
  productHref?: string,
  /** A function to get ref of the product icon */
  getProductRef?: (node: NonStringRef<'div'>) => void,

  /** A callback function which will be called when the recent item is clicked.
   * */
  onRecentClick?: ?() => void,
  /** The text to display as the label for the recent drawer item. */
  recentLabel?: string,
  /** The text to display in the tooltip for the recent drawer item. */
  recentTooltip?: string | Node,
  /** A function to get ref of the recent icon */
  getRecentRef?: (node: NonStringRef<'div'>) => void,

  /** A callback function which will be called when the global invite item is clicked.
   * */
  onInviteClick?: ?() => void,
  /** The text to display as the label for the global invite drawer item. */
  inviteLabel?: string,
  /** The text to display in the tooltip for the global invite drawer item. */
  inviteTooltip?: string | Node,
  /** A function to get ref of the global invite icon */
  getInviteRef?: (node: NonStringRef<'div'>) => void,

  /** A callback function which will be called when the product logo item is
   * clicked. If this is passed, the drawer does not show up. */
  onCreateClick?: ?() => void,
  /** The text to display as the label for the create drawer item. */
  createLabel?: string,
  /** The text to display in the tooltip for the create drawer item. */
  createTooltip?: string | Node,
  /** A function to get ref of the create icon */
  getCreateRef?: (node: NonStringRef<'div'>) => void,

  /** A callback function which will be called when the starred item is clicked.
   * */
  onStarredClick?: ?() => void,
  /** The text to display as the label for the starred drawer item. */
  starredLabel?: string,
  /** The text to display in the tooltip for the starred drawer item. */
  starredTooltip?: string | Node,
  /** A function to get ref of the starred icon */
  getStarredRef?: (node: NonStringRef<'div'>) => void,

  /** A callback function which will be called when the product logo item is
   * clicked. If this is passed, the drawer does not show up. */
  onSearchClick?: ?() => void,
  /** The text to display as the label for the search drawer item. */
  searchLabel?: string,
  /** The text to display in the tooltip for the search drawer item. */
  searchTooltip?: string | Node,
  /** A function to get ref of the search icon */
  getSearchRef?: (node: NonStringRef<'div'>) => void,

  /** The component to render the app switcher. */
  appSwitcherComponent?: ComponentType<*>, // AppSwitcher component
  /** The text to display as the label for the app switcher item. */
  appSwitcherLabel?: string,
  /** The text to display in the tooltip for the app switcher item. */
  appSwitcherTooltip?: string | Node,
  /** A function to get ref of the appSwitcher icon */
  getAppSwitcherRef?: (node: NonStringRef<'div'>) => void,

  /** The boolean that controls whether to display the Atlassian Switcher. */
  enableAtlassianSwitcher?: boolean,
  /** A callback used to trigger the product implementation of XFlow */
  triggerXFlow?: ?(productKey: string, sourceComponent: string) => void,

  /** A callback function which will be called when the help item is clicked.
   * */
  onHelpClick?: ?() => void,
  /** The text to display as the label for the help drawer item. */
  helpLabel?: string,
  /** The text to display in the tooltip for the help drawer item. */
  helpTooltip?: string | Node,
  /** A function to get ref of the help icon */
  getHelpRef?: (node: NonStringRef<'div'>) => void,

  /** The boolean that controls whether to display a drawer instead of a menu dropdown. */
  enableHelpDrawer?: boolean,
  /** A component to render into the help menu dropdown. */
  helpItems?: ComponentType<{}>,
  /** A component displayed over the help icon which can be used to convey a notification*/
  helpBadge?: ComponentType<{}>,

  /** The text to display as the label for the profile item. */
  profileLabel?: string,
  /** The text to display in the tooltip for the profile item. */
  profileTooltip?: string | Node,
  /** A component to render into the profile menu dropdown. */
  profileItems?: ComponentType<{}>,
  /** The URL of the avatar image to render in the profile item. */
  profileIconUrl?: string,
  /** The URL to redirect anonymous users to. */
  loginHref?: string,
  /** A function to get ref of the profile icon */
  getProfileRef?: (node: NonStringRef<'div'>) => void,

  /** A callback function which will be called when the product logo item is
   * clicked. If this is passed, the drawer does not show up. */
  onNotificationClick?: ?() => void,
  /** The number of unread notifications. Will render as a badge above the
   * notifications item. */
  notificationCount?: number,
  /** The text to display as the label for the notifications drawer item. */
  notificationsLabel?: string,
  /** The text to display in the tooltip for the notifications drawer item. */
  notificationTooltip?: string | Node,
  /** A function to get ref of the notification icon */
  getNotificationRef?: (node: NonStringRef<'div'>) => void,

  /** A callback function which will be called when the settings item is clicked. */
  onSettingsClick?: ?() => void,
  /** The text to display as the label for the settings drawer item. */
  settingsLabel?: string,
  /** The text to display in the tooltip for the settings drawer item. */
  settingsTooltip?: string | Node,
  /** A function to get ref of the settings icon */
  getSettingsRef?: (node: NonStringRef<'div'>) => void,

  ...$Exact<GlobalNavDrawerProps>,
};

export type DrawerName =
  | 'search'
  | 'notification'
  | 'starred'
  | 'create'
  | 'help'
  | 'settings'
  | 'recent'
  | 'invite'
  | 'atlassianSwitcher';

export type { DrawerWidth };
