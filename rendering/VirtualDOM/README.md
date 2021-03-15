# 동적 데이터 렌더링을 위한 가상 DOM

기존에 작성한 예제들은 정적 데이터를 사용했다.  
하지만 실제 어플리케이션에서는 사용자에 의해 데이터가 변경된다.

지금은 이벤트로 값이 변경되는 게 아닌 5초마다 상태를 변경해보도록 하자.

```javascript
const render = () => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector('.todoapp')
    const newMain = registry.renderRoot(main, state)
    main.replaceWith(newMain)
  })
}

window.setInterval(() => {
  state.todos = getTodos()
  render()
}, 5000)

render()
```
