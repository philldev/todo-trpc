import { Todo } from '@prisma/client'
import type { NextPage } from 'next'
import { FC, useState } from 'react'
import { trpc } from 'utils/trpc'
import clsx from 'clsx'

const Home: NextPage = () => {
	return (
		<div className='w-full min-h-screen overflow-x-hidden bg-gray-900 text-gray-50'>
			<div className='flex items-center p-4'>
				<div className='flex-1'>
					<div className='font-bold'>TODOS</div>
				</div>
				<TodosToolbar />
			</div>
			<div className='py-4 space-y-4'>
				<AddTodo />
				<Todos />
			</div>
		</div>
	)
}

const TodosToolbar = () => {
	const { data, status } = trpc.useQuery(['getTodos'])
	const utils = trpc.useContext()
	const { mutate: deleteCompletedTodos } = trpc.useMutation(
		'deleteCompletedTodos',
		{
			onSuccess() {
				utils.invalidateQueries('getTodos')
			},
		}
	)

	const onRemoveCompletedClick = () => {
		deleteCompletedTodos()
	}

	const completedTodos = data?.todos.filter((t) => t.completed)

	return (
		<div className='flex items-center px-4 space-x-4'>
			<button
				onClick={onRemoveCompletedClick}
				className='px-2 py-1 text-sm font-bold text-red-500 rounded-md hover:bg-gray-800 hover:bg-opacity-95 disabled:opacity-50 disabled:cursor-not-allowed'
				disabled={completedTodos?.length === 0}
			>
				Remove completed
			</button>
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
			className='px-4'
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
		<ul className='px-2'>
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
