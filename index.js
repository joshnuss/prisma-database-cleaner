import path from 'path'

export async function truncateAll() {
	const { PrismaClient, Prisma } = await dynamicallyLoadPrisma()

	const client = new PrismaClient()
	const tables = getTables(Prisma)
	const commands = tables.map((table) => truncateTable(client, table))

	await Promise.all(commands)
	await client.$disconnect()
}

export function truncateTable(client, table) {
	const sql = `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`
	return client.$executeRawUnsafe(sql)
}

function getTables(Prisma) {
	return Prisma.dmmf.datamodel.models.map((model) => {
		return model.dbName || model.name
	})
}

function dynamicallyLoadPrisma() {
	const cwd = process.cwd()
	const prismaClientPath = path.join(cwd, 'node_modules/@prisma/client/index.js')

	return import(prismaClientPath)
}
