
/*
// https://pang2h.tistory.com/
// https://github.com/mijien0179/tmlTitle.js
//
// 2019.12.28.(Sat).
*/
function tmlTitle(data) {

    let scriptInfo = {
        author:`Min`,
        blog:`https://pang2h.tistory.com?tmlTitle`,
        git:`https://github.com/mijien0179/tmlTitle.js`
    }

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

    function tagIndexor(data){
        let doc = document.querySelectorAll(`${data.contentQuery} > *`);
        let indexorTagList = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        data.indexorTitleTag = data.indexorTitleTag || 'h3';
        let orderIndexor = {
             open: data.orderIndexor && `<ol>`  || `<ul>`,
            close: data.orderIndexor && `</ol>` || `</ul>`
        };
        let index = 0;
        let node = [[]];
        for(let i = 0 ; i < doc.length;++i){
            let curTagName = doc[i].tagName.toLowerCase();
            if(curTagName === `hr`){
                if(node[node.length -1].length != 0){
                    node[node.length] = [];
                    index = 0;
                }
                continue;
            }
            if(indexorTagList.contains(curTagName)){
                if(doc[i].id == ''){
                    doc[i].id = `tmlTitle-tagIndexor-${i}`;
                }
                node[node.length - 1].push({
                    name:doc[i].tagName,
                    id:doc[i].id,
                    text:doc[i].innerText
                });
            }
        }

        let idxPanel = `<div id="tmlTitle-tagIndexor"><${data.indexorTitleTag}>Index</${data.indexorTitleTag}>`;
        
        for(let i = 0; i < node.length;++i){
            if(node[i] == null) continue;
            idxPanel += `${orderIndexor.open}<li><a href="#${node[i][0].id}">${node[i][0].text}</a>`;
            if(1 < node[i].length){
                idxPanel += `${orderIndexor.open}`
                for(let k = 1; k < node[i].length;++i){
                    idxPanel += `<li><a href="#${node[i][k].id}">${node[i][k].text}</a></li>`
                }
                idxPanel += `${orderIndexor.close}`;
            }
            idxPanel += `${orderIndexor.close}`;
        }

        idxPanel += `</div>`;

        let fhl = document.querySelector(`${data.contentQuery} > hr`);
        fhl.outerHTML += idxPanel + fhl.outerHTML;
        console.log(idxPanel);
    }

    if(data.moreLessChanger){
        moreLessChanger(data.moreLessChanger);
    }

    if(data.tagIndexor){
        tagIndexor(data.tagIndexor);
    }

    console.log(`tmlTitle.js : 티스토리 블로그 커스텀 스크립트\n` +
                `개발자블로그 : ${scriptInfo.blog}\n` +
                `Git 주소: ${scriptInfo.git}`);

}