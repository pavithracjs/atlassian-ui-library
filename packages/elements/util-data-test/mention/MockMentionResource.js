import * as tslib_1 from 'tslib';
import { Search } from 'js-search';
import {
  AbstractMentionResource,
  DefaultMentionNameResolver,
  MentionNameStatus,
} from '@atlaskit/mention/resource';
import debug from '../logger';
import { mentionResult } from './mention-data';
import { MockMentionNameClient } from './MockMentionNameClient';
import { HttpError } from './utils';
var search = new Search('id');
search.addIndex('name');
search.addIndex('mentionName');
search.addIndex('nickname');
search.addDocuments(mentionResult);
export var createMockMentionNameResolver = function() {
  return new DefaultMentionNameResolver(new MockMentionNameClient());
};
var MockMentionResource = /** @class */ (function(_super) {
  tslib_1.__extends(MockMentionResource, _super);
  function MockMentionResource(config) {
    var _this = _super.call(this) || this;
    _this.config = config;
    _this.lastReturnedSearch = 0;
    return _this;
  }
  MockMentionResource.prototype.filter = function(query) {
    var _this = this;
    var searchTime = Date.now();
    var notify = function(mentions) {
      if (searchTime >= _this.lastReturnedSearch) {
        _this.lastReturnedSearch = searchTime;
        var stats = {};
        if (query === 'team') {
          stats.teamMentionDuration = 200;
        } else {
          stats.duration = 100;
        }
        _this._notifyListeners(mentions, stats);
      } else {
        var date = new Date(searchTime).toISOString().substr(17, 6);
        debug('Stale search result, skipping', date, query); // eslint-disable-line no-console, max-len
      }
      _this._notifyAllResultsListeners(mentions);
    };
    var notifyErrors = function(error) {
      _this._notifyErrorListeners(error);
    };
    var minWait = this.config.minWait || 0;
    var randomTime = (this.config.maxWait || 0) - minWait;
    var waitTime = Math.random() * randomTime + minWait;
    setTimeout(function() {
      var mentions;
      if (query === 'error') {
        notifyErrors(new Error('mock-error'));
        return;
      } else if (query === '401' || query === '403') {
        notifyErrors(new HttpError(parseInt(query, 10), 'get off my lawn'));
        return;
      } else if (query) {
        mentions = search.search(query);
      } else {
        mentions = mentionResult;
      }
      notify({
        mentions: mentions,
        query: query,
      });
    }, waitTime + 1);
  };
  // eslint-disable-next-line class-methods-use-this
  MockMentionResource.prototype.recordMentionSelection = function(mention) {
    debug('Record mention selection ' + mention.id);
  };
  MockMentionResource.prototype.resolveMentionName = function(id) {
    debug('(mock)resolveMentionName', id);
    if (!this.config.mentionNameResolver) {
      return {
        id: id,
        name: '',
        status: MentionNameStatus.UNKNOWN,
      };
    }
    return this.config.mentionNameResolver.lookupName(id);
  };
  MockMentionResource.prototype.cacheMentionName = function(id, name) {
    debug('(mock)cacheMentionName', id, name);
    if (this.config.mentionNameResolver) {
      this.config.mentionNameResolver.cacheName(id, name);
    }
  };
  MockMentionResource.prototype.supportsMentionNameResolving = function() {
    var supported = !!this.config.mentionNameResolver;
    debug('supportsMentionNameResolving', supported);
    return supported;
  };
  MockMentionResource.prototype.shouldHighlightMention = function(mention) {
    return mention.id === 'oscar';
  };
  return MockMentionResource;
})(AbstractMentionResource);
export { MockMentionResource };
//# sourceMappingURL=MockMentionResource.js.map
