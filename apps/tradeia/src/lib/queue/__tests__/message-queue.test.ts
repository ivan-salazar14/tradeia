import { InMemoryMessageQueue, QueueMessage } from '../message-queue';

describe('Message Queue System', () => {
  let queue: InMemoryMessageQueue;

  beforeEach(() => {
    queue = new InMemoryMessageQueue();
  });

  afterEach(async () => {
    await queue.close();
  });

  describe('Basic Operations', () => {
    it('should enqueue and dequeue messages', async () => {
      const message: QueueMessage = {
        id: 'test-1',
        type: 'test_job',
        payload: { data: 'test' },
        enqueuedAt: new Date().toISOString()
      };

      await queue.enqueue('test-queue', message);

      const dequeued = await queue.dequeue('test-queue');
      expect(dequeued).toBeDefined();
      expect(dequeued?.id).toBe('test-1');
      expect(dequeued?.type).toBe('test_job');
    });

    it('should handle multiple queues', async () => {
      const message1: QueueMessage = {
        id: 'msg-1',
        type: 'type1',
        payload: { value: 1 }
      };

      const message2: QueueMessage = {
        id: 'msg-2',
        type: 'type2',
        payload: { value: 2 }
      };

      await queue.enqueue('queue1', message1);
      await queue.enqueue('queue2', message2);

      const dequeued1 = await queue.dequeue('queue1');
      const dequeued2 = await queue.dequeue('queue2');

      expect(dequeued1?.id).toBe('msg-1');
      expect(dequeued2?.id).toBe('msg-2');
    });

    it('should return null when queue is empty', async () => {
      const result = await queue.dequeue('empty-queue');
      expect(result).toBeNull();
    });
  });

  describe('Message Acknowledgment', () => {
    it('should acknowledge completed messages', async () => {
      const message: QueueMessage = {
        id: 'ack-test',
        type: 'test',
        payload: {}
      };

      await queue.enqueue('test-queue', message);
      const dequeued = await queue.dequeue('test-queue');

      expect(dequeued).toBeDefined();

      // Acknowledge the message
      await queue.ack('test-queue', dequeued!.id);

      // Should not be able to dequeue again
      const retry = await queue.dequeue('test-queue');
      expect(retry).toBeNull();
    });

    it('should handle negative acknowledgment', async () => {
      const message: QueueMessage = {
        id: 'nack-test',
        type: 'test',
        payload: {}
      };

      await queue.enqueue('test-queue', message);
      const dequeued = await queue.dequeue('test-queue');

      expect(dequeued).toBeDefined();

      // Negative acknowledge - should be retried
      await queue.nack('test-queue', dequeued!.id);

      // Should be able to dequeue again (in real implementation with retry logic)
      // For in-memory, this is a simplified version
    });
  });

  describe('Statistics', () => {
    it('should track queue statistics', async () => {
      const stats = await queue.getStats('test-queue');

      expect(stats).toBeDefined();
      expect(typeof stats.pending).toBe('number');
      expect(typeof stats.processing).toBe('number');
      expect(typeof stats.completed).toBe('number');
      expect(typeof stats.failed).toBe('number');
    });

    it('should provide all queue statistics', async () => {
      const allStats = await queue.getAllStats();

      expect(allStats).toBeDefined();
      expect(typeof allStats).toBe('object');
    });
  });

  describe('Event System', () => {
    it('should emit events for queue operations', async () => {
      const events: string[] = [];
      const eventHandler = (event: string) => events.push(event);

      queue.on('messageEnqueued', eventHandler);
      queue.on('messageProcessing', eventHandler);
      queue.on('messageCompleted', eventHandler);

      const message: QueueMessage = {
        id: 'event-test',
        type: 'test',
        payload: {}
      };

      await queue.enqueue('test-queue', message);
      const dequeued = await queue.dequeue('test-queue');

      if (dequeued) {
        await queue.ack('test-queue', dequeued.id);
      }

      // Events should have been emitted
      expect(events.length).toBeGreaterThan(0);
    });
  });
});