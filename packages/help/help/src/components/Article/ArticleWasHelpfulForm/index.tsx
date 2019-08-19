import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

import Button, { ButtonGroup } from '@atlaskit/button';
import Form, { Field, FormFooter } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';
import TextArea from '@atlaskit/textarea';
import { gridSize } from '@atlaskit/theme/constants';

import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';
import { withAnalyticsEvents, withAnalyticsContext } from '../../../analytics';
import { messages } from '../../../messages';

import { ArticleFeedback } from '../../../model/Article';
import { withHelp, HelpContextInterface } from '../../HelpContext';

import ArticleWasHelpfulYesButton from './WasHelpfulYesButton';
import ArticleWasHelpfulNoButton from './WasHelpfulNoButton';

import {
  ArticleContentInner,
  ArticleRateText,
  ArticleRateAnswerWrapper,
} from '../styled';

interface Props {
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
}
interface State {
  wasHelpful: boolean | null;
}

export class ArticleWasHelpfulForm extends React.Component<
  Props & InjectedIntlProps & HelpContextInterface,
  State
> {
  state = {
    wasHelpful: null,
  };

  onWasHelpfulOptionClicked = (wasHelpful: boolean) => {
    this.setState({ wasHelpful });
  };

  onRateSubmit = (articleFeedback: ArticleFeedback) => {
    let analyticsEvent: UIAnalyticsEvent | undefined;
    if (this.props.help.onWasHelpfulSubmit) {
      if (this.props.createAnalyticsEvent) {
        analyticsEvent = this.props.createAnalyticsEvent({
          action: 'click',
        });
      }

      try {
        this.props.help
          .onWasHelpfulSubmit(articleFeedback, analyticsEvent)
          .then(() => {
            this.setState({ wasHelpful: null });
          });
      } catch (error) {
        // TODO: Display error
      }
    }
  };

  onRateSubmitCancel = () => {
    this.setState({ wasHelpful: null });
  };

  render() {
    const { wasHelpful } = this.state;

    const negativeRateReason = [
      {
        name: 'negativeRateReason',
        value: 'noAccurate',
        label: this.props.intl.formatMessage(
          messages.help_panel_article_rating_accurate,
        ),
      },
      {
        name: 'negativeRateReason',
        value: 'noClear',
        label: this.props.intl.formatMessage(
          messages.help_panel_article_rating_clear,
        ),
      },
      {
        name: 'negativeRateReason',
        value: 'noRelevant',
        label: this.props.intl.formatMessage(
          messages.help_panel_article_rating_relevant,
        ),
      },
    ];

    return (
      <ArticleContentInner>
        <ArticleRateText style={{ paddingRight: `${gridSize()}px` }}>
          {this.props.intl.formatMessage(
            messages.help_panel_article_rating_title,
          )}
        </ArticleRateText>
        <ButtonGroup>
          <ArticleWasHelpfulYesButton
            onClick={() => this.onWasHelpfulOptionClicked(true)}
            isSelected={wasHelpful === true}
          />
          <ArticleWasHelpfulNoButton
            onClick={() => this.onWasHelpfulOptionClicked(false)}
            isSelected={wasHelpful === false}
          />
        </ButtonGroup>

        {wasHelpful !== null && this.props.help.onWasHelpfulSubmit && (
          <ArticleRateAnswerWrapper>
            <Form onSubmit={this.onRateSubmit}>
              {({ formProps }: { formProps: any }) => {
                return (
                  <form {...formProps} name="form-example">
                    <ArticleRateText>
                      {this.props.intl.formatMessage(
                        messages.help_panel_article_rating_form_title,
                      )}
                    </ArticleRateText>
                    {!wasHelpful && (
                      <Field name="negativeRateReason">
                        {({ fieldProps }: { fieldProps: any }) => (
                          <RadioGroup
                            {...fieldProps}
                            options={negativeRateReason}
                          />
                        )}
                      </Field>
                    )}
                    <Field name="RateReasonText" defaultValue="">
                      {({ fieldProps }: { fieldProps: any }) => (
                        <TextArea {...fieldProps} minimumRows={4} />
                      )}
                    </Field>

                    <FormFooter>
                      <ButtonGroup>
                        <Button type="submit" appearance="primary">
                          {this.props.intl.formatMessage(
                            messages.help_panel_article_rating_form_submit,
                          )}
                        </Button>
                        <Button onClick={this.onRateSubmitCancel}>
                          {this.props.intl.formatMessage(
                            messages.help_panel_article_rating_form_cancel,
                          )}
                        </Button>
                      </ButtonGroup>
                    </FormFooter>
                  </form>
                );
              }}
            </Form>
          </ArticleRateAnswerWrapper>
        )}
      </ArticleContentInner>
    );
  }
}

export default withAnalyticsContext({
  componentName: 'ArticleWasHelpfulForm',
  packageName,
  packageVersion,
})(withAnalyticsEvents()(withHelp(injectIntl(ArticleWasHelpfulForm))));
