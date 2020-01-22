import Bee from 'bee-queue';
import RegistrationNotify from '../app/jobs/RegistrationNotify';
import HelpOrdersNotify from '../app/jobs/HelpOrdersNotify';
import redisConfig from '../config/redis';

const jobs = [RegistrationNotify, HelpOrdersNotify];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    console.log(job);
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.HandleFailure).process(handle);
    });
  }

  HandleFailure(job, err) {
    console.log(`Queue ${job.queue.name} failed: ${err}`);
  }
}

export default new Queue();
