import { Nullable, getRunTimeName } from 'src/utils';

export const EVENT_PATTERNS = {
  order: {
    create: 'order-create',
  },
  refund: {
    create: 'refund-create',
  },
  search: {
    productSync: 'sync-product-data',
  },
  staff: {
    update: 'staff-update',
  },
  consumer: {
    answerForm: 'consumer-answer-form',
  },
  payment: {
    update: 'payment-update',
  },
  recommendation: {
    timeBased: 'recommendation-time-based',
    userProgress: 'recommendation-user-progress',
  },
  program: {
    createActionItems: 'program-create-action-items',
    participantJoin: 'program-participant-join',
  },
  appointment: {
    create: 'appointment-create',
  },
  healthRecord: {
    stepTrackerUpdate: 'health-record-step-tracker-update',
    exerciseTrackerUpdate: 'health-record-exercise-tracker-update',
  },
  campaignProduct: {
    changed: 'campaign-product-changed',
  },
};

export const AWS_TOPIC_PATTERNS = {
  CONSUMER_ANSWER_FORM: 'consumer-answer-form',
  CONSUMER_UPDATE_PROFILE: 'consumer-update-profile',
  CHOLESTEROL_HEALTH_RECORD_UPDATE: 'cholesterol-health-record-update',
  DAILY_MONITORING_HEALTH_RECORD_UPDATE:
    'daily-monitoring-health-record-update',
};

export const AWS_SQS_PATTERNS = {
  [AWS_TOPIC_PATTERNS.CONSUMER_ANSWER_FORM]: {
    recommendation: 'consumer-answer-form-recommendation',
    healthRecord: 'consumer-answer-form-health-record',
  },
  [AWS_TOPIC_PATTERNS.CONSUMER_UPDATE_PROFILE]: {
    recommendation: 'consumer-update-profile-recommendation',
  },
  [AWS_TOPIC_PATTERNS.CHOLESTEROL_HEALTH_RECORD_UPDATE]: {
    recommendation: 'cholesterol-health-record-update-recommendation',
  },
  [AWS_TOPIC_PATTERNS.DAILY_MONITORING_HEALTH_RECORD_UPDATE]: {
    recommendation: 'daily-monitoring-health-record-update-recommendation',
  },
};

export function getTopicName(topic: string): string {
  return `${getRunTimeName()}-${topic}`;
}

export function getQueueName(event: string): string {
  return `${getRunTimeName()}-${event}`;
}

export function parseMessagePayload(body: string): any {
  try {
    const data = JSON.parse(body);

    // parse payload for SNS case
    if (data.Type === 'Notification') {
      return JSON.parse(data.Message)?.payload || null;
    }

    return data.payload || null;
  } catch (ex) {
    return null;
  }
}

export function parsePayloadEventBridge<Data = unknown>(
  body: string,
): Nullable<Data> {
  try {
    return JSON.parse(body);
  } catch (ex) {
    return null;
  }
}
