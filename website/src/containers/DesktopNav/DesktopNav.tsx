import React from 'react';
import { toClass } from 'recompose';
import { RouteComponentProps } from 'react-router-dom';
import Tooltip from '@atlaskit/tooltip';
import SearchIcon from '@atlaskit/icon/glyph/search';
import MenuIcon from '@atlaskit/icon/glyph/menu';
import Navigation, {
  AkContainerTitle,
  presetThemes,
} from '@atlaskit/navigation';

import Groups from './Groups';
import GroupDrawer from './GroupDrawer';
import { Link } from '../../components/WrappedLink';
import HeaderIcon from '../../components/HeaderIcon';
import { CONTAINER_HEADERS_CONFIG } from './constants';
import { AtlaskitIcon } from '../../components/AtlaskitIcon';
import SearchDrawer, { LinkComponentProps } from './SearchDrawer';
import { externalPackages as packages, docs, patterns } from '../../site';

export default function Nav({ location }: RouteComponentProps) {
  const [groupDrawerOpen, setGroupDrawerOpen] = React.useState<boolean>(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = React.useState<boolean>(
    false,
  );
  const [searchDrawerValue, setSearchDrawerValue] = React.useState<string>('');

  const isContainerNavOpen = location.pathname !== '/';
  const theme = isContainerNavOpen ? null : presetThemes.global;
  const headerKey = location.pathname.split('/').filter(p => p)[0];

  const header = CONTAINER_HEADERS_CONFIG[headerKey];
  const groups = <Groups docs={docs} packages={packages} patterns={patterns} />;

  return (
    <Navigation
      containerTheme={theme}
      isCollapsible={!isContainerNavOpen}
      isOpen={isContainerNavOpen}
      isResizeable={false}
      globalCreateIcon={
        <Tooltip content="Menu" position="right">
          <MenuIcon label="Menu" />
        </Tooltip>
      }
      globalPrimaryItemHref={'/'}
      globalPrimaryIcon={
        <Tooltip content="Home" position="right">
          <AtlaskitIcon />
        </Tooltip>
      }
      globalSearchIcon={
        <Tooltip content="Search" position="right">
          <SearchIcon label="search" />
        </Tooltip>
      }
      onSearchDrawerOpen={() => setSearchDrawerOpen(true)}
      onCreateDrawerOpen={() => setGroupDrawerOpen(true)}
      drawers={[
        <SearchDrawer
          isOpen={searchDrawerOpen}
          closeDrawer={() => {
            setSearchDrawerOpen(false);
            setSearchDrawerValue('');
          }}
          searchDrawerValue={searchDrawerValue}
          updateSearchValue={({ target: { value } }) =>
            setSearchDrawerValue(value)
          }
          packages={packages}
          key="searchDrawer"
        />,
        <GroupDrawer
          key="groupDrawer"
          isOpen={groupDrawerOpen}
          closeDrawer={() => setGroupDrawerOpen(false)}
          pathname={location.pathname}
        >
          {groups}
        </GroupDrawer>,
      ]}
      containerHeaderComponent={() =>
        isContainerNavOpen &&
        header && (
          <AkContainerTitle
            icon={<HeaderIcon {...header} />}
            text={header.label}
            href={`/${headerKey}`}
            linkComponent={toClass(
              ({ href, children, className, onClick }: LinkComponentProps) => (
                <Link onClick={onClick} to={href} className={className}>
                  {children}
                </Link>
              ),
            )}
          />
        )
      }
    >
      {isContainerNavOpen && groups}
    </Navigation>
  );
}
