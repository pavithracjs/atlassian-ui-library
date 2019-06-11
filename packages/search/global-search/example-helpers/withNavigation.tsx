import * as React from 'react';
import { ComponentType } from 'react';
import styled from 'styled-components';
import { Props } from '../src';
import BasicNavigation from './BasicNavigation';
import LocaleIntlProvider from './LocaleIntlProvider';
import { DEVELOPMENT_LOGGER } from './logger';
import { QuickSearchContext } from '../src/api/types';

const RadioGroup = styled.div`
  position: relative;
  padding: 4px;
  z-index: 1000;
  width: 340px;
  margin-left: 54px;
`;

const Radio = styled.input`
  margin-left: 16px;
  margin-right: 8px;
`;

export interface Config {
  hideLocale?: boolean;
  message?: JSX.Element;
  cloudIds?: {
    [k: string]: string;
  };
}

const MessageContainer = styled.div`
  position: relative;
  z-index: 1000;
  width: 100%;
  margin-right: 8px;
  margin-bottom: 10px;
  align-contentpadding-left: 50px;
  text-align: left;
`;

interface State {
  context: 'home' | 'jira' | 'confluence';
  locale: string;
}

// Wraps global-search in AK Navigation and offers a context/locale switch
export default function withNavigation<P extends Props>(
  WrappedComponent: ComponentType<P>,
  props?: Config,
  availableContext: QuickSearchContext[] = ['confluence', 'jira', 'home'],
  drawerIsOpen?: boolean,
): ComponentType<Partial<P>> {
  return class WithNavigation extends React.Component<Partial<P>> {
    static displayName = `WithNavigation(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    handleContextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        context: e.target.value,
      });
    };

    handleLocaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        locale: e.target.value,
      });
    };

    state: State = {
      context: availableContext[0],
      locale: 'en',
    };

    renderLocaleRadioGroup() {
      const { locale } = this.state;
      if (props && props.hideLocale) {
        return null;
      }
      return (
        <RadioGroup>
          Locale:
          <Radio
            type="radio"
            id="defaultLocale"
            name="locale"
            value="en"
            onChange={this.handleLocaleChange}
            checked={locale === 'en'}
          />
          <label htmlFor="defaultLocale">EN</label>
          <Radio
            type="radio"
            id="esLocale"
            name="locale"
            value="es"
            onChange={this.handleLocaleChange}
          />
          <label htmlFor="esLocale">ES</label>
          <Radio
            type="radio"
            id="ptBRLocale"
            name="locale"
            value="pt-BR"
            onChange={this.handleLocaleChange}
          />
          <label htmlFor="ptBRLocale">pt-BR</label>
          <Radio
            type="radio"
            id="zhLocale"
            name="locale"
            value="zh"
            onChange={this.handleLocaleChange}
          />
          <label htmlFor="zhLocale">ZH</label>
        </RadioGroup>
      );
    }

    getCloudId(): string {
      return (
        (props && props.cloudIds && props.cloudIds[this.state.context]) ||
        this.props.cloudId
      );
    }

    renderMessage() {
      if (!props || !props.message) {
        return null;
      }
      return <MessageContainer>{props.message}</MessageContainer>;
    }
    render() {
      const { context: currentContext, locale } = this.state;

      return (
        <>
          {this.renderMessage()}
          <RadioGroup>
            Context:
            {availableContext.map(context => (
              <React.Fragment key={context}>
                <Radio
                  type="radio"
                  id={context}
                  name="context"
                  value={context}
                  onChange={this.handleContextChange}
                  checked={context === currentContext}
                />
                <label htmlFor={context}>{context.toUpperCase()}</label>
              </React.Fragment>
            ))}
          </RadioGroup>
          {this.renderLocaleRadioGroup()}
          <BasicNavigation
            drawerIsOpen={drawerIsOpen}
            searchDrawerContent={
              <LocaleIntlProvider locale={locale}>
                <WrappedComponent
                  cloudId={this.getCloudId()}
                  context={currentContext}
                  referralContextIdentifiers={{
                    currentContentId: '123',
                    currentContainerId: '456',
                    searchReferrerId: '123',
                  }}
                  logger={DEVELOPMENT_LOGGER}
                  {...this.props}
                />
              </LocaleIntlProvider>
            }
          />
        </>
      );
    }
  };
}
