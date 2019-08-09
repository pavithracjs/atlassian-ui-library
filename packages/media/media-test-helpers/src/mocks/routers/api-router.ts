// eslint-disable-line no-console
import {
  Router,
  Response,
  Request,
  Record,
  RouterOptions,
  RequestHandler,
  Database,
} from 'kakapo';
import uuid from 'uuid/v4';

import { TouchFileDescriptor } from '@atlaskit/media-store';

import {
  DatabaseSchema,
  createCollection,
  createCollectionItem,
} from '../database';
import { defaultBaseUrl } from '../..';
import { Chunk } from '../database/chunk';
import { createUpload } from '../database/upload';
import { mockDataUri } from '../database/mockData';
import { mapDataUriToBlob } from '../../utils';

class RouterWithLogging<M extends DatabaseSchema> extends Router<M> {
  constructor(options?: RouterOptions) {
    super(options);
  }

  register(method: string, path: string, originalHandler: RequestHandler<M>) {
    const handler: RequestHandler<M> = (
      request: Request,
      database: Database<M>,
    ) => {
      let response: Response;
      let requestWithBodyObject: any;
      let error: any;

      try {
        response = originalHandler(request, database);
        let body = request.body;
        try {
          body = JSON.parse(body);
        } catch (e) {}
        requestWithBodyObject = { request: { ...request, body } };
      } catch (e) {
        error = e;
      }

      // eslint-disable-next-line no-console
      console.log({
        method,
        path,
        request: requestWithBodyObject,
        database,
        response: response!,
        error,
      });

      if (error) {
        throw error;
      } else {
        return response!;
      }
    };
    return super.register(method, path, handler);
  }
}

