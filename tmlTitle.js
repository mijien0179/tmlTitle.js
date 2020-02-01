
/*
// https://pang2h.tistory.com/
// https://github.com/mijien0179/tmlTitle.js
//
*/
function tmlTitle(data) {

    let scriptInfo = {
        author: `Min`,
        blog: `https://pang2h.tistory.com`,
        git: `https://github.com/mijien0179/tmlTitle.js`,
        release: `v20.01.31.`,
        makerCode: function (isCode = true, loader = '') {
            let p = document.createElement('p');
            p.style.fontSize = `12px`;
            p.style.textAlign = `right`;
            p.innerHTML = `<a href="${scriptInfo.blog}?${loader}" target="_blank" style="text-decoration:none; color:#3495eb">Script from F.R.I.D.A.Y</a>`
            if (isCode) return p.outerHTML;
            else return p;
        }
    }

    data.selfDesign = data.selfDesign || null;

    var tools = {
        escapeRegExp: function (string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        },
        encodeHTML: function (string) {
            return encodeURI(string);
        },
        decodeHTML: function (string) {
            return decodeURI(string);
        },
        alert: function (title, text, loader = 'null', parent = document.body) {
            let outside = document.createElement(`div`);
            let inside = document.createElement(`div`);
            let eTitle = document.createElement(`p`);
            let eText = document.createElement(`p`);

            if (data.selfDesign && data.selfDesign.alert) {
                outside.style = data.selfDesign.alert.background;
                inside.style = data.selfDesign.alert.foreground;
                eTitle.style = data.selfDesign.alert.title;
                eText.style = data.selfDesign.alert.content;
            } else {
                outside.style = `width:100%;height:100%; background:rgba(0,0,0,0.2); position:fixed; top:0; left:0; z-index:999; overflow-y:auto; padding:15px`;
                inside.style = `width:50%; max-width:620px; scroll:vertical; background:#FFFFFF; box-shadow:0 0 10px rgba(0,0,0,0.1); border-radius:2px; padding:15px; margin:0 auto; transform:translate(-50%, -50%); left:50%; top:20%; position:absolute;`;
                eTitle.style = `font-size:1.25em; width:100%`;
                eText.style = `width:100%;word-break:break-all;`;
            }
            eTitle.innerText = title;

            eText.innerHTML = text.split('\n').join('<br>');
            eText.querySelectorAll(`a`).forEach(element => {
                element.setAttribute(`target`, `_blank`);
            });

            inside.appendChild(eTitle);
            inside.appendChild(eText);
            inside.appendChild(scriptInfo.makerCode(false, loader));
            outside.appendChild(inside);
            parent.appendChild(outside);
            inside.addEventListener('mousedown', function (e) {
                e.stopPropagation();
            });
            outside.addEventListener('mousedown', function (e) {
                outside.remove();
            });
        },
        findArticleArea: function (target) {
            let ret;
            let tpDoc = {
                query: target[0],
                size: document.querySelectorAll(`${target[0]} p, ${target[0]} li`).length
            };
            for (let i = 1; i < target.length; ++i) {
                ret = document.querySelectorAll(`${target[i]} p, ${target[i]} li`).length;
                if (tpDoc.size < ret.length) {
                    tpDoc.query = target[i];
                    tpDoc.size = ret.length;
                }
            }
            return tpDoc.query;
        }
    }

    console.log(`tmlTitle.js : 티스토리 블로그 커스텀 스크립트 (${scriptInfo.release})\n` +
        `개발자블로그 : ${scriptInfo.blog}\n` +
        `Git 주소: ${scriptInfo.git}\n\n` +
        `이용할 경우 이 로그를 포함한 이 로그에서 사용하는 정보를 변경하거나 삭제하는 행위를 제한합니다.\n` +
        `단, 코드 변경자에 한하여 기존 로그를 유지한 채 정보를 추가하는 것은 허용합니다.\n` +
        `Chrome 브라우저만 테스트를 진행했습니다.`);

    if (document.body.id != 'tt-body-page') return; // function stop, if this page is not Post page.

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
        let base = {
            mainFrame: {
                id: `tmlTitle-tagIndexor`,
                title: data.indexorTitle || 'Index',
                tag: data.indexorTitleTag || 'h3'
            },
            copyBtn:{
                class:'tmlTitle-idx-copylink',
            },
            revBtn:{
                class:'tmlTitle-idx-go-mainframe'
            },
            targetProp: `tmlTitle-idx-target`
        };

        {   // indexor creatable
            data.contentQuery = tools.findArticleArea(data.contentQuery);

            pDoc = document.querySelectorAll(`${data.contentQuery} > p`);
            data.trigger = (data.trigger || '# index').trim();
            if (pDoc[pDoc.length - 1].innerText.toLowerCase().trim() != data.trigger) return;
            else pDoc[pDoc.length - 1].remove();
        }

        function scrollMove(target, movetype) {
            let c = document.querySelector(target);
            if (c != null) c.scrollIntoView({ behavior: movetype });
        }

        let curTag = document.querySelector(`${data.contentQuery} > hr`);
        let indexorTagList = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        let orderIndexor = {
            open: data.orderIndex && `<ol>` || `<ul>`,
            close: data.orderIndex && `</ol>` || `</ul>`
        };
        let nod = [];
        while (curTag) {
            let curTagName = curTag.tagName.toLowerCase();
            if (indexorTagList.contains(curTagName)) {
                let idValue = `tmlTitle-tagIndexor-${nod.length}`;
                curTag.classList.add(`tmlTitle-indexor-item`);
                if (curTag.id == '') {
                    curTag.id = idValue;
                } else {
                    idValue = curTag.id;
                }
                nod.push({
                    id: idValue,
                    text: curTag.innerText.trim()
                });
                if (data.showCopyBtn) curTag.innerHTML += `<span class="${base.copyBtn.class}" target="${document.location.href}#${curTag.id}">copy</span>`
                if (data.showReverseBtn) curTag.innerHTML += `<span class="${base.revBtn.class}" ${base.targetProp}="#${base.mainFrame.id}" title="${base.mainFrame.title}로 이동">∧</span>`;
            }
            curTag = curTag.nextElementSibling;
        }
        if (nod == []) return;
        let ret = `<div id="${base.mainFrame.id}"><${base.mainFrame.tag}>${base.mainFrame.title}</${base.mainFrame.tag}>`;
        ret += `${orderIndexor.open}`
        nod.forEach(element =>{
            ret += `<li ${base.targetProp}="#${element.id}">${element.text}</li>`;
        })
        ret += `${orderIndexor.close}${scriptInfo.makerCode(true, `tagIndexor`)}</div>`;

        curTag = document.querySelector(`${data.contentQuery} > hr`);

        curTag.outerHTML += ret + curTag.outerHTML;
        document.querySelectorAll(`[${base.targetProp}]`).forEach(element => {
            element.addEventListener('click', function (e) {
                scrollMove(element.getAttribute(`${base.targetProp}`), data.scrollType);
            });
        });
        document.querySelectorAll(`span.${base.copyBtn.class}`).forEach(element => {
            element.addEventListener('click', function (e) {
                let ta = document.createElement('textarea');
                ta.value = element.getAttribute('target');
                ta.style.display = 'null';
                document.body.appendChild(ta);
                ta.select();
                ta.setSelectionRange(0, ta.value.length);
                document.execCommand('copy');
                document.body.removeChild(ta);
                e.preventDefault();
                e.stopPropagation();
                tools.alert("링크 복사 완료", `링크가 클립보드에 복사되었습니다.` + '\n\n'
                                            + `참고: 일부 브라우저에서는 자동 복사가 제한될 수 있습니다.` + '\n'
                                            + `필요시 아래 링크를 이용하세요.\n${element.getAttribute('target')}`, 'indexor-linkCopy')
            })
        });
        let curURL = location.href.toString();
        let curLoc = -1;
        if ((curLoc = curURL.indexOf('#')) != -1) {
            let c = document.querySelector(`${curURL.substr(curLoc)}`);
            if (c != null) c.scrollIntoView({ behavior: data.scrollType });
        }

    }

    function ogHrefer(data) {
        document.querySelectorAll(`a[data-source-url]`).forEach(v => {
            v.href = v.getAttribute(`data-source-url`);
        });
    }

    function footNote(data) {
        let pDoc;
        {   // footNote creatable
            let tpDoc = {
                query: data.contentQuery[0],
                size: document.querySelectorAll(`${data.contentQuery[0]} p, ${data.contentQuery[0]} li`).length
            };
            for (let i = 1; i < data.contentQuery.length; ++i) {
                pDoc = document.querySelectorAll(`${data.contentQuery[i]} p, ${data.contentQuery[i]} li`);
                if (tpDoc.size < pDoc.length) {
                    tpDoc.query = data.contentQuery[i];
                    tpDoc.size = pDoc.length;
                }
            }
            data.contentQuery = tpDoc.query;
        }
        data.cursor = data.cursor || `pointer`;
        data.color = data.color || `#209dd4`;
        data.titleTag = data.titleTag || `h3`;
        pDoc = '';
        ['p', 'li', 'h3'].forEach(element => {
            pDoc += `${data.contentQuery} ${element},`;
        });
        pDoc = pDoc.substring(0, pDoc.length - 1);
        pDoc = document.querySelectorAll(pDoc);
        data.trigger = data.trigger || '#';
        let reg = new RegExp(`\\[${tools.escapeRegExp(data.trigger)}([^\\ \\]]*) ([^\\]]*)\\]`);
        let nod = [];
        let count = 1;
        for (let i = 0; i < pDoc.length; ++i) {
            let regTemp;
            while (regTemp = reg.exec(pDoc[i].innerHTML)) {
                if (regTemp[1].trim() == '') {
                    regTemp[1] = count;
                }
                nod.push({
                    title: regTemp[1],
                    text: regTemp[2]
                });
                pDoc[i].innerHTML = pDoc[i].innerHTML.replace(reg, `<span class="tmlTitle-footNote" id="tmlTitle-footNoteOri-${count}"><sup style="cursor:${data.cursor}; color:${data.color}" value="${tools.encodeHTML(regTemp[2].replace('\\n', '<br>'))}">[${regTemp[1]}]</sup></span>`);
                count++;
            }
        }

        let ftItem = document.querySelectorAll(`${data.contentQuery} .tmlTitle-footNote > sup`);
        for (let i = 0; i < ftItem.length; ++i) {
            ftItem[i].addEventListener("click", function () {
                tools.alert(ftItem[i].innerText, tools.decodeHTML(ftItem[i].getAttribute(`value`)), `footnote`, document.querySelector(data.contentQuery));
            });
        }

        if (data.showIntoBottom) {
            let btmFT = `<div class="tmlTitle-footNote-btmArea"><${data.titleTag}>주석</${data.titleTag}>`;
            for (let i = 0; i < nod.length; ++i) {
                btmFT += `<p class="tmlTitle-footNote-btmArea-content"><a href="#tmlTitle-footNoteOri-${i}">${nod[i].title}</a> : ${nod[i].text}</p>`;
            }
            btmFT += `</div>`;
            pDoc[pDoc.length - 1].outerHTML += btmFT;

        }
    }

    function emojier(data) { //proto type
        data.contentQuery = tools.findArticleArea(data.contentQuery);
        data.contentTag = ['p', 'li'];
        let query = '';
        data.contentTag.forEach(tag => {
            query += `${data.contentQuery} ${tag},`;
        });

        query = query.substring(0, query.length - 1);

        document.querySelectorAll(query).forEach(element => {
            [
                { plain: [':)', ':]'], emo: '😊' },
                //{plain:[':p',':b'], emo:'\u{1fb1b}'},
                { plain: [':D'], emo: '😃' },
                { plain: [';)'], emo: '😉' },
                { plain: [';b', ';p'], emo: '😜' },
                { plain: [':|'], emo: '😐' },
                { plain: [':(', ':['], emo: '😩' },
                { plain: [':O', ':o'], emo: '😲' }
            ].forEach(item => {
                item.plain.forEach(value => {
                    element.innerHTML = element.innerHTML.split(value).join(item.emo);
                });
            });
        });

    }

    if (data.emojier) {
        console.log("tmlTitle emojier : proto type");
        emojier(data.emojier);
    }

    if (data.moreLessChanger) {
        moreLessChanger(data.moreLessChanger);
    }

    if (data.ogHrefer) {
        ogHrefer(data.ogHrefer);
    }


    if (data.footNote) {
        if (!(`contentQuery` in data.footNote)) {
            console.error(`tmlTitle.js : contentQuery is missing from footNote function.`);
            return;
        }
        footNote(data.footNote);
    }

    if (data.tagIndexor) {
        if (!("contentQuery" in data.tagIndexor)) {
            console.error(`tmlTitle.js : contentQuery is missing from tagIndexor function.`);
            return;
        }
        tagIndexor(data.tagIndexor);
    }
}