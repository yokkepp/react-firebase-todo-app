import { useState, useRef, useEffect } from "react";
import TodoLists from "./components/TodoLists";
import ActiveTodo from "./components/ActiveTodo";
import AddTodoModal from "./components/AddTodoModal";
import SearchCondition from "./components/SearchCondition";

type Todo = {
	title: string;
	description: string;
	timeLimit: string;
	progress: number;
	id: string;
	done: boolean;
};

function App() {
	const inputEl = useRef(null);
	const [isModalOpen, setIsOpenModal] = useState(false);
	const [isSelectedTodo, setIsSelectedTodo] = useState({
		title: "",
		description: "",
		timeLimit: "",
		progress: 0,
		id: ",",
		done: false,
	});
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		timeLimit: "",
		progress: 0,
		id: "",
		done: false,
	});

	const [todos, setTodos] = useState<Todo[]>([]);

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	/**登録ボタンをクリックした時に発火する関数です。
	 * @function
	 * @param e フォームのイベントです
	 */
	const handleRegisterSubmit = (e: any) => {
		e.preventDefault();
		const targetId = crypto.randomUUID();
		setTodos([...todos, { ...formData, id: targetId }]);

		//フォームの初期化
		setFormData({
			title: "",
			description: "",
			timeLimit: "",
			progress: 0,
			done: false,
			id: "",
		});

		handleModalToggle();
	};

	/**登録画面のモーダルウィンドウの表示状態を管理する関数です。
	 *
	 */
	const handleModalToggle = () => {
		if (isModalOpen) {
			setIsOpenModal(false);
		} else {
			setIsOpenModal(true);
		}
	};

	/**選択されたTodoのIDを管理します。
	 *
	 * @param todo 選択されたTodoです。
	 */
	const handleSelectTodo = (todo: any) => {
		setIsSelectedTodo(todo);
	};

	//登録フォームを開いた時に、タイトルにフォーカスする。
	useEffect(() => {
		if (inputEl.current) {
			inputEl.current.focus();
		}
	}, [isModalOpen]);

	//テスト用
	//todosの監視結果
	useEffect(() => {
		console.log(todos);
	}, [todos]);

	return (
		<>
			<AddTodoModal
				isModalOpen={isModalOpen}
				handleRegisterSubmit={handleRegisterSubmit}
				handleChange={handleChange}
				formData={formData}
				inputEl={inputEl}
			/>
			<div className='flex h-screen w-full bg-slate-200'>
				<TodoLists
					todos={todos}
					handleSelectTodo={handleSelectTodo}
					isSelectedTodo={isSelectedTodo}
				/>
				<ActiveTodo
					isSelectedTodo={isSelectedTodo}
					handleModalToggle={handleModalToggle}
				/>
				<SearchCondition />
			</div>
		</>
	);
}

export default App;
