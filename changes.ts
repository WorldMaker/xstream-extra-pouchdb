import PouchDB from 'pouchdb-browser'
import xs, { Listener, Producer } from 'xstream'

class PouchChangeProducer implements Producer<PouchDB.Core.ChangesResponseChange<{}>> {
    emitter: PouchDB.Core.Changes<{}>

    constructor(private db: PouchDB.Database, private options?: PouchDB.Core.ChangesOptions) {
    }

    start(listener: Listener<PouchDB.Core.ChangesResponseChange<{}>>) {
        this.emitter = this.db.changes(this.options)
            .on('change', change => listener.next(change))
            .on('complete', info => listener.complete())
            .on('error', error => listener.error(error))
    }

    stop() {
        if (this.emitter) {
            this.emitter.cancel()
        }
    }
}

/**
 * Factory for a stream of PouchDB changes.
 * 
 * @param db Database to watch changes of
 * @param options PouchDB Changes options
 */
export function changes(db: PouchDB.Database, options?: PouchDB.Core.ChangesOptions) {
    return xs.create(new PouchChangeProducer(db, options))
}
