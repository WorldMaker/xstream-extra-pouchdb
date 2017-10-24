"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xstream_1 = require("xstream");
class PouchSyncProducer {
    constructor(db, remote, options) {
        this.db = db;
        this.remote = remote;
        this.options = options;
    }
    start(listener) {
        listener.next({ type: 'new', info: this.remote });
        this.sync = this.db.sync(this.remote, this.options)
            .on('change', (info) => listener.next({ type: 'change', info }))
            .on('paused', (error) => listener.next({ type: 'paused', error }))
            .on('active', () => listener.next({ type: 'active' }))
            .on('denied', (error) => listener.next({ type: 'denied', error }))
            .on('complete', (info) => {
            listener.next({ type: 'complete', info });
            listener.complete();
        })
            .on('error', (error) => listener.error(error));
    }
    stop() {
        this.sync.cancel();
    }
}
/**
 * Factory for a stream of PouchDB synchronization status information
 *
 * @param db Database instance to synchronize
 * @param remote Database or URL to synchronize
 * @param options PouchDB synchronization options
 */
function sync(db, remote, options) {
    return xstream_1.default.create(new PouchSyncProducer(db, remote, options));
}
exports.sync = sync;
