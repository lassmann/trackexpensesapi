/**
 * Family model events
 */

'use strict';

import {EventEmitter} from 'events';
var FamilyEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
FamilyEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Family) {
  for(var e in events) {
    let event = events[e];
    Family.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    FamilyEvents.emit(event + ':' + doc._id, doc);
    FamilyEvents.emit(event, doc);
  };
}

export {registerEvents};
export default FamilyEvents;
