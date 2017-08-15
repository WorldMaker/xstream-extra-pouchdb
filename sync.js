"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xstream_1 = require("xstream");
var PouchSyncProducer = (function () {
    function PouchSyncProducer(db, remote, options) {
        this.db = db;
        this.remote = remote;
        this.options = options;
    }
    PouchSyncProducer.prototype.start = function (listener) {
        listener.next({ type: 'new', info: this.remote });
        this.sync = this.db.sync(this.remote, this.options)
            .on('change', function (info) { return listener.next({ type: 'change', info: info }); })
            .on('paused', function (error) { return listener.next({ type: 'paused', error: error }); })
            .on('active', function () { return listener.next({ type: 'active' }); })
            .on('denied', function (error) { return listener.next({ type: 'denied', error: error }); })
            .on('complete', function (info) {
            listener.next({ type: 'complete', info: info });
            listener.complete();
        })
            .on('error', function (error) { return listener.error(error); });
    };
    PouchSyncProducer.prototype.stop = function () {
        this.sync.cancel();
    };
    return PouchSyncProducer;
}());
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
