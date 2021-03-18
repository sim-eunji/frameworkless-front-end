# TodoMVC에 이벤트 추가

### 개발에 들어가기 앞서 추가할 이벤트 목록

<img width="665" alt="스크린샷 2021-03-16 오후 2 14 22" src="https://user-images.githubusercontent.com/71164350/111259433-34760980-8662-11eb-980c-3c640c0ac60a.png">

- **항목 삭제** : 행의 삭제 버튼 클릭
- **항목의 완료 토글** : 행의 왼쪽 버튼 클릭
- **필터 변경** : 하단의 필터 이름 클릭
- **항목 생성** : Input 텍스트에 값을 입력하고 키보드 Enter 누른다.
- **완성된 모든 항목 삭제** : `clear completed` 레이블 클릭
- **모든 항목의 완료 여부 토글** : 왼쪽 상단 모서리의 V자 클릭
- **항목 편집** : 행을 더블 클릭하고 값 변경 후 키보드에서 Enter를 누른다.

### 자바스크립트로 DOM 노드를 생성하기; 템플릿 요소

`document.createElement API` 를 사용해 비어있는 새 DOM 노드를 생성한다.

```javascript
const newDiv = document.createElement('div')
if (!condition) {
  newDiv.classList.add('disabled')
}

const newSpan = document.createElement('span')
newSpan.textContent = 'Hello World'

newDiv.appendChild(newSpan)
```

위와 같은 방식으로 빈 노드를 생성 후 다양한 핸들러를 추가할 수 있지만 코드를 유지하기 어렵다.

다른 방안은 index.html 파일의 template 태그 안에 todo 요소의 마크업을 유지하는 것이다.

렌더링 엔진의 '스탬프'로 시용할 수 있는 보이지 않는 태그다.

```html
<template id="todo-item">
  <li>
    <div class="view">
      <input class="toggle" type="checkbox" />
      <label> </label>
      <button class="destory"></button>
    </div>

    <input class="edit" />
  </li>
</template>
```
