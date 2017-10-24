"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xstream_1 = require("xstream");
class PouchChangeProducer {
    constructor(db, options) {
        this.db = db;
        this.options = options;
    }
    start(listener) {
        this.emitter = this.db.changes(this.options)
            .on('change', change => listener.next(change))
            .on('complete', () => listener.complete())
            .on('error', error => listener.error(error));
    }
    stop() {
        if (this.emitter) {
            this.emitter.cancel();
        }
    }
}
/**
 * Factory for a stream of PouchDB changes.
 *
 * @param db Database to watch changes of
 * @param options PouchDB Changes options
 */
function changes(db, options) {
    return xstream_1.default.create(new PouchChangeProducer(db, options));
}
exports.changes = changes;
