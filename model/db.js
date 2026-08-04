import Database from 'better-sqlite3'

const db = new Database('tasks.db', {
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
        done INTEGER NOT NULL CHECK (done IN (0, 1))
    );
`)

const seedTasks = [
    { id: 'efgh', title: 'Write the API docs', done: 1 },
    { id: 'jdisvogrhvbtrubeu', title: 'Fix the router bugs', done: 0 },
    { id: '9af2e32d-9fa7-4ce3-b4d9-7b2f2b546728', title: 'Seed the sample data', done: 0 }
]

const taskCount = db.prepare('SELECT COUNT(*) AS count FROM tasks').get().count
if (taskCount === 0) {
    const insertSeed = db.prepare('INSERT INTO tasks (id, title, done) VALUES (?, ?, ?)')
    const insertAll = db.transaction((tasks) => {
        for (const task of tasks) insertSeed.run(task.id, task.title, task.done)
    })
    insertAll(seedTasks)
    console.log(`Seeded ${seedTasks.length} sample tasks`)
}

export default db
