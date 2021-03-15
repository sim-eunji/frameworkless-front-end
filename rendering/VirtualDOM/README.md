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

### 간단한 가상 DOM 구현

메인 컨트롤러에서 `replaceWith` 대신 사용할 알고리즘을 작성해보자.

```javascript
const render = () => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector('.todoapp')
    const newMain = registry.renderRoot(main, state)
    applyDiff(document.body, main, newMain)
  })
}
```

```javascript
const applyDiff = (parentNode, realNode, virtualNode) => {
  // 새 노드가 정의되지 않은 경우 실제 노드 삭제
  if (realNode && !virtualNode) {
    realNode.remove()
    return
  }

  // 실제 노드가 정의되지 않지만 가상 노드 존재
  if (!realNode && virtualNode) {
    parentNode.appendChild(virtualNode)
  }

  // 가상노드, 실제노드가 정의된 경우는 두 노드간 차이가 있는지를 확인
  if (isNodeChanged(virtualNode, realNode)) {
    realNode.replaceWith(virtualNode)
    return
  }

  // 모든 하위 노드에 대한 동일한 알고리즘 적용
  const realChildren = Array.from(realNode.children)
  const virtualChildren = Array.from(virtualNode.children)

  const max = Math.max(realChildren.length, virtualChildren.length)

  for (let i = 0; i < max; i++) {
    applyDiff(readNode, realChildren[i], virtualChildren[i])
  }
}

const isNodeChanged = (node1, node2) => {
  const n1Attributes = node1.attributes
  const n2Attributes = node2.attributes

  if (n1Attributes.length !== n2Attributes.length) {
    return true
  }

  const differentAttribute = Array.from(n1Attributes).find((attr) => {
    const { name } = attr
    const attribute1 = node1.getAttribute(name)
    const attribute2 = node2.getAttribute(name)

    return attribute1 !== attribute2
  })

  if (differentAttribute) {
    return true
  }

  if (
    node1.children.length === 0 &&
    node2.children.length &&
    node1.textContent !== node2.textContent
  ) {
    return true
  }

  return false
}
```

위 diff 알고리즘에서는 노드와 다른 노드와 비교해 노드가 변경되었는지를 확인한다.

- 속성 수가 다르다.
- 하나 이상의 속성이 변경됐다.
- 노드에는 자식이 없으며, textContent가 다르다.

이러한 검사 수행으로 성능을 높일 수 있다.
