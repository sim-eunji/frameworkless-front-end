# TodoMVC v2 리팩토링 

먼저 작성했던 TodoMVC 문제점을 생각하면서 뷰단위로 함수를 쪼개서 작성한다.   
이들 함수는 **구성 요소 라이브러리**의 첫 번째 초안이된다. 

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