import PouchDB from 'pouchdb-browser'
import xs, { Listener, Producer } from 'xstream'

export interface PouchSync {
    type: 'new' | 'change' | 'paused' | 'active' | 'denied' | 'complete'
    info?: any
    error?: any
}

class PouchSyncProducer implements Producer<PouchSync> {
    sync: any

    constructor(private db: PouchDB.Database,
                private remote: PouchDB.Database | string,
                private options?: PouchDB.Replication.ReplicateOptions) {
    }

    start(listener: Listener<PouchSync>) {
        listener.next({ type: 'new', info: this.remote })
        this.sync = this.db.sync(this.remote, this.options)
           .on('change', (info: any) => listener.next({ type: 'change', info }))
            .on('paused', (error: any) => listener.next({ type: 'paused', error }))
            .on('active', () => listener.next({ type: 'active' }))
            .on('denied', (error: any) => listener.next({ type: 'denied', error }))
            .on('complete', (info: any) => {
                listener.next({ type: 'complete', info })
                listener.complete()
            })
            .on('error', (error: any) => listener.error(error))
    }

    stop() {
        this.sync.cancel()
    }
}

/**
 * Factory for a stream of PouchDB synchronization status information
 * 
 * @param db Database instance to synchronize
 * @param remote Database or URL to synchronize
 * @param options PouchDB synchronization options
 */
export function sync(db: PouchDB.Database,
                     remote: PouchDB.Database | string,
                     options?: PouchDB.Replication.ReplicateOptions) {
    return xs.create(new PouchSyncProducer(db, remote, options))
}
