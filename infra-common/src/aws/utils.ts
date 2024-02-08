export function getRunTimeName(): string {
  return process.env.SERVICE_AWS_RUNTIME_ENV || 'dev';
}

export function getQueueName(event: string): string {
  return `${getRunTimeName()}-${event}`;
}

export function getTopicName(topic: string): string {
  return `${getRunTimeName()}-${topic}`;
}
