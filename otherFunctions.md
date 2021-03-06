# tmlTitle emojier
---
tmlTitle.js의 네번째 기능입니다. 텍스트로 표현한 이모티콘을 유니코드 이모티콘 문자로 변경해줍니다.

### Index
* [구성 속성](#구성-속성)
* [스크립트 적용 방법](#스크립트-적용-방법)

## 구성 속성
이 기능의 구성 속성은 다음과 같습니다. **굵게 표시된 속성은 필수 값입니다.**

|속성 이름                  |데이터 타입            |기본값     |설명   							|
|--------------------------:|:----------------------|:---------:|-----------------------------------|
|**contentQuery**			|Array(String)			|-			|글의 시작을 담고 있는 태그 쿼리	|
|contentTag                 |Array(String)          |['p', 'li']|적용할 태그 목록                   |

### 스크립트 적용 방법
스크립트 적용은 [이 문서를 확인](readme.md#스크립트-적용-방법)하세요. 이 기능을 이용하기 위한 코드는 다음과 같습니다.
```
window.addEventListener('load', function () {
    tmlTitle({
        emojier:{
            contentQuery:['div.area_view']
        }
    });
});
```

컨텐츠 쿼리를 찾는 방법은 [다음](indexor.md#쿼리-찾기)을 참고하세요


# tmlTitle codeTagManager
---
**설명**

코드 블럭을 사용할 때 가장 불편한 것이 바로 들여쓰기를 할 때 탭 문자와 띄어쓰기의
혼용입니다. 더욱이나 탭 문자는 들여쓰기가 길어서 코드를 확인함에 있어 불편함이 더 크죠.

이 스크립트는 이런 문제를 해결하기 위해 코드의 ***모든 들여쓰기 문자를 띄어쓰기 4 개로 통일***합니다.

또한, ***불필요한 들여쓰기는 최소화하는 것을 보장***합니다. 만일 아래의 코드가 존재한다고 가정하면
```
        int main(void){
            // do Something
        }
```
<br>

아래처럼 변경됩니다.
```
int main(void){
    // do Something
}
```


## 스크립트 적용 방법
스크립트는 아래와 같은 방법을 이용해 사용할 수 있습니다.
```
window.addEventListener('load', function () {
    tmlTitle({
        codeTabManager:true
    });
});
```