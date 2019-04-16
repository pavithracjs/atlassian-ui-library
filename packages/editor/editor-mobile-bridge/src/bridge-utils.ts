import { toNativeBridge } from './editor/web-to-native';

interface QueryParams {
  theme?: 'dark' | 'light';
}
/**
 * Send an event to which ever bridge it can find.
 * @param bridgeName {string} bridge name
 * @param eventName {string} event name
 * @param props {object} arguments passed
 *
 * For this to work on both bridges their interfaces need to match.
 *
 * We have two main identifiers we use, bridgeName and eventName.
 * For iOS this looks like:
 *  window.webkit.messageHandlers.<bridgeName>.postMessage({
 *    name: eventName,
 *    ...<props>
 *  })
 *
 * And for Android:
 * Props object is spread as args.
 *  window.<bridgeName>.<eventName>(...<props>)
 */

export const sendToBridge = (bridgeName: any, eventName: any, props = {}) => {
  if (window.webkit && window.webkit.messageHandlers[bridgeName]) {
    window.webkit.messageHandlers[bridgeName].postMessage({
      name: eventName,
      ...props,
    });
  } else if ((window as any)[bridgeName]) {
    const args = Object.keys(props).map(key => (props as any)[key]);
    const bridge = (window as any)[bridgeName];
    if (bridge && bridge.hasOwnProperty(eventName)) {
      try {
        bridge[eventName as any](...args);
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(
          `Could not call bridge.${eventName}() with args: ${JSON.stringify(
            args,
          )}`,
        );
      }
    }
  }

  const logs = (window as any).logBridge;
  if (logs) {
    const logName = `${bridgeName}:${eventName}`;
    logs[logName] = logs[logName] || [];
    logs[logName] = logs[logName].concat(props);
  }

  const log = (toNativeBridge as any).log;
  if (log) {
    log(bridgeName, eventName, props);
  }
};

export const parseLocationSearch = (): QueryParams => {
  if (!window) {
    return {};
  }

  return window.location.search
    .slice(1)
    .split('&')
    .reduce((acc: Record<string, string>, current) => {
      const [key, value] = current.split('=');
      acc[key] = value;
      return acc;
    }, {});
};
