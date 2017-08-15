"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xstream_1 = require("xstream");
var PouchChangeProducer = (function () {
    function PouchChangeProducer(db, options) {
        this.db = db;
        this.options = options;
    }
    PouchChangeProducer.prototype.start = function (listener) {
        this.emitter = this.db.changes(this.options)
            .on('change', function (change) { return listener.next(change); })
            .on('complete', function (info) { return listener.complete(); })
            .on('error', function (error) { return listener.error(error); });
    };
    PouchChangeProducer.prototype.stop = function () {
        if (this.emitter) {
            this.emitter.cancel();
        }
    };
    return PouchChangeProducer;
}());
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
