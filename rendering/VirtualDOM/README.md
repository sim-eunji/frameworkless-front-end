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

새 데이터가 있을 때 마다 가상 루트를 만들고, 실제 요소를 뒤바꿈한다.  
이 방법은 소규모의 개발에서는 충분한 성능을 발휘하지만,  
대규모 프로젝트에서는 성능을 저하시킬 수 있다.

### 가상 DOM

리액트나 뷰에 의해 유명해진 가상 DOM 개념을 알아보자.  
UI 표현은 메모리에 유지되고, 실제 DOM 과 동기화된다.  
실제 DOM은 가능한 적은 작업을 수행(조정, reconfiliation)한다.

```html
<ul>
  <li>First Item</li>
</ul>

// 새 리스트로 변경할 때

<ul>
  <li>First Item</li>
  <li>Second Item</li>
</ul>
```

가상 DOM 방법을 사용하면 시스템은 추가된 마지막 li 가 실제 DOM에 필요한 유일한 작업임을 동적으로 이해한다.

핵심 알고리즘은 바로 diff 알고리즘이다.  
실제 DOM 을 문서에서 분리된 새로운 DOM 요소의 사본으로 바꾸는 가장 빠른 방법을 찾아낸다.

<img width="900" alt="virtual-dom" src="https://user-images.githubusercontent.com/71164350/111196421-9867e600-8600-11eb-8c2f-ad9bc3b0adcc.png">
