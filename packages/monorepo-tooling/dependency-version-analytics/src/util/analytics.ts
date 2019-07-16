import chalk from 'chalk';
// @ts-ignore
import inquirer from 'inquirer';
import semver from 'semver';
import { analyticsClient } from '@atlassiansox/analytics-node-client';
import {
  UpgradeEvent,
  DependencyType,
  UpgradeType,
  UpgradeSubType,
} from '../types';
import { version as packageVersion } from '../version.json';

function getUpgradeType(
  version: string | undefined,
  previousVersion: string | undefined,
): UpgradeType | null {
  if (previousVersion == null && version != null) {
    return 'add';
  } else if (previousVersion != null && version == null) {
    return 'remove';
  } else if (
    previousVersion != null &&
    version != null &&
    previousVersion !== version
  ) {
    const coercedPrevious: any = semver.coerce(previousVersion);
    const coercedNew: any = semver.coerce(version);
    if (semver.lt(coercedNew, coercedPrevious)) {
      return 'downgrade';
    } else {
      return 'upgrade';
    }
  } else {
    return null;
  }
}

function getUpgradeSubType(
  version: string | undefined,
  previousVersion: string | undefined,
): UpgradeSubType {
  let upgradeSubType: UpgradeSubType | null = null;
  if (version == null || previousVersion == null) {
    return upgradeSubType;
  }
  const parsedOld = semver.coerce(previousVersion);
  const parsedNew = semver.coerce(version);
  if (parsedOld && parsedNew) {
    upgradeSubType = semver.diff(parsedOld.version, parsedNew.version);
  }

  return upgradeSubType;
}

export function createUpgradeEvent(
  name: string,
  version: string | undefined,
  previousVersion: string | undefined,
  date: string,
  optionalArgs: {
    commitHash?: string;
    dependencyType?: DependencyType;
    historical?: boolean;
  } = {},
): UpgradeEvent | null {
  if (Number.isNaN(Date.parse(date))) {
    throw new Error(`Invalid date: '${date}'`);
  }

  const upgradeType = getUpgradeType(version, previousVersion);
  if (!upgradeType) {
    // Not an upgrade for this dependency, return null
    return null;
  }

  const upgradeSubType = getUpgradeSubType(version, previousVersion);
  const eventVersion = upgradeType !== 'remove' ? version : previousVersion;
  const parsedVersion = semver.coerce(eventVersion as string);

  return {
    cliVersion: packageVersion,
    dependencyName: name,
    versionString: eventVersion as string,
    major: parsedVersion ? `${parsedVersion.major}` : null,
    minor: parsedVersion ? `${parsedVersion.minor}` : null,
    patch: parsedVersion ? `${parsedVersion.patch}` : null,
    date: new Date(date).toISOString(),
    upgradeType,
    upgradeSubType,
    ...optionalArgs,
  };
}

export async function sendAnalytics(
  analyticsEvents: UpgradeEvent[],
  {
    dev,
    limit,
    product,
    skipPrompt,
  }: { dev: boolean; limit?: number; product: string; skipPrompt?: boolean },
) {
  const analyticsEnv = dev ? 'dev' : 'prod';
  const eventsToSend =
    limit != null ? analyticsEvents.slice(0, limit) : analyticsEvents;

  const client = analyticsClient({
    env: dev ? 'dev' : 'prod',
    product: product,
  });

  if (!skipPrompt) {
    const answers: any = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: `Are you sure you want to send ${
          eventsToSend.length
        } historical analytics events to '${analyticsEnv}' env for product '${product}?`,
        default: false,
      },
    ]);

    if (!answers.continue) {
      console.log('Aborting');
      process.exit(0);
    }
  }

  try {
    const promises = await Promise.all(
      eventsToSend.map(event => {
        return client.sendTrackEvent({
          anonymousId: 'unknown',
          trackEvent: {
            tags: ['atlaskit'],
            source: '@atlaskit/dependency-version-analytics',
            action: 'upgraded',
            actionSubject: 'akDependency',
            attributes: {
              ...event,
            },
            origin: 'console',
            platform: 'bot',
          },
        });
      }),
    );
    console.log(
      chalk.green(
        `Sent ${promises.length} dependency version upgrade analytics events`,
      ),
    );
  } catch (e) {
    console.error(chalk.red('Sending analytics failed'));
    console.error(e);
    process.exit(1);
  }
}
