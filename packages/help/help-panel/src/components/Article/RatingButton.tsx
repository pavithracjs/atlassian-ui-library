import * as React from 'react';
import { withHelp, HelpContextInterface } from '../HelpContext';
import { ArticleFeedback } from '../../model/Article';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import Button, { ButtonGroup } from '@atlaskit/button';
import { gridSize } from '@atlaskit/theme';
import Form, { Field, FormFooter } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';
import TextArea from '@atlaskit/textarea';

import {
  ArticleContentInner,
  ArticleRateText,
  ArticleRateAnswerWrapper,
} from './styled';
import { messages } from '../../messages';

interface Props {}
interface State {
  wasHelpful: boolean | null;
}

export class RatingButton extends React.Component<
  Props & InjectedIntlProps & HelpContextInterface,
  State
> {
  state = {
    wasHelpful: null,
  };

  onWasHelpfulOptionClicked = (wasHelpful: boolean) => {
    this.setState({ wasHelpful });
  };

  onRateSubmit = (data: ArticleFeedback) => {
    const { help } = this.props;
    if (help.onWasHelpfulSubmit) {
      help.onWasHelpfulSubmit(data);
    }
  };

  onRateSubmitCancel = () => {
    this.setState({ wasHelpful: null });
  };

  render() {
    const { help, intl } = this.props;

    const negativeRateReason = [
      {
        name: 'negativeRateReason',
        value: 'noAccurate',
        label: intl.formatMessage(messages.help_panel_article_rating_accurate),
      },
      {
        name: 'negativeRateReason',
        value: 'noClear',
        label: intl.formatMessage(messages.help_panel_article_rating_clear),
      },
      {
        name: 'negativeRateReason',
        value: 'noRelevant',
        label: intl.formatMessage(messages.help_panel_article_rating_relevant),
      },
    ];

    if (help.onWasHelpfulSubmit) {
      return (
        <ArticleContentInner>
          <ArticleRateText style={{ paddingRight: `${gridSize()}px` }}>
            {intl.formatMessage(messages.help_panel_article_rating_title)}
          </ArticleRateText>
          <ButtonGroup>
            <Button
              onClick={() => this.onWasHelpfulOptionClicked(true)}
              appearance={
                this.state.wasHelpful === true ? 'primary' : 'default'
              }
            >
              {intl.formatMessage(
                messages.help_panel_article_rating_option_yes,
              )}
            </Button>
            <Button
              onClick={() => this.onWasHelpfulOptionClicked(false)}
              appearance={
                this.state.wasHelpful === false ? 'primary' : 'default'
              }
            >
              {intl.formatMessage(messages.help_panel_article_rating_option_no)}
            </Button>
          </ButtonGroup>
          {this.state.wasHelpful !== null && (
            <ArticleRateAnswerWrapper>
              <Form onSubmit={this.onRateSubmit}>
                {({ formProps }: { formProps: any }) => {
                  return (
                    <form {...formProps} name="form-example">
                      <ArticleRateText>
                        {intl.formatMessage(
                          messages.help_panel_article_rating_form_title,
                        )}
                      </ArticleRateText>
                      {!this.state.wasHelpful && (
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
                            Submit
                          </Button>
                          <Button onClick={this.onRateSubmitCancel}>
                            Cancel
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

    return null;
  }
}

export default injectIntl(withHelp(RatingButton));
