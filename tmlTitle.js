function tmlTitle(data) {

    Array.prototype.top = function () {
        return this[this.length - 1];
    };

    let scriptInfo = {
        author: `Min`,
        blog: `https://pang2h.tistory.com`,
        git: `https://github.com/mijien0179/tmlTitle.js`,
        release: `v20.02.10.`,
        makerCode: function (isCode = true, loader = '') {
            let p = document.createElement('p');
            p.style.fontSize = `12px`;
            p.style.textAlign = `right`;
            p.innerHTML = `<a href="${scriptInfo.blog}?${loader}" target="_blank" style="text-decoration:none; color:#3495eb">Script from F.R.I.D.A.Y</a>`
            if (isCode) return p.outerHTML;
            else return p;
        }
    };

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
        },
        getNewElement: function (tag, propList) {
            let element = document.createElement(tag);
            for (let prop in propList) {
                element.setAttribute(prop, propList[prop]);
            }

            return element;
        },
        getPostUrl: function () {
            let reg = new RegExp(`(https?\:\/\/[^\/]*\/[^\?]*)`);
            let ret = reg.exec(document.location.href);
            if (ret) return ret[1];
            return null;
        }
    };

    console.log(`tmlTitle.js : 티스토리 블로그 커스텀 스크립트 (${scriptInfo.release})\n` +
        `개발자블로그 : ${scriptInfo.blog}\n` +
        `Git 주소: ${scriptInfo.git}\n\n` +
        `이용할 경우 이 로그를 포함한 이 로그에서 사용하는 정보를 변경하거나 삭제하는 행위를 제한합니다.\n` +
        `단, 코드 변경자에 한하여 기존 로그를 유지한 채 정보를 추가하는 것은 허용합니다.\n` +
        `Chrome 브라우저 기준으로 테스트를 진행합니다.\n\n` +
        `다음 브라우저에 대해 pre-test가 완료되었습니다.\n` +
        `Firefox, Naver Whale`);

    if (document.body.id != 'tt-body-page') return; // function stop, if this page is not Post page.

    function moreLessChanger(data) {
        let parent = document.querySelectorAll(`[data-ke-type='moreLess']`);
        let base = {
            default: { // script default setting values
                delTitleContent: data.delTitleContent === true,
                prevWord: data.prevWord || '# ',
                addButton: data.addButton === true,
                defaultOpenTitle: data.defaultOpenTitle || '더보기',
                defaultCloseTitle: data.defaultCloseTitle || '닫기'
            },
            doc: { // moreLess doc info
                tag: 'div',
                class: function (selector = true) {
                    let ret = 'moreless-content';
                    if (selector === true) ret = `.${ret}`;
                    return ret;
                },
                prop: { // moreLess doc property
                    more: 'data-text-more',
                    less: 'data-text-less'
                },
                defButton: { // 'moreLess' open/close button info that made by default script
                    tag: 'a',
                    class: function (selector = true) {
                        let ret = 'btn-toggle-moreless';
                        if (selector === true) ret = `.${ret}`;
                        return ret;
                    }
                },
                extraButton: {
                    tag:'p',
                    show: data.addButton === true,
                    class: function (selector = true) {
                        let ret = null;
                        if(data.buttonClass && data.buttonClass.trim() != '') ret = data.buttonClass.trim();
                        else ret = 'tmlTitle-ml-btn-class'; // default class value of button that made of script

                        if (selector === true) ret = `.${ret}`;
                        return ret;
                    }
                }
            }
        };

        function close(target) {
            let prevHeight = target.parentElement.clientSize;
            target.classList.remove('open');
            let nowHeight = target.parentElement.clientSize - prevHeight;
            let btn = target.querySelectorAll(base.doc.extraButton.class());
            btn.forEach(element => {
                element.innerText = target.getAttribute(base.doc.prop.more);
            });
            scrollBy({
                top:nowHeight
            });
            if (btn[1]) btn[1].style.display = 'none';
        }
        
        function open(target) {
            target.classList.add('open');
            let btn = target.querySelectorAll(base.doc.extraButton.class());
            btn.forEach(element => {
                element.innerText = target.getAttribute(base.doc.prop.less);
            });
            if (btn[1]) btn[1].style.display = null;
        }

        parent.forEach(element => {
            element.querySelector(base.doc.defButton.class()).remove();
            let exBtn = tools.getNewElement(base.doc.extraButton.tag, {
                class:base.doc.extraButton.class(false)
            });
            element.insertBefore(exBtn, element.childNodes[0])
            if (base.default.addButton === true) {
                element.appendChild(exBtn.cloneNode(true));
                element.lastChild.style.display = `none`;
            }
            let visBtn = element.querySelectorAll(base.doc.extraButton.class());
            let c = element.querySelectorAll(`${base.doc.class()} > *`);

            let openTitleItem = c[0].tagName == 'P' ? c[0] : null;
            let closeTitleItem = c[c.length - 1].tagName == 'P' ? c[c.length - 1] : null;

            let trigFindRegexp = new RegExp(`${tools.escapeRegExp(base.default.prevWord)}(.*)`);

            if (openTitleItem) {
                let ret = trigFindRegexp.exec(openTitleItem.innerText);

                if(ret){
                    element.setAttribute(base.doc.prop.more, ret[1]);
                    if(base.default.delTitleContent === true) openTitleItem.remove();
                }else{
                    openTitleItem = null;
                    element.setAttribute(base.doc.prop.more, base.default.defaultOpenTitle);
                }
            }

            if (closeTitleItem) {
                let ret = trigFindRegexp.exec(closeTitleItem.innerText);
                if(ret){
                    element.setAttribute(base.doc.prop.less,ret[1]);
                    if(base.default.delTitleContent === true) closeTitleItem.remove();
                }else{
                    closeTitleItem = null;
                    element.setAttribute(base.doc.prop.less,base.default.defaultCloseTitle);
                }
            }

            visBtn.forEach(visElement => {
                visElement.innerText = element.getAttribute(base.doc.prop.more);

                visElement.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (element.classList.contains('open')) {
                        close(element);
                    } else {
                        open(element);
                    }
                });
            });

        });

    }

    function tagIndexor(data) {
        let base = {
            default: {
                trigger: (data.trigger || '# index').trim(),
                orderTag: data.orderIndex && 'ol' || 'ul',
                showReverseBtn: data.showReverseBtn || false,
                showCopyBtn: data.showCopyBtn || false,
                scrollType: data.scrollType || null,
            },
            headerField: {
                id: 'tmlTitle-tagIndexor',
                header: {
                    text: data.indexorTitle || 'Index',
                    tag: data.indexorTitleTag || 'h3'
                },
                list: {
                    id: 'tmlTitle-idx-list'
                },
                idxList: {
                    tag: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], // Item order is priority
                    id: function (i) {
                        return `tmlTitle-tagIndexor-${i}`;
                    },
                    class: function (selector = true) {
                        let ret = 'tmlTitle-indexor-item';
                        if (selector == true) ret = `.${ret}`;
                        return ret;
                    },
                    inner: {
                        tag: 'span',
                        class: `tmlTitle-indexor-item-inner`
                    }
                }
            },
            copyBtn: {
                class: function (selector = true) {
                    let ret = 'tmlTitle-idx-copylink';
                    if (selector === true) ret = `.${ret}`;
                    return ret;
                }
            },
            revBtn: {
                class: function (selector = true) {
                    let ret = 'tmlTitle-idx-go-mainframe';
                    if (selector === true) ret = `.${ret}`;
                    return ret;
                }
            },
            prop: {
                target: `tmlTitle-idx-target`
            }
        };

        {   // indexor creatable
            data.contentQuery = tools.findArticleArea(data.contentQuery); // find article area

            pDoc = document.querySelectorAll(`${data.contentQuery} > p`); // select article area element

            let reg = new RegExp(`^${tools.escapeRegExp(base.default.trigger)}$`); // trigger parsing regexp
            if (!reg.exec(pDoc[pDoc.length - 1].innerText)) return; // escape this function, if trigger is not exists
            else pDoc[pDoc.length - 1].remove(); // delete trigger tag, if this docum has trigger
        }

        function scrollMove(target, movetype) {
            let c = document.querySelector(target);
            if (c != null) c.scrollIntoView({ behavior: movetype });
        }

        let hrList = document.querySelectorAll(`${data.contentQuery} > hr`);
        let nod = [];

        function FindObjInParagraph(v, index) {
            let ret = [];
            do {
                let tagIndex;
                if ((tagIndex = base.headerField.idxList.tag.indexOf(v.tagName.toLowerCase())) != -1) {
                    v.classList.add(base.headerField.idxList.class(false)); // for finding target after this working
                    let idValue = base.headerField.idxList.id(index++);

                    if (v.id == '') v.id = idValue; // id-value normalization, without tag that already has id value
                    else idValue = v.id;

                    ret.push({
                        order: tagIndex,
                        id: idValue,
                        text: v.innerText.trim()
                    });
                    if (base.default.showCopyBtn === true) { // create button that copying url of this paragraph
                        let copy = tools.getNewElement('span', {
                            class: base.copyBtn.class(false),
                            target: `${tools.getPostUrl()}#${v.id}`
                        });
                        copy.append('copy');
                        v.appendChild(copy);
                    }
                    if (base.default.showReverseBtn === true) { // create button that going to index area
                        let revBtn = tools.getNewElement('span', {
                            class: base.revBtn.class(false),
                            [base.prop.target]: `#${base.headerField.id}`,
                            title: `${base.headerField.title}로 이동`
                        });
                        revBtn.append('^');
                        v.appendChild(revBtn);
                    }
                }

                v = v.nextElementSibling;

            } while (v && v.tagName.toLowerCase() != 'hr');
            return ret;
        }

        let idIndex = 0;
        hrList.forEach(element => {
            nod.push(FindObjInParagraph(element, idIndex));
            idIndex += nod[nod.length - 1].length;
        });
        let idxGroup = {
            baseTag: tools.getNewElement('div', {
                id: base.headerField.id
            })
        };

        idxGroup.baseTag.appendChild(idxGroup.headerTag = tools.getNewElement(base.headerField.header.tag, null));
        idxGroup.headerTag.innerText = base.headerField.header.text;

        idxGroup.listTag = tools.getNewElement(base.default.orderTag/*ol, ul*/, {
            id: base.headerField.list.id
        });

        // ordering

        let stack = [];
        let curParent = idxGroup.listTag;
        for (let i = 0; i < nod.length; ++i) { // index tag creator
            let value = nod[i][0].order;
            nod[i].forEach(element => { // order count minimize
                if (element.order < value) element.order = 0;
                else element.order -= value;
            });

            curParent = idxGroup.listTag;
            for (let k = 0; k < nod[i].length; ++k) {
                while (stack.top() && stack.top().order >= nod[i][k].order) { // small is strong
                    stack.pop();
                    if (curParent !== idxGroup.listTag) curParent = curParent.parentElement.parentElement;
                }
                if (curParent === null) curParent = idxGroup.baseTag;
                if (stack.top()) { // it has
                    let temp = curParent.querySelector(base.default.orderTag);
                    if (temp) {
                        curParent = temp;
                    } else {
                        let ol = tools.getNewElement(base.default.orderTag);
                        curParent.lastElementChild.appendChild(ol);
                        curParent = ol;
                    }
                }
                let li = tools.getNewElement('li', {
                    [base.prop.target]: `#${nod[i][k].id}`,
                    style: `font-size:${1.0 - .05 * stack.length}rem`
                });
                li.append(nod[i][k].text);
                stack.push(nod[i][k]);

                curParent.appendChild(li);
            }
        }

        // end ordering

        if (!nod) return;
        idxGroup.baseTag.appendChild(idxGroup.listTag);
        let appendList = [hrList[0].cloneNode(true), scriptInfo.makerCode(false, 'tagIndexor'), idxGroup.baseTag];

        appendList.forEach(element => {
            hrList[0].parentElement.insertBefore(element, hrList[0].nextElementSibling);
        });

        document.querySelectorAll(`[${base.prop.target}]`).forEach(element => {
            element.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                scrollMove(element.getAttribute(`${base.prop.target}`), data.scrollType);
            });
        });
        document.querySelectorAll(`span.${base.copyBtn.class(false)}`).forEach(element => {
            element.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                let ta = document.createElement('textarea');
                ta.value = element.getAttribute('target');
                ta.style.display = 'null';
                document.body.appendChild(ta);
                ta.select();
                ta.setSelectionRange(0, ta.value.length);
                document.execCommand('copy');
                document.body.removeChild(ta);
                tools.alert("링크 복사 완료", `링크가 클립보드에 복사되었습니다.` + '\n\n'
                    + `참고: 일부 브라우저에서는 자동 복사가 제한될 수 있습니다.` + '\n'
                    + `필요시 아래 링크를 이용하세요.\n${element.getAttribute('target')}`, 'indexor-linkCopy')
            });
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
            let btmFT = `<div class="tmlTitle-footNote-btmArea"><${data.titleTag}>각주</${data.titleTag}>`;
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