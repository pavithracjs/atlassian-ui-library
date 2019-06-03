import { EventEmitter } from 'events';
import { Step } from 'prosemirror-transform';
import {
  CollabEditProvider,
  CollabEvent,
} from '../src/plugins/collab-edit/provider';
import { Transaction } from 'prosemirror-state';

interface Participant {
  sid: string;
  name: string;
  avatar: string;
}

const participants = {
  rick: {
    sid: 'rick',
    name: 'Rick Sanchez',
    avatar:
      'https://pbs.twimg.com/profile_images/897250392022540288/W1T-QjML_400x400.jpg',
  },
  morty: {
    sid: 'morty',
    name: 'Morty Smith',
    avatar:
      'https://pbs.twimg.com/profile_images/685489227082129408/YhGfwW73_400x400.png',
  },
  summer: {
    sid: 'sumsum',
    name: 'Summer Smith',
    avatar:
      'https://pbs.twimg.com/profile_images/878646716328812544/dYdU_OKZ_400x400.jpg',
  },
};

const others = (sid: string) =>
  (Object.keys(participants) as Array<keyof typeof participants>).reduce<
    Participant[]
  >((all, id) => (id === sid ? all : all.concat(participants[id])), []);

class Mediator extends EventEmitter {
  emit(eventName: string, data: any) {
    switch (eventName) {
      case 'init': {
        const { sid, doc } = data as any;
        this.emit(`${sid}:init`, { doc });
        this.emit(`${sid}:connected`, { sid });

        const joined = (Object.keys(participants) as Array<
          keyof typeof participants
        >).reduce<Array<Record<string, string | number>>>((all, id) => {
          const { sid: sessionId, ...rest } = participants[id];
          return all.concat({
            sessionId,
            ...rest,
            lastActive: 0,
          });
        }, []);

        others(sid).forEach(({ sid: xSid }) => {
          window.setTimeout(() => {
            this.emit(`${xSid}:presence`, { joined });
          }, 0);
        });
        return;
      }
      case 'data':
      case 'telepointer': {
        const { sid, ...rest } = data as any;
        others(sid).forEach(({ sid }) => {
          this.emit(`${sid}:${eventName}`, { ...rest });
        });
        return;
      }
    }
    super.emit(eventName, data);
  }
}

const mediator = new Mediator();

export class MockCollabEditProvider implements CollabEditProvider {
  protected getState = () => {};
  protected createStep = (_: object) => {};
  protected sid?: string;
  protected eventBus: any;

  constructor(eventBus: any, sid?: string) {
    // If there's no sid then it's single user, being used for test
    if (sid) {
      this.sid = sid;
      this.eventBus = eventBus;
    } else {
      this.eventBus = new EventEmitter();
    }
  }

  initialize(getState: () => any, createStep: (json: object) => Step) {
    this.getState = getState;
    this.createStep = createStep;
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello World ',
            },
            {
              type: 'mention',
              attrs: {
                id: '0',
                text: '',
              },
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'mention',
              attrs: {
                id: '1',
                text: '',
              },
            },
          ],
        },
      ],
    };

    const { sid } = this;
    this.eventBus.emit('init', { sid, doc });

    return this;
  }

  send(tr: Transaction) {
    const { sid } = this;
    if (tr.steps && tr.steps.length) {
      const json = tr.steps.map(step => step.toJSON());
      this.eventBus.emit('data', { json, sid });
    }
  }

  on(evt: CollabEvent, handler: (args: any) => void) {
    const { sid } = this;
    if (sid) {
      this.eventBus.on(`${sid}:${evt}`, handler);
    } else {
      this.eventBus.on(evt, handler);
    }
    return this;
  }

  off(evt: CollabEvent, handler: (args: any) => void) {
    this.eventBus.off(evt, handler);
    return this;
  }

  unsubscribeAll(evt: CollabEvent) {
    this.eventBus.removeAllListeners(evt);
    return this;
  }

  emit(evt: CollabEvent, ...args: any) {
    const { sid } = this;
    if (sid) {
      this.eventBus.emit(evt, { sid, ...args });
    } else {
      this.eventBus.emit(evt, ...args);
    }
  }

  sendMessage(data: any) {
    const { sid } = this;
    if (sid) {
      this.eventBus.emit(`${data.type}`, { sid, ...data });
    }
  }
}

const getCollabEditProviderFor = <T>(_participants: T) => (sid?: string) =>
  Promise.resolve(new MockCollabEditProvider(mediator, sid));

export const collabEditProvider = getCollabEditProviderFor(participants);
