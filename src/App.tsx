import { useState, useRef, useEffect } from "react";
import TodoLists from "./components/TodoLists";
import ActiveTodo from "./components/ActiveTodo";
import TodoModal from "./components/TodoModal";
import DeleteConfirmation from "./components/DeleteConfirmation";
import SearchConditions from "./components/SearchConditions";
import {
	doc,
	collection,
	getDocs,
	addDoc,
	deleteDoc,
	updateDoc,
} from "firebase/firestore";
import db from "./firebase";
//TODO:エラーなくimportができるように修正する。

export type Todo = {
	title: string;
	description: string;
	timeLimit: string;
	createdAt: string;
	id: string;
};

export type Conditions = {
	keyWord: string;
	createdAtStart: string;
	createdAtEnd: string;
	timeLimitStart: string;
	timeLimitEnd: string;
};

function App() {
	const inputEl = useRef<HTMLInputElement>(null);
	const [isModalOpen, setIsOpenModal] = useState<boolean>(false);
	const [isSelectedTodo, setIsSelectedTodo] = useState<Todo>({
		title: "",
		description: "",
		timeLimit: "",
		createdAt: "",
		id: "",
	});
	const [formData, setFormData] = useState<Todo>({
		title: "",
		description: "",
		timeLimit: "",
		createdAt: "",
		id: "",
	});
	const [todos, setTodos] = useState<Todo[]>([]);
	const [currentTodos, setCurrentTodos] = useState<Todo[]>([]);
	const [isEditing, setIsEditing] = useState(false);
	const [isDeleteAccept, setIsAccept] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [searchConditions, setSearchConditions] = useState<Conditions>({
		keyWord: "",
		createdAtStart: "",
		createdAtEnd: "",
		timeLimitStart: "",
		timeLimitEnd: "",
	});

	/**フォーム内の値の変更を監視する関数です。
	 *@function
	 * @param e イベントです。
	 */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	/**検索条件内の値の変更を監視する関数です。
	 *@function
	 * @param e イベントです。
	 */
	const handleChangeSearchConditions = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = e.target;
		setSearchConditions((prev) => ({ ...prev, [name]: value }));
	};

	/**
	 * 検索条件を初期化する関数です。
	 * @function
	 */
	const handleResetConditions = () => {
		setSearchConditions({
			keyWord: "",
			createdAtStart: "",
			createdAtEnd: "",
			timeLimitStart: "",
			timeLimitEnd: "",
		});

		setCurrentTodos([]);
	};

	/**登録ボタンをクリックした時に発火する関数です。
	 * @function
	 * @param e フォームのイベントです
	 */
	const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		//作成日を生成する
		const now = new Date();
		const year = now.getFullYear();
		const month = ("0" + (now.getMonth() + 1)).slice(-2);
		const date = ("0" + now.getDate()).slice(-2);
		const hour = ("0" + now.getHours()).slice(-2);
		const min = ("0" + now.getMinutes()).slice(-2);

		const createdAt = `${year}-${month}-${date}T${hour}:${min}`;

		//firebaseにドキュメントを追加する
		const docRef = await addDoc(collection(db, "todos"), {
			...formData,
			createdAt: createdAt,
		});

		//ローカルのStateを変更する
		setTodos([...todos, { ...formData, id: docRef.id, createdAt: createdAt }]);

		//フォームの初期化
		setFormData({
			title: "",
			description: "",
			timeLimit: "",
			createdAt: "",
			id: "",
		});
		handleModalToggle();
	};

	/**
	 * 検索条件に入力した条件を、currentTodosにセットする関数です。
	 * @param e
	 * @function
	 */
	const handleSearchConditionsSubmit = (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		let filteredTodos = [...todos];

		//入力されたキーワードを整形して配列にする。
		//(半角空白+全角空白+半角空白の削除ができなかったので、二度かけています)
		const shapedKeyWord = searchConditions.keyWord
			.trim()
			.replace(/\s+/g, " ")
			.replace(/\s+/g, " ");

		//キーワードのinputタグの値の更新
		setSearchConditions((prev) => {
			return { ...prev, keyWord: shapedKeyWord };
		});

		const keyWordArray = shapedKeyWord.split(" ");

		//1.キーワードでフィルターをかける
		/**
		 * keyWordArrayの要素全てが、targetString1または2に含まれているかを返す
		 * @param keyWordArray 含まれる文字列の配列
		 * @param targetString1 含まれているか確認する文字列1つ目
		 * @param targetString2 含まれているか確認する文字列2つ目
		 * @returns Boolean
		 */
		function checkAllStringsPresent(
			keyWordArray: string[],
			targetString1: string,
			targetString2: string
		) {
			for (let i = 0; i < keyWordArray.length; i++) {
				if (
					!targetString1.includes(keyWordArray[i]) &&
					!targetString2.includes(keyWordArray[i])
				) {
					return false;
				}
			}
			return true;
		}

		//キーワード検索の結果をに格納する
		if (searchConditions.keyWord !== "") {
			filteredTodos = filteredTodos.filter((todo) =>
				checkAllStringsPresent(keyWordArray, todo.title, todo.description)
			);
		}

		//2-1. 作成日でフィルターをかける
		//作成日の下限
		if (searchConditions.createdAtStart !== "") {
			const result = filteredTodos.filter((todo) => {
				const targetDate = todo.createdAt.slice(0, 10);
				const createdAtDate = new Date(targetDate).getTime();
				const createdAtStartDate = new Date(
					searchConditions.createdAtStart
				).getTime();

				if (createdAtDate >= createdAtStartDate) {
					return true;
				} else {
					return false;
				}
			});
			filteredTodos = result;
		}

		//作成日の上限
		if (searchConditions.createdAtEnd !== "") {
			const result = filteredTodos.filter((todo) => {
				const targetDate = todo.createdAt.slice(0, 10);
				const createdAtDate = new Date(targetDate).getTime();
				const createdAtEndDate = new Date(
					searchConditions.createdAtEnd
				).getTime();

				if (createdAtDate <= createdAtEndDate) {
					return true;
				} else {
					return false;
				}
			});
			filteredTodos = result;
		}

		//期限の下限
		if (searchConditions.timeLimitStart !== "") {
			const result = filteredTodos.filter((todo) => {
				const targetDate = todo.timeLimit.slice(0, 10);
				const timeLimitDate = new Date(targetDate).getTime();
				const timeLimitStartDate = new Date(
					searchConditions.timeLimitStart
				).getTime();

				if (timeLimitDate >= timeLimitStartDate) {
					return true;
				} else {
					return false;
				}
			});
			filteredTodos = result;
		}

		//期限の上限
		if (searchConditions.timeLimitEnd !== "") {
			const result = filteredTodos.filter((todo) => {
				const targetDate = todo.timeLimit.slice(0, 10);
				const timeLimitDate = new Date(targetDate).getTime();
				const timeLimitEndDate = new Date(
					searchConditions.timeLimitEnd
				).getTime();

				if (timeLimitDate <= timeLimitEndDate) {
					return true;
				} else {
					return false;
				}
			});
			filteredTodos = result;
		}

		setCurrentTodos(filteredTodos);
	};

	/**登録画面のモーダルウィンドウの表示状態を管理する関数です。
	 *@function
	 */
	const handleModalToggle = () => {
		if (isModalOpen) {
			setIsOpenModal(false);
		} else {
			setIsOpenModal(true);
		}
	};

	/**選択されたTodoのIDを管理します。
	 * @function
	 * @param todo 選択されたTodoです。
	 */
	const handleSelectTodo = (todo: Todo) => {
		setIsSelectedTodo(todo);
	};

	/**todoを削除する関数です。
	 * @function
	 * @param id 削除するtodoのidです。
	 */
	const handleDeleteModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	const doDelete = () => {
		const newTodos = todos.filter((todo) => isSelectedTodo.id !== todo.id);

		setTodos(newTodos);
		setIsDeleteModalOpen(false);

		//firebaseのtodo削除
		deleteDoc(doc(db, "todos", isSelectedTodo.id));

		//isSelectedTodoの初期化
		setIsSelectedTodo({
			title: "",
			description: "",
			timeLimit: "",
			createdAt: "",
			id: "",
		});
	};

	/**todoを編集する編集ボタンをクリックすると発火する関数です。
	 * 新規登録と同様にモーダルを開いて編集可能な状態にします。
	 * @function
	 * @param id 編集するtodoのidです。
	 */
	const handleUpdateButton = (todo: Todo) => {
		handleModalToggle();
		setIsEditing(true);
		setFormData({ ...todo });
	};

	/**
	 * 更新ボタンをクリックするとtargetTodoを更新します。
	 * @function
	 * @param targetTodo 更新対象となるtodoです。
	 */
	const handleUpdateSubmit = (e: any) => {
		e.preventDefault();
		const newTodos = todos.map((todo) => {
			if (isSelectedTodo.id === todo.id) {
				updateDoc(doc(db, "todos", todo.id), formData);
				return formData;
			} else {
				return todo;
			}
		});
		setTodos(newTodos);

		//firebaseの更新

		//フォームの初期化
		setFormData({
			title: "",
			description: "",
			timeLimit: "",
			createdAt: "",
			id: "",
		});
		setIsSelectedTodo({ ...formData });
		setIsEditing(false);
		handleModalToggle();
	};
	// 登録フォームを開いた時に、タイトルにフォーカスする。
	useEffect(() => {
		if (inputEl.current && isModalOpen) {
			inputEl.current.focus();
		}
	}, [isModalOpen]);

	//firebaseからデータを一括取得する
	useEffect(() => {
		const todoData = collection(db, "todos");
		getDocs(todoData).then((result) => {
			const todosArray: Todo[] = [];
			result.forEach((todoData) =>
				todosArray.push({
					id: todoData.id,
					title: todoData.data().title,
					description: todoData.data().description,
					timeLimit: todoData.data().timeLimit,
					createdAt: todoData.data().createdAt,
				})
			);
			setTodos(todosArray);
		});
	}, []);

	return (
		<>
			<TodoModal
				isModalOpen={isModalOpen}
				handleRegisterSubmit={handleRegisterSubmit}
				handleChange={handleChange}
				formData={formData}
				inputEl={inputEl}
				isEditing={isEditing}
				handleUpdateSubmit={handleUpdateSubmit}
				isSelectedTodo={isSelectedTodo}
			/>
			<DeleteConfirmation
				isDeleteModalOpen={isDeleteModalOpen}
				doDelete={doDelete}
				handleDeleteModal={handleDeleteModal}
			/>
			<div className='flex h-screen w-full bg-slate-200'>
				<TodoLists
					todos={todos}
					handleSelectTodo={handleSelectTodo}
					isSelectedTodo={isSelectedTodo}
					handleDeleteModal={handleDeleteModal}
					currentTodos={currentTodos}
				/>
				<ActiveTodo
					isSelectedTodo={isSelectedTodo}
					handleModalToggle={handleModalToggle}
					handleUpdateButton={handleUpdateButton}
				/>
				<SearchConditions
					handleChangeSearchConditions={handleChangeSearchConditions}
					handleSearchConditionsSubmit={handleSearchConditionsSubmit}
					handleResetConditions={handleResetConditions}
					searchConditions={searchConditions}
				/>
			</div>
		</>
	);
}

export default App;
