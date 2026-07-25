import Database from 'better-sqlite3'

const db = new Database('tasks.db', {
    verbose: console.log,
    fileMustExist: false,
    readonly: false
})

console.log(`Database connection status: ${db.open}`)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks(
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        done INTEGER CHECK (done IN (0, 1))
    )
`)

export default db