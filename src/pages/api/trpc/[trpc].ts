import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { z } from 'zod'
import prisma from 'lib/prisma'

export const appRouter = trpc
	.router()
	.mutation('addTodo', {
		input: z.object({
			text: z.string(),
		}),
		async resolve({ input }) {
			await prisma.todo.create({
				data: {
					text: input.text,
				},
			})
		},
	})
	.query('getTodos', {
		async resolve() {
			const todos = await prisma.todo.findMany()
			return {
				todos,
			}
		},
	})

// export type definition of API
export type AppRouter = typeof appRouter

// export API handler
export default trpcNext.createNextApiHandler({
	router: appRouter,
	createContext: () => null,
})
