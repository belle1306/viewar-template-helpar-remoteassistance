import { Subject } from 'rxjs/Subject';

export default createPubSub();

export function createPubSub() {
  const sinks = {};

  const publish = (event, data) => {
    if (!sinks[event]) {
      console.warn(
        `${event} does not have any registered listeners. Publish cancelled.`
      );
      return false;
    }

    return sinks[event].next(data);
  };

  const subscribe = (event, cb) => {
    if (!cb) {
      console.warn(
        'No callback provided for subscription. Subscription cancelled.'
      );
      return false;
    }

    if (!sinks[event]) {
      Object.assign(sinks, { [event]: new Subject() });
    }

    return sinks[event].subscribe(cb);
  };

  const unsubscribe = event => {
    delete sinks[event];
  };

  return {
    publish,
    subscribe,
    unsubscribe,
    get sinks() {
      return sinks;
    },
  };
}
