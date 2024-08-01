const { CronJob } = require('cron');

class JobScheduler {
  constructor() {
    this.jobs = new Map();
  }

  scheduleJob(name, cronTime, onTick, onComplete, startNow = true, timeZone = 'UTC') {
    if (this.jobs.has(name)) {
      console.error(`Job with name "${name}" already exists.`);
      throw new Error(`Job with name "${name}" already exists.`);
    }

    const job = new CronJob(cronTime, onTick, onComplete, startNow, timeZone);
    this.jobs.set(name, job);
    return job;
  }

  getJob(name) {
    return this.jobs.get(name);
  }

  removeJob(name) {
    const job = this.jobs.get(name);
    if (job) {
      job.stop();
      this.jobs.delete(name);
    }
  }

  startJob(name) {
    const job = this.jobs.get(name);
    if (job && !job.running) {
      job.start();
    }
  }

  stopJob(name) {
    const job = this.jobs.get(name);
    if (job && job.running) {
      job.stop();
    }
  }
}

module.exports = new JobScheduler();



// how to use JobScheduler function ------------------------------------------------------

// // Define the job function
// const jobFunction = () => {
//   console.log('Job executed:', new Date().toString());
// };

// // Define the job completion function
// const onComplete = () => {
//   console.log('Job completed');
// };

// // Schedule a job to run every minute
// try {
//   jobScheduler.scheduleJob('exampleJob', '* * * * *', jobFunction, onComplete);
// } catch (error) {
//   console.error(error.message);
// }