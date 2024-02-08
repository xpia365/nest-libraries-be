import { Inject, Injectable } from '@nestjs/common';
import { SNS, SQS } from 'aws-sdk';
import { Logger } from 'winston';
import { getQueueName, getTopicName } from './utils';
import { PublishInput } from 'aws-sdk/clients/sns';

@Injectable()
export class AwsEventService {
  @Inject('winston')
  private readonly logger!: Logger;

  private sns: SNS;

  private snsArn: string;

  private sqsProducer: SQS;

  private sqsEndPoint: string;

  private awsAccountNumber: string;

  constructor(config: SQS.Types.ClientConfiguration) {
    const credentials = {
      accessKeyId: process.env.SERVICE_AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.SERVICE_AWS_SECRET_ACCESS_KEY || '',
    };

    const defaultConfig: SQS.Types.ClientConfiguration = {
      credentials,
      region: process.env.SERVICE_AWS_REGION,
    };
    this.sns = new SNS({
      ...defaultConfig,
      ...config,
    });
    this.snsArn = process.env.SNS_ARN!;

    // Create an SQS Producer
    this.sqsProducer = new SQS({
      ...defaultConfig,
      ...config,
    });
    this.awsAccountNumber = process.env.SERVICE_AWS_ACCOUNT_NUMBER!;
    const region = process.env.SERVICE_AWS_REGION;
    // Create an SQS Consumer
    this.sqsEndPoint = `https://sqs.${region}.amazonaws.com`;
  }

  // Send message to AWS SNS
  async broadcast({
    event,
    payload,
    actionTypes,
  }: {
    event: string;
    payload: unknown;
    actionTypes?: string[];
  }): Promise<void> {
    const params: PublishInput = {
      Message: JSON.stringify({ event, payload }),
      TopicArn: `${this.snsArn}:${getTopicName(event)}`,
    };

    if (actionTypes) {
      params.MessageAttributes = {
        actionTypes: {
          DataType: 'String.Array',
          StringValue: JSON.stringify(actionTypes),
        },
      };
    }

    await this.sns.publish(params).promise();
  }

  // Send message to AWS SQS
  async dispatch({
    event,
    payload,
    queueName,
    delaySeconds,
  }: {
    event: string;
    payload: unknown;
    queueName?: string;
    delaySeconds?: number;
  }): Promise<void> {
    const queue = queueName || getQueueName(event);
    await this.sqsProducer
      .sendMessage({
        DelaySeconds: delaySeconds,
        MessageBody: JSON.stringify({ event, payload }),
        QueueUrl: `${this.sqsEndPoint}/${this.awsAccountNumber}/${queue}`,
      })
      .promise();
  }
}
