import * as React from 'react';
import Button from '@atlaskit/button';
import { HelpPanel } from '../src';
import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';
import { arta } from 'react-syntax-highlighter/dist/styles';
import { Article, ArticleItem } from '../src/model/Article';

export default class extends React.Component {
  state = {
    isOpen: false,
    searchText: 'test',
  };

  openDrawer = () =>
    this.setState({
      isOpen: true,
    });

  closeDrawer = () =>
    this.setState({
      isOpen: false,
    });

  onSearchArticlesSubmit = searchValue => {
    this.setState({ searchText: searchValue });
  };

  onGetArticle = (articleId: string): Promise<Article> => {
    return new Promise(resolve =>
      setTimeout(
        () =>
          resolve({
            id: '1234567890',
            title: 'Article Title',
            body:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque lacinia quis nibh tristique sodales. Sed hendrerit quis ligula in volutpat. Integer nec neque vel sapien commodo ultricies. Donec commodo arcu quis rutrum ornare. Etiam pretium ipsum tellus, eget placerat magna fringilla ut. Duis sit amet ullamcorper nunc. Curabitur vitae lacinia lectus, in pulvinar magna. In pellentesque tortor vitae ipsum ultrices suscipit eu et orci. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin imperdiet feugiat dictum. Aenean vehicula nisl eget est rhoncus, vitae tincidunt purus consequat. Cras ultricies vestibulum quam in tincidunt.      ',
            externalLink: 'http://google.com',
            relatedArticles: [
              {
                id: '01',
                title: 'Related Article 01',
                description: 'Description of Related Article 01',
              },
              {
                id: '02',
                title: 'Related Article 02',
                description: 'Description of Related Article 02',
              },
              {
                id: '03',
                title: 'Related Article 03',
                description: 'Description of Related Article 03',
              },
              {
                id: '04',
                title: 'Related Article 04',
                description: 'Description of Related Article 04',
              },
              {
                id: '05',
                title: 'Related Article 05',
                description: 'Description of Related Article 05',
              },
              {
                id: '06',
                title: 'Related Article 06',
                description: 'Description of Related Article 06',
              },
              {
                id: '07',
                title: 'Related Article 07',
                description: 'Description of Related Article 07',
              },
            ],
          }),
        0,
      ),
    );
  };

  onSearch = (value: string): Promise<ArticleItem[]> => {
    return new Promise(resolve =>
      setTimeout(
        () =>
          resolve([
            {
              id: '01',
              title: 'Found Article 01',
              description: 'Description of Found Article 01',
            },
            {
              id: '02',
              title: 'Found Article 02',
              description: 'Description of Found Article 02',
            },
            {
              id: '03',
              title: 'Found Article 03',
              description: 'Description of Found Article 03',
            },
            {
              id: '04',
              title: 'Found Article 04',
              description: 'Description of Found Article 04',
            },
            {
              id: '05',
              title: 'Found Article 05',
              description: 'Description of Found Article 05',
            },
            {
              id: '06',
              title: 'Found Article 06',
              description: 'Description of Found Article 06',
            },
            {
              id: '07',
              title: 'Found Article 07',
              description: 'Description of Found Article 07',
            },
          ]),
        2500,
      ),
    );
  };

  render() {
    const { isOpen, searchText } = this.state;
    return (
      <div style={{ padding: '2rem' }}>
        <LocaleIntlProvider locale={'en'}>
          <HelpPanel
            isOpen={isOpen}
            onBtnCloseClick={this.closeDrawer}
            articleId="1234"
            onGetArticle={this.onGetArticle}
            onSearch={this.onSearch}
          />
        </LocaleIntlProvider>
        <Button type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>

        <Button type="button" onClick={this.closeDrawer}>
          Close drawer
        </Button>
      </div>
    );
  }
}
