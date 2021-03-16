# DOM 이벤트 관리

프레임워크 없이 애플리케이션에서 이벤트를 관리하는 방법을 알아보자.

## DOM 이벤트 API

**이벤트**는 웹 애플리케이션에서 발생하는 동작

[전체 이벤트 API 참고](https://developer.mozilla.org/ko/docs/Web/Events)

마우스 이벤트, 키보드 이벤트, 뷰 이벤트를 포함한 사용자가 트리거한 이벤트에 반응 할 수 있다.  
이벤트에 반응하려면 트리거한 DOM 요소에 연결해야 된다.

아래는 기본 클릭 이벤트의 라이프사이클이다.

<img width="849" alt="button-render" src="https://user-images.githubusercontent.com/71164350/111241074-bef94180-863f-11eb-828f-e8fe0eec4114.png">

### 속성에 핸들러 연결

- `on*` 속성을 사용한다.  
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
