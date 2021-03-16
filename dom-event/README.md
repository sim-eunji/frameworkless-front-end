# DOM 이벤트 관리

프레임워크 없이 애플리케이션에서 이벤트를 관리하는 방법을 알아보자.

## DOM 이벤트 API

**이벤트**는 웹 애플리케이션에서 발생하는 동작

[전체 이벤트 API 참고](https://developer.mozilla.org/ko/docs/Web/Events)

마우스 이벤트, 키보드 이벤트, 뷰 이벤트를 포함한 사용자가 트리거한 이벤트에 반응 할 수 있다.  
이벤트에 반응하려면 트리거한 DOM 요소에 연결해야 된다.

아래는 기본 클릭 이벤트의 라이프사이클이다.

<img width="849" alt="button-render" src="https://user-images.githubusercontent.com/71164350/111241074-bef94180-863f-11eb-828f-e8fe0eec4114.png">

## 이벤트 핸들러를 DOM 요소에 연결하는 방법

### 속성에 핸들러 연결

`on*` 속성을 사용한다.  
모든 이벤트 타입마다 DOM 요소에 해당되는 속성을 가진다.  
버튼은 `onclick`, `ondbclick`, `onmouseover`, `onblur`, `onfocus` 속성을 가진다.

```javascript
const button = document.querySelector('button')
button.onclick = () => {
  console.log('Click managed using onclick property! ')
}
```

위의 방법은 빠르지만, 나쁜 관행으로 치부된다.  
 그 이유는 속성을 사용하면 한번에 하나의 핸들러만 연결할 수 있기 때문에,  
 onclick 핸들러를 덮어쓰면 원래 핸들러는 영원히 손실된다.

### addEventListener로 핸들러 연결

이벤트를 처리하는 모든 DOM 노드에 **EventTarget 인터페이스**를 구현한다.  
이 인터페이스의 `addEventListener` 메서드는 이벤트 핸들러를 DOM 노드에 추가한다.

```javascript
const button = document.querySelector('button')
button.addEventListener('click', () => {
  console.log('Clicked using addEventListener')
})
```

첫번째 파라미터는 **이벤트 타입**, 두번째 파라미터에는 이벤트가 트리거 될때의 콜백을 작성한다.

property 메서드와 달리 addEventListener 는 필요한 모든 핸들러를 연결할 수 있다.

DOM에 요소가 존재하지 않으면 메모리 누수를 방지하고자 removeEventListener 메서드를 사용한다.

```javascript
const button = document.querySelector('button')
const firstHandler = () => {
  console.log('First Handler')
}

const secondHandler = () => {
  console.log('Second Handler')
}

button.addEventListener('click', firstHandler)
button.addEventListener('click', secondHandler)

window.setTimeout(() => {
  button.removeEventListener('click', firstHandler)
  button.removeEventListener('click', secondHandler)
  console.log('Removed event handler')
}, 1000)
```

removeEventListener 메서드에 매개변수로 전달할 수 있도록 참조를 유지해야한다.

## 이벤트 객체와 인터페이스

이벤트에는 포인터 좌표, 이벤트 타입, 이벤트 트리거 요소 등 유용한 정보가 많이 들어있다.

```javascript
const button = document.querySelector('button')
button.addEventListener('click', (e) => {
  console.log(`event : ${e}`)
})
```

웹 애플리케이션에 전달된 모든 이벤트에는 Event 인터페이스를 구현하는데,  
타입에 따라 이벤트 객체는 Event 인터페이스를 확장할수 있게 구현할 수 있다.

-> click 이벤트는 MouseEvent 인터페이스를 구현한다.

이 인터페이스에는 이벤트 중 포인터의 좌표나 이동에 대한 정보와 다른 유용한 데이터가 포함되어있다.

<img width="537" alt="event-interface" src="https://user-images.githubusercontent.com/71164350/111243849-15b54a00-8645-11eb-960d-80091629461d.png">
