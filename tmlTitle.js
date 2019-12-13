
/*
// https://pang2h.tistory.com/
// https://github.com/mijien0179/tmlTitle.js
//
// v1.0
// 2019.12.11.(Wed).
*/
function tmlTitle(data){
    window.addEventListener('load', function(){
        moreLessChanger(data);
    });
}

function moreLessChanger(data) {
    let parent = document.querySelectorAll(`[data-ke-type='moreLess']`);

    function close(btn, title) {
        btn.innerText = title;
    }

    function open(btn, title){
        btn.innerText = title;
    }

    for (let i = 0; i < parent.length; ++i) {
        let visBtn = parent[i].querySelector('a.btn-toggle-moreless');
        let content = parent[i].querySelectorAll('div.moreless-content *');
        let openTitleRaw = content[0].tagName == 'P' && content[0];
        let closeTitleRaw = content[content.length-1].tagName == 'P' && content[content.length-1];
        data.prevWord = data.prevWord || "# ";
        let openTitle = null;
        if(openTitleRaw.innerText.substr(0, data.prevWord.length) === data.prevWord){
            openTitle = openTitleRaw.innerText.substr(data.prevWord.length);
            parent[i].setAttribute('data-text-more', openTitle);
            if(data.delTitleContent === true){
                openTitleRaw.remove();
            }
        }
        let closeTitle = null;
        if(closeTitleRaw.innerText.substr(0, data.prevWord.length) === data.prevWord){
            closeTitle = closeTitleRaw.innerText.substr(data.prevWord.length);
            parent[i].setAttribute('data-text-less', closeTitle);
            if(data.delTitleContent === true){
                closeTitleRaw.remove();
            }
        }

        if(openTitle || closetitle){
            visBtn.innerText = openTitle;

            visBtn.addEventListener('click', function(e){
                e.preventDefault();
                if(!parent[i].classList.contains('open')){
                    if(openTitle){
                        close(visBtn, openTitle);
                    }
                }else{
                    if(closeTitle){
                        open(visBtn, closeTitle);
                    }
                }
            });
            
        }

    }
}