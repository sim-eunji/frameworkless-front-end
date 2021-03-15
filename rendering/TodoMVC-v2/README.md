# TodoMVC v2 리팩토링 

먼저 작성했던 TodoMVC 문제점을 생각하면서 뷰단위로 함수를 쪼개서 작성한다.   
이들 함수는 **컴포넌트 기반 라이브러리**의 첫 번째 초안이된다. 

## 데이터 속성 (data-attributes) 사용하기 

HTML5부터는 데이터 속성이라는 개념이 추가되었는데, HTML 요소의 'data-'로 시작하는 속성이다.   
이러한 데이터 속성은 특정한 데이터를 DOM 요소에 저장해두기 위함이 목적이다. 

### html 문법

`data-*`로 시작되는 속성은 무엇이든 사용 가능하다. 
화면에 안 보이게 글이나 추가 정보를 엘리멘트에 담아 놓을 수 있다. 

```html
<article
  id="electriccars"
  data-columns="3"
  data-index-number="12314"
  data-parent="cars">
...
</article>
```

### JavaScript 에서 사용하기 

`getAttribute()` 를 사용, dataset 객체를 통해 data 속성을 가져오기 위해서는 속성 이름의 data- 뒷 부분을 사용

```javascript
var article = document.getElementById('electriccars');

article.dataset.columns // "3"
article.dataset.indexNumber // "12314"
article.dataset.parent // "cars"
```

## Registry; 구성 요소의 인덱스

레지스트리는 애플리케이션에서 사용할 수 있는 모든 컴포넌트의 인덱스로,   
이 예제에서는 아래와 같은 자바스크립트 객체로 사용한다.  

```javascript
const registry = {
  'todos': todosView,
  'counter': counterView,
  'filters': filtersView
}
```

레지스트리의 키는 `data-component` 속성 값과 일치하며,  
이것은 컴포넌트 기반 렌더링 엔진의 핵심 메커니즘이다.  

이 메커니즘은 루트 컨테이너 뿐만 아니라 앞으로 생성할 모든 컴포넌트에도 적용되어야한다.  
이렇게 하면 모든 컴포넌트는 다른 컴포넌트 내에서도 사용될 수 있다.  
이런 재사용성은 컴포닌트 기반 애플리케이션에서 필수적이다.  

위와 같은 작업을 위해선 모든 컴포넌트가 data-component 속성의 값을 읽고,   
올바른 함수를 자동으로 호출하는 기본 컴포넌트에서 상속돼야 한다.  

하지만 순수 함수로 작성하고 있기 때문에 컴포넌트를 래핑해주는 **고차함수**를 생성해야한다.  

고차함수 렌더링 
```javascript
const renderWrapper = (component) => {
  return (targetElement, state) => {
    const element = component(targetElement, state)
    const childComponent = element.querySelectorAll('[data-component]')

    Array.from(childComponents).forEach(target => {
      const name = target.dataset.component
      const child = registry[name]

      if (!child) { return }

      target.replaceWith((child(target, state)))
    })

    return element
  }
}
```

원래의 컴포넌트를 가져와 동일한 서명의 새로운 컴포넌트를 반환한다.   
래퍼는 레지스트리에서 data-component 속성을 가진 모든 DOM 요소를 찾고,   
발견되면 자식 구성요소를 호출한다. 재귀함수처럼 마지막 구성요소까지 탐색 할 수 있다.    

다음은 레지스트리에 구성 요소를 추가하는 함수다. 

```javascript
const add = (name, component) => {
  registry[name] = renderWrapper(component)
}
```

최초 DOM 요소에서 렌더링하는 메서드도 작성해 줘야한다. 

```javascript
const renderRoot = (root, state) => {
  const cloneComponent = root => {
    return root.cloneNode(true)
  }
  return renderWrapper(cloneComponent)(root, state)
}
```

![image](https://user-images.githubusercontent.com/71164350/111098015-fb686700-8585-11eb-84f8-5cddcc1e18f2.png)