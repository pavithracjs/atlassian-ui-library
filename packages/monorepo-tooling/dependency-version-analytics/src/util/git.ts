// @ts-ignore
import git from 'simple-git/promise';
import { ListLogSummary } from 'simple-git/typings/response';

export type ListLogLine = {
  hash: string;
  date: string;
  message: string;
  refs: string;
  body: string;
  author_name: string;
  author_email: string;
};

export async function getChangesSince(since?: string): Promise<ListLogSummary> {
  const revisionRange = since ? [`${since}..`] : [];
  return git().log([
    '--first-parent',
    '--reverse',
    ...revisionRange,
    './package.json',
  ]);
}

export async function tagCommit(tag: string) {
  return git().tag(['-f', tag]);
}

export async function doesTagExist(tag: string): Promise<boolean> {
  const tags = await git().tags({ [tag]: null });

  return tags.all.length > 0;
}

export async function refetchTag(tag: string) {
  try {
    await git()
      .silent(true)
      .tag(['-d', tag]);
  } catch (e) {
    // Ignore tag not found errors
    if (!/tag.*not found/.test(e.message)) {
      throw e;
    }
  }

  let fetchTagResult;
  try {
    fetchTagResult = await git()
      .silent(true)
      .fetch(['origin', 'tag', tag]);
  } catch (e) {
    // Ignore can't find tag in remote errors
    if (!/Couldn't find remote ref refs\/tags\//.test(e.message)) {
      throw e;
    }
  }
  return { fetchTagResult };
}

export async function getHash(ref: string) {
  return git()
    .silent(true)
    .revparse([ref]);
}
