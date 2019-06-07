import { AbstractPresenceResource } from '@atlaskit/mention/resource';
export declare class MockPresenceResource extends AbstractPresenceResource {
  private minTimeout;
  private maxTimeout;
  private statuses;
  constructor(minTimeout?: number, maxTimeout?: number);
  private getTimeout;
  private getStatus;
  private getTime;
  refreshPresence(ids: string[]): void;
}
