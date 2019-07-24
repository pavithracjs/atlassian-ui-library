import { TaskState } from '@atlaskit/task-decision';

export interface TaskDecisionBridge {
  updateTask(taskId: string, state: TaskState): void;
}

export interface LinkBridge {
  onLinkClick(url: string): void;
}

export interface MediaBridge {
  onMediaClick(mediaId: string, occurrenceKey?: string | null): void;
}

export interface MentionBridge {
  onMentionClick(profileId: string): void;
}

export interface RenderBridge {
  onContentRendered(): void;
}

export default interface WebBridge
  extends LinkBridge,
    TaskDecisionBridge,
    MediaBridge,
    MentionBridge,
    RenderBridge {}

export interface RendererBridges {
  linkBridge?: LinkBridge;
  taskDecisionBridge?: TaskDecisionBridge;
  mediaBridge?: MediaBridge;
  mentionBridge?: MentionBridge;
  renderBridge?: RenderBridge;
}

export type RendererPluginBridges = keyof RendererBridges;

declare global {
  interface Window extends RendererBridges {
    webkit?: any;
  }
}
