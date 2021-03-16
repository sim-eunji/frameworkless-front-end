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

## DOM 이벤트 라이프사이클

addEventListener 메서드를 사용해 핸들러를 사용할 때 세 번째 매개변수는 `useCapture` 라고 불리며 기본값은 false 이다.

선택사항이긴 하지만 폭넓은 브라우저 호환성을 얻으려면 포함시켜야한다.

```javascript
button.addEventListener('click', handler, false)
```

```html
<body>
  <div>
    This is a container
    <button>Click Here</button>
  </div>
</body>
```

```javascript
const button = document.querySelector('button')
const div = document.querySelector('div')

div.addEventListener(
  'click',
  () => {
    console.log('Div clicked')
  },
  false
)

button.addEventListener(
  'click',
  () => {
    console.log('Button clicked')
  },
  false
)
```

위 예제에서 이벤트 핸들러는 div와 button의 DOM 요소에 모두 연결되어 있다.

버튼을 클릭하면 button이 div안에 있으므로 button 부터 시작해 두 핸들러가 모두 호출된다.

따라 이벤트 객체는 트리거한 DOM 에서 부터 시작해 모든 조상 노드로 올라간다.

이 매커니즘을 **이벤트 버블링**이라 한다.

Event 인터페이스의 stopPropagation 메서드를 사용하면 버블 체인을 중지할 수 있다.

```javascript
const button = document.querySelector('button')
const div = document.querySelector('div')

div.addEventListener(
  'click',
  () => {
    console.log('Div clicked')
  },
  false
)

button.addEventListener(
  'click',
  (e) => {
    e.stopPropagation()
    console.log('Button clicked')
  },
  false
)
```

예제에서 div 핸들러는 호출되지 않는다.  
위 기술을 사용하는 건 복잡한 레이아웃에선 유용할 순 있지만, 핸들러의 순서에 의존하는 경우 코드를 유지하기 어려워질 수 있다.

이런 경우는 **이벤트 위임** 패턴이 유용할 수 있다.

또 useCpature 매개변수를 사용하여 핸들러의 실행 순서를 반대로 할 수 있다.

```javascript
const button = document.querySelector('button')
const div = document.querySelector('div')

div.addEventListener(
  'click',
  () => {
    console.log('Div clicked')
  },
  true
)

button.addEventListener(
  'click',
  (e) => {
    console.log('Button clicked')
  },
  true
)
```

addEventListener를 호출할 때 useCapture 매개변수에 true 를 사용하면 버블 단계 대신 캡처 단계에 이벤트 핸들러를 추가한다는 것을 의미한다.

버블 단계에서는 핸들러가 상향식(bottom-up)으로 처리되는 반면,  
캡처 단계에서는 반대로 처리된다.

시스템은 <html> 태그에서 핸들러 관리를 시작하고, 이벤트를 트리거한 요소를 만날 때까지 내려간다.

생성된 모든 DOM 이벤트에 대해 브라우저는 캡처 단계(top-down)를 실행한 다음 버블 단계를 실행한 다는 것을 알아두자.

목표 단계(target phase)라고 하는 세번째 단계도 있다. 이 특별한 단계는 목표 요소에 도달할 때 발생한다.

1. 캡터 단계: 이벤트가 html 에서 목표 요소로 이동한다.
2. 목표 단계: 이벤트가 목표 요소에서 도달한다.
3. 버블 단계: 이벤트가 목표 요소에서 html로 이동한다.

일반적으로 버블 단계 핸들러만 사용해도 좋지만, 복잡한 상황을 관리하려면 캡처단계를 알아야 한다.

## 사용자 정의 이벤트 사용

DOM 이벤트 API에서는 사용자가 이벤트 타입을 정의하고 다른 이벤트처럼 처리할 수 있다.

사용자 정의 이벤트를 생성하려면 `customEvent` 생성자 함수를 사용한다.

```javascript
const EVENT_NAME = 'FiveCharInputValue'
const input = document.querySelector('input')

input.addEventListener('input', () => {
  const { length } = input.length
  if (length === 5) {
    const time = new Date().getTime()
    const event = new CustomEvent(EVENT_NAME, {
      detail: { time },
    })

    input.dispatchEvent(event)
  }
})

input.addEventListener(EVENT_NAME, (e) => {
  console.log('handling custom event...', e.detail)
})
```

### 다음은 TodoMVC 앱에 이벤트를 추가해보자
