import type { NextPage } from 'next'
import { useState } from 'react'
import { trpc } from 'utils/trpc'

const Home: NextPage = () => {
	return (
		<div className='w-full min-h-screen overflow-x-hidden bg-gray-900 text-gray-50'>
			<div className='p-4 text-4xl font-bold text-center'>TODO TRPC</div>
			<div className='p-4'>
				<AddTodo />
				<Todos />
			</div>
		</div>
	)
}

const AddTodo = () => {
	const [text, setText] = useState('')
	const { mutate } = trpc.useMutation('addTodo')

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				if (text.trim().length > 0) {
					mutate({
						text,
					})
				}
			}}
		>
			<input
				className='w-full p-0 bg-transparent focus:outline-none'
				placeholder='Add Todo...'
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
		</form>
	)
}

const Todos = () => {
	const { data, status } = trpc.useQuery(['getTodos'])

	if (status === 'error' || status === 'loading') return <div>...Loading</div>

	return (
		<ul>
			{data?.todos.map((todo) => {
				return <li key={todo.id}>{todo.text}</li>
			})}
		</ul>
	)
}

export default Home
