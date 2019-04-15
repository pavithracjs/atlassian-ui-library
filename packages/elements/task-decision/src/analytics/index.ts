import {
  createAndFireEvent,
  CreateAndFireEventFunction,
} from '@atlaskit/analytics-next';

export const fabricElementsChannel = 'fabric-elements';

export const createAndFireEventInElementsChannel: CreateAndFireEventFunction = createAndFireEvent(
  fabricElementsChannel,
);
