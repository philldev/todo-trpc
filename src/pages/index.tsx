import { Todo } from '@prisma/client'
import type { NextPage } from 'next'
import { FC, useState } from 'react'
import { trpc } from 'utils/trpc'
import clsx from 'clsx'

const Home: NextPage = () => {
	return (
		<div className='w-full min-h-screen overflow-x-hidden bg-gray-900 text-gray-50'>
			<div className='p-4 text-4xl font-bold text-center'>TODO TRPC</div>
			<div className=''>
				<AddTodo />
				<Todos />
			</div>
		</div>
	)
}

const AddTodo = () => {
	const [text, setText] = useState('')
	const utils = trpc.useContext()
	const { mutate } = trpc.useMutation('addTodo', {
		onSuccess() {
			setText('')
			utils.invalidateQueries('getTodos')
		},
	})
	return (
		<form
			className='p-4'
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
		<ul className='p-2'>
			{data?.todos.map((todo) => {
				return <Todo todo={todo} key={todo.id} />
			})}
		</ul>
	)
}

const Todo: FC<{
	todo: Todo
}> = ({ todo }) => {
	const utils = trpc.useContext()
	const { mutate } = trpc.useMutation('updateTodo', {
		onSuccess() {
			utils.invalidateQueries('getTodos')
		},
	})
	return (
		<li
			key={todo.id}
			onClick={() => {
				mutate({
					...todo,
					completed: !todo.completed,
				})
			}}
			className={clsx(
				'p-2 cursor-pointer rounded-xl hover:bg-gray-800',
				todo.completed && 'line-through text-gray-500'
			)}
		>
			{todo.text}
		</li>
	)
}

export default Home
