
/*
// https://pang2h.tistory.com/
// https://github.com/mijien0179/tmlTitle.js
//
*/
function tmlTitle(data) {

    let scriptInfo = {
        author: `Min`,
        blog: `https://pang2h.tistory.com?tmlTitle`,
        git: `https://github.com/mijien0179/tmlTitle.js`,
        release: `v19.12.30.`,
        makerCode: function(isCode = true){
            let p = document.createElement('p');
            p.style.fontSize = `12px`;
            p.style.textAlign = `right`;
            p.innerHTML = `<a href="${scriptInfo.blog}" target="_blank" style="text-decoration:none; color:#3495eb">Script from F.R.I.D.A.Y</a>`
            if(isCode) return p.outerHTML;
            else return p;
        }
    }

    console.log(`tmlTitle.js : 티스토리 블로그 커스텀 스크립트 (${scriptInfo.release})\n` +
        `개발자블로그 : ${scriptInfo.blog}\n` +
        `Git 주소: ${scriptInfo.git}\n\n` +
        `이용할 경우 이 로그를 포함한 이 로그에서 사용하는 정보를 변경하거나 삭제하는 행위를 제한합니다.\n` +
        `단, 코드 변경자에 한하여 기존 로그를 유지한 채 정보를 추가하는 것은 허용합니다.`);

    function moreLessChanger(data) {
        let parent = document.querySelectorAll(`[data-ke-type='moreLess']`);

        function close(parent, title) {
            parent.classList.remove('open');
            let btn = parent.querySelectorAll(`a.btn-toggle-moreless`);
            for (let i = 0; i < btn.length; ++i) {
                btn[i].innerText = title;
            }
            if (btn[1]) btn[1].style.display = 'none';
        }

        function open(parent, title) {
            parent.classList.add('open');
            let btn = parent.querySelectorAll(`a.btn-toggle-moreless`);
            for (let i = 0; i < btn.length; ++i) {
                btn[i].innerText = title;
            }
            if (btn[1]) btn[1].style.display = null;
        }

        for (let i = 0; i < parent.length; ++i) {
            if (data.addButton === true) {
                parent[i].innerHTML += parent[i].querySelector('a.btn-toggle-moreless').outerHTML;
                parent[i].lastChild.classList.add('tmlTitle-extrabtn');
                parent[i].lastChild.style.display = `none`;
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

    function tagIndexor(data) {
        {   // indexor creatable
            if (document.body.id != 'tt-body-page') return;
            let pDoc;
            let tpDoc = {
                query: data.contentQuery[0],
                size: document.querySelectorAll(`${data.contentQuery[0]} > p`).length
            };
            for (let i = 1; i < data.contentQuery.length; ++i) {
                pDoc = document.querySelectorAll(`${data.contentQuery[i]} > p`);
                if (tpDoc.size < pDoc.length) {
                    tpDoc.query = data.contentQuery[i];
                    tpDoc.size = pDoc.length;
                }
            }
            data.contentQuery = tpDoc.query;
            pDoc = document.querySelectorAll(`${data.contentQuery} > p`);
            data.trigger = (data.trigger || '# index').trim();
            if (pDoc[pDoc.length - 1].innerText.toLowerCase().trim() != data.trigger) return;
            else pDoc[pDoc.length - 1].remove();
        }

        let curTag = document.querySelector(`${data.contentQuery} > hr`);
        let indexorTagList = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        data.indexorTitleTag = data.indexorTitleTag || 'h3';
        data.indexorTitle = data.indexorTitle || 'Index';
        let orderIndexor = {
            open: data.orderIndex && `<ol>` || `<ul>`,
            close: data.orderIndex && `</ol>` || `</ul>`
        };
        let nod = [];
        while (curTag) {
            let curTagName = curTag.tagName.toLowerCase();
            if (indexorTagList.contains(curTagName)) {
                let idValue = `tmlTitle-tagIndexor-${nod.length}`;
                if (curTag.id == '') {
                    curTag.id = idValue;
                } else {
                    idValue = curTag.id;
                }
                nod.push({
                    id: idValue,
                    text: curTag.innerText.trim()
                });
            }
            curTag = curTag.nextElementSibling;
        }
        if (nod == []) return;
        let ret = `<div id="tmlTitle-tagIndexor"><${data.indexorTitleTag}>${data.indexorTitle}</${data.indexorTitleTag}>`;
        ret += `${orderIndexor.open}`
        for (let i = 0; i < nod.length; ++i) {
            ret += `<li><a href="#${nod[i].id}">${nod[i].text}</a></li>`;
        }
        ret += `${orderIndexor.close}${scriptInfo.makerCode()}</div>`;
        curTag = document.querySelector(`${data.contentQuery} > hr`);

        curTag.outerHTML += ret + curTag.outerHTML;
        let curURL = location.href.toString();
        if((curURL = curURL.indexOf('#')) != -1){
            location.href = location.href;
        }
    }

    if (data.moreLessChanger) {
        moreLessChanger(data.moreLessChanger);
    }

    if (data.tagIndexor) {
        if (!("contentQuery" in data.tagIndexor)) {
            console.error(`tmlTitle.js : contentQuery is missing from tagIndexor function.`);
            return;
        }
        tagIndexor(data.tagIndexor);
    }



}