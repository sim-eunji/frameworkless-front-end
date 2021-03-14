# 렌더링 

순수 자바스크립트를 바탕으로 TodoMVC 어플리케이션을 만들어보자.  

동적인 개발을 위해 to-do 리스트 데이터를 가져와 다음을 업데이트해야함. 

- 필터링된 todo 리스트를 가진 ui
- 완료되지 않은 todo 수의 span 
- selected 클래스를 오른쪽에 추가한 필터 유형을 가진 링크 

### `view.js` 파일 

뷰 함수는 기본으로 사용되는 타깃 DOM요소를 받는다.  
그 후 원래 노드를 **복제(cloneNode)**하고, **state 매개변수**를 사용해 업데이트하고 새 노드를 반환한다.  
위의 DOM 수정은 어디까지나 가상(virtual)이고, 실제 수정 사항을 반영해주기 위해 컨트롤러를 작성한다.  


### `index.js` 파일 

**렌더링 엔진**은 `window.requestAnimationFrame`을 기반으로 한다.  
그 외 DOM 조작이나 애니메이션은 이 DOM API를 사용해야한다. 

콜백 내에서 DOM 작업을 수행하면 더 효율적이 된다.   
이 API는 메인 스레드를 차단하지 않으면서,  다음 다시 그리기(repaint)가 이벤트 루프에서 스케줄링 되기 직전에 실행된다. 

[더 자세한 내용 보러가기](
 https://developer.mozilla.org/ko/docs/Web/API/Window/requestAnimationFrame 
)

<img width="960" alt="static-render" src="https://user-images.githubusercontent.com/71164350/111075342-f75b2b80-852a-11eb-96ff-e6f645901e77.png">

### TodoMVC v1 의 문제점 

여기서의 렌더링 방식은 `window.requestAnimationFrame`와 가상 노드 조작을 통해 충분한 성능을 보여주지만, 뷰 함수는 읽기 힘들다.  

- **하나의 거대한 함수** : 여러 DOM 요소를 조작하는 함수가 단 하나뿐
- **동일한 작업을 수행하는 여러 방법** : 문자열을 통해 리스트 항목 생성 

이를 바탕으로 뷰를 좀 더 작은 함수로 나누고 일관성 있게 작업해보자. 

[TodoMVC v2 파트로 이동 ...](https://github.com/sim-eunji/frameworkless-front-end/tree/master/rendering/TodoMVC-v2)