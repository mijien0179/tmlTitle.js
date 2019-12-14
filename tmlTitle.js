
/*
// https://pang2h.tistory.com/
// https://github.com/mijien0179/tmlTitle.js
//
// 2019.12.14.(Sat).
*/
function tmlTitle(data) {
    function moreLessChanger(data) {
        let parent = document.querySelectorAll(`[data-ke-type='moreLess']`);

        function close(parent, title) {
            parent.classList.remove('open');
            let btn = parent.querySelectorAll(`a.btn-toggle-moreless`);
            for(let i = 0; i < btn.length;++i){
                btn[i].innerText = title;
            }
            if(btn[1]) btn[1].style.display='none';
        }
        
        function open(parent, title) {
            parent.classList.add('open');
            let btn = parent.querySelectorAll(`a.btn-toggle-moreless`);
            for(let i = 0; i < btn.length;++i){
                btn[i].innerText = title;
            }
            if(btn[1]) btn[1].style.display=null;
        }

        for (let i = 0; i < parent.length; ++i) {
            if (data.addButton === true) {
                parent[i].innerHTML += parent[i].querySelector('a.btn-toggle-moreless').outerHTML;
                parent[i].lastChild.classList.add('tmlTitle-extrabtn');
                parent[i].lastChild.style.display=`none`;                
            }
            let visBtn = parent[i].querySelectorAll('a.btn-toggle-moreless');
            let content = parent[i].querySelectorAll('div.moreless-content *');
            let openTitleRaw = content[0].tagName == 'P' && content[0];
            let closeTitleRaw = content[content.length - 1].tagName == 'P' && content[content.length - 1];
            data.prevWord = data.prevWord || "# ";
            let openTitle = data.defaultOpenTitle || `더보기`;
            if (openTitleRaw && openTitleRaw.innerText.substr(0, data.prevWord.length) === data.prevWord) {
                openTitle = openTitleRaw.innerText.substr(data.prevWord.length);
                parent[i].setAttribute('data-text-more', openTitle);
                if (data.delTitleContent === true) {
                    openTitleRaw.remove();
                }
            }
            let closeTitle = data.defaultCloseTitle || `닫기`;
            if (closeTitleRaw && closeTitleRaw.innerText.substr(0, data.prevWord.length) === data.prevWord) {
                closeTitle = closeTitleRaw.innerText.substr(data.prevWord.length);
                parent[i].setAttribute('data-text-less', closeTitle);
                if (data.delTitleContent === true) {
                    closeTitleRaw.remove();
                }
            }

            for (let c = 0; c < visBtn.length; ++c) {
                visBtn[c].innerText = openTitle;

                visBtn[c].addEventListener('click', function (e) {
                    e.preventDefault();
                    if (parent[i].classList.contains('open')) {
                        close(parent[i], openTitle);
                    } else {
                        open(parent[i], closeTitle);
                    }
                });

            }

        }
    }

    moreLessChanger(data);


}