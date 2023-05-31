import { readMigrationFiles } from 'drizzle-orm/migrator'
import { readdir, writeFile } from 'fs/promises'
import { join } from 'path'

const input = join('.', 'drizzle-migrations')
const output = join(
  '.',
  'src',
  'implementations',
  'hydrated-drizzle-migrations'
)

async function hydrate(input, output) {
  return Promise.all(
    (await readdir(input, { withFileTypes: true }))
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => {
        const migrations = readMigrationFiles({
          migrationsFolder: join(input, dirent.name),
        })
        return writeFile(
          join(output, `${dirent.name}.json`),
          JSON.stringify(migrations)
        )
      })
  )
}

await hydrate(input, output)
