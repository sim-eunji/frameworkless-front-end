// 필터링된 todo 리스트를 가진 ui
const getTodoElement = (todo) => {
  const { text, completed } = todo
  return `
    <li ${completed ? 'class="completed"' : ''}>
      <div class="view">
        <input
          ${completed ? 'checked' : ''}
          class="toggle"
          type="checkbox">
        <label> ${text} </label>
        <button class="destory"> </button>
      </div>
      <input class="edit" value="${text}">
    </li>
  `
}

// 완료되지 않은 todo 수의 span
const getTodoCount = (todos) => {
  const notCompleted = todos.filter(todo => !todo.completed)
  const { length } = notCompleted

  if (length === 1) return '1 Items left'

  return `${length} Items left`
}

export default (targetElement, state) => {
  const { currentFilter, todos } = state

  const element = targetElement.cloneNode(true)
  const list = element.querySelector('.todo-list')
  const counter = element.querySelector('.todo-count')
  const filters = element.querySelector('.filters')

  list.innerHTML = todos.map(getTodoElement).join('')
  counter.textContent = getTodoCount(todos)

  Array.from(filters.querySelectorAll('li a'))
    .forEach(a => {
      if (a.textContent === currentFilter) {
        a.classList.add('selected')
      } else {
        a.classList.remove('selected')
      }
    })

  return element
}