export function createApiRouter(): Router<DatabaseSchema> {
  const router = new RouterWithLogging<DatabaseSchema>({
    host: defaultBaseUrl,
    requestDelay: 10,
  });

  router.post('/collection', ({ body }, database) => {
    const { name } = JSON.parse(body);
    const collection = createCollection(name);
    database.push('collection', collection);
    return { data: collection };
  });

  router.post('/file/binary', ({ headers, body, query }, database) => {
    const { 'Content-Type': mimeType } = headers;
    const { collection, name, occurrenceKey } = query;
    const item = createCollectionItem({
      collectionName: collection,
      name,
      mimeType,
      occurrenceKey,
      blob: body,
    });

    database.push('collectionItem', item);

    return {
      data: {
        id: item.id,
        ...item.details,
      },
    };
  });

  router.get('/collection/:collectionName/items', ({ params }, database) => {
    const { collectionName } = params;
    const contents = database
      .find('collectionItem', {
        collectionName,
      })
      .map(record => record.data);
    return {
      data: {
        nextInclusiveStartKey: Math.floor(Math.random() * 99999),
        contents,
      },
    };
  });

  router.get('/file/:fileId/image', ({ params, query }, database) => {
    const { fileId } = params;
    const { width, height, 'max-age': maxAge = 3600 } = query;
    const record = database.findOne('collectionItem', { id: fileId });
    let blob: Blob;
    if (!record || record.data.blob.type === 'image/svg+xml') {
      const dataUri = mockDataUri(width, height);

      blob = mapDataUriToBlob(dataUri);
    } else {
      blob = record.data.blob;
    }

    return new Response(200, blob, {
      'content-type': blob.type,
      'content-length': blob.size.toString(),
      'cache-control': `private, max-age=${maxAge}`,
    });
  });

  router.get('/file/:fileId/image/metadata', () => {
    return {
      metadata: {
        pending: false,
        preview: {},
        original: {
          height: 4096,
          width: 4096,
        },
      },
    };
  });

  router.get('/picker/accounts', () => {
    return {
      data: [],
    };
  });

  router.head('/chunk/:chunkId', ({ params }, database) => {
    const { chunkId } = params;
    if (database.findOne('chunk', { id: chunkId })) {
      return new Response(200, undefined, {});
    } else {
      return new Response(404, undefined, {});
    }
  });

  router.put('/chunk/:chunkId', ({ params, body }, database) => {
    const { chunkId } = params;

    database.push('chunk', {
      id: chunkId,
      blob: body,
    });

    return new Response(201, undefined, {});
  });

  router.post('/chunk/probe', ({ body }, database) => {
    const requestedChunks = body.chunks;
    const allChunks: Record<Chunk>[] = database.all('chunk') as any;
    const existingChunks: string[] = [];
    const nonExistingChunks: string[] = [];

    allChunks.forEach(({ data: { id } }) => {
      if (requestedChunks.indexOf(id) > -1) {
        existingChunks.push(id);
      } else {
        nonExistingChunks.push(id);
      }
    });

    return new Response(
      200,
      {
        data: {
          results: [
            ...existingChunks.map(() => ({ exists: true })),
            ...nonExistingChunks.map(() => ({ exists: false })),
          ],
        },
      },
      {},
    );
  });

  router.post('/upload', ({ query }, database) => {
    const { createUpTo = '1' } = query;

    const records = database.create('upload', Number.parseInt(createUpTo, 10));
    const data = records.map(record => record.data);

    return {
      data,
    };
  });

  router.put('/upload/:uploadId/chunks', ({ params, body }, database) => {
    const { uploadId } = params;
    const { chunks /*, offset*/ } = JSON.parse(body);

    const record = database.findOne('upload', { id: uploadId });

    database.update('upload', record.id, {
      chunks: [...record.data.chunks, ...chunks],
    });

    return new Response(200, undefined, {});
  });

  router.post('/file', ({ query }, database) => {
    const { collection } = query;
    const item = createCollectionItem({
      collectionName: collection,
    });
    database.push('collectionItem', item);
    return new Response(
      201,
      {
        data: {
          id: item.id,
          insertedAt: Date.now(),
        },
      },
      {},
    );
  });

  router.post('/file/upload', ({ query, body }, database) => {
    const { collection } = query;
    const { name, mimeType /*, uploadId*/ } = JSON.parse(body);

    const record = database.push(
      'collectionItem',
      createCollectionItem({
        name,
        mimeType,
        collectionName: collection,
      }),
    );

    return {
      data: {
        ...record.data.details,
        id: record.data.id,
      },
    };
  });

  router.get('/file/:fileId', ({ params, query }, database) => {
    const { fileId } = params;
    const { collection } = query;

    const record = database.findOne('collectionItem', {
      id: fileId,
      collectionName: collection,
    });

    if (record) {
      return {
        data: {
          id: fileId,
          ...record.data.details,
        },
      };
    } else {
      return new Response(404, undefined, {});
    }
  });

  router.post('/items', ({ body }, database) => {
    const { descriptors } = JSON.parse(body);
    const records = descriptors.map((descriptor: any) => {
      const record = database.findOne('collectionItem', {
        id: descriptor.id,
        // TODO [MS-2249]: add collectionName: descriptor.collection check
      });
      if (record) {
        return {
          type: 'file',
          id: descriptor.id,
          collection: descriptor.collection,
          details: record.data.details,
        };
      }
      return null;
    });

    if (records.length) {
      return {
        data: {
          items: records,
        },
      };
    } else {
      return new Response(404, undefined, {});
    }
  });

  router.post('/file/copy/withToken', (request, database) => {
    const { body, query } = request;
    const { sourceFile } = JSON.parse(body);
    const {
      collection: destinationCollection,
      replaceFileId = uuid(),
      occurrenceKey = uuid(),
    } = query;

    const sourceRecord = database.findOne('collectionItem', {
      id: sourceFile.id,
      collectionName: sourceFile.collection,
    });

    const { details, blob } = sourceRecord.data;

    const existingRecord = database.findOne('collectionItem', {
      id: replaceFileId,
      collectionName: destinationCollection,
      occurrenceKey,
    });
    const record = database.update('collectionItem', existingRecord.id, {
      id: replaceFileId,
      insertedAt: sourceRecord.data.insertedAt,
      occurrenceKey,
      details,
      blob,
      collectionName: destinationCollection,
    });

    return {
      data: record.data,
    };
  });

  router.post('/upload/createWithFiles', ({ body }, database) => {
    const { descriptors } = JSON.parse(body);
    const descriptor: TouchFileDescriptor = descriptors[0];
    database.push(
      'collectionItem',
      createCollectionItem({
        id: descriptor.fileId,
        collectionName: descriptor.collection,
        occurrenceKey: descriptor.occurrenceKey,
      }),
    );

    const uploadRecord = createUpload();
    database.push('upload', uploadRecord);

    return {
      data: {
        created: [
          {
            fileId: descriptor.fileId,
            uploadId: uploadRecord.id,
          },
        ],
      },
    };
  });

  return router;
}
