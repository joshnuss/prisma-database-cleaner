import path from 'path'

export async function truncateAll () {
	const { PrismaClient, Prisma } = await dynamicallyLoadPrisma()

	const client = new PrismaClient()
	const tables = getTables(Prisma)
	const commands = tables.map((table) => truncateTable(client, table))

	if (client.db.provider === 'mysql') await client.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS=0')
	await Promise.all(commands)
	if (client.db.provider === 'mysql') await client.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS=1')

	await client.$disconnect()
}

export function truncateTable (client, table) {
	let sql

	switch (client.db.provider) {
		case "postgresql":
			sql = `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`
			break
		case "mysql":
			sql = `TRUNCATE TABLE ${table}`
			break
		default:
			throw new Error(`${client.db.provider} is not supported yet. Please open a PR`)
	}

	return client.$executeRawUnsafe(sql)
}

function getTables (Prisma) {
	return Prisma.dmmf.datamodel.models.map((model) => {
		return model.dbName || model.name
	})
}

function dynamicallyLoadPrisma () {
	const cwd = process.cwd()
	const prismaClientPath = path.join(cwd, 'node_modules/@prisma/client/index.js')

	return import(prismaClientPath)
}
