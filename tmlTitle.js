function tmlTitle(data) {

    data.selfDesign = data.selfDesign || null;

    Array.prototype.top = function () {
        return this[this.length - 1];
    };

    Array.prototype.empty = function () {
        return this.length === 0;
    }

    let scriptInfo = {
        author: `Min`,
        blog: `https://pang2h.tistory.com`,
        git: `https://github.com/mijien0179/tmlTitle.js`,
        release: `v21.04.21.`,
        makerCode: function (isCode = true, loader = '') {
            let p = document.createElement('p');
            p.style.fontSize = `12px`;
            p.style.textAlign = `right`;
            p.innerHTML = `<a href="${scriptInfo.blog}?${loader}" target="_blank" style="text-decoration:none; color:#3495eb">Script from F.R.I.D.A.Y</a>`
            if (isCode) return p.outerHTML;
            else return p;
        }
    };

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
            let outside = tools.getNewElement('div', {
                id: 'tmlTitle-alert-background'
            });
            let inside = tools.getNewElement('div', {
                id: 'tmlTitle-alert-foreground'
            });
            let eTitle = tools.getNewElement('p', {
                id: 'tmlTitle-alert-header'
            });
            let eText = tools.getNewElement('p', {
                id: 'tmlTitle-alert-content'
            });

            if (data.selfDesign && data.selfDesign.alert) {
                outside.style = data.selfDesign.alert.background;
                inside.style = data.selfDesign.alert.foreground;
                eTitle.style = data.selfDesign.alert.title;
                eText.style = data.selfDesign.alert.content;
            } else {
                let isCssFile = false;
                let linkList = document.head.querySelectorAll('link');
                for (let i = 0; i < linkList.length; ++i) {
                    if (linkList[i].href.includes('tmlTitle.css')) {
                        isCssFile = true;
                        break;
                    }

                }
                if (!isCssFile) {
                    outside.style = `width:100%;height:100%; background:rgba(0,0,0,0.2); position:fixed; top:0; left:0; z-index:999; overflow-y:auto; padding:15px`;
                    inside.style = `width:50%; max-width:620px; scroll:vertical; background:#FFFFFF; box-shadow:0 0 10px rgba(0,0,0,0.1); border-radius:2px; padding:15px; margin:0 auto; transform:translate(-50%, -50%); left:50%; top:20%; position:absolute;`;
                    eTitle.style = `font-size:1.25em; width:100%; margin:0; padding:0;`;
                    eText.style = `width:100%;word-break:break-all; margin:0; padding:0;`;
                }
            }
            eTitle.append(title);
            let repList = [['\n', '<br>']];
            repList.forEach(element => { text = text.split(element[0]).join(element[1]); });

            eText.innerHTML = text;
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
        findArticleArea: function (target, minimum = -1) {
            let ret;
            const base = {
                targetList: ['p', 'li']
            };
            let tpDoc = {
                query: target[0],
                size: document.querySelectorAll(tools.createQueryString(`${target[0]} > `, base.targetList)).length
            };
            for (let i = 0; i < target.length; ++i) {
                ret = document.querySelectorAll(tools.createQueryString(`${target[i]} > `, base.targetList)).length;
                if (tpDoc.size < ret) {
                    tpDoc.query = target[i];
                    tpDoc.size = ret;
                }
            }
            if(0 > minimum) return tpDoc.query;

            return tpDoc.size > minimum && tpDoc.query || null; // if selection target size is lower then minimum size, then return null. otherwise return value is query string.
        },
        getNewElement: function (tag, propList) {
            let element = document.createElement(tag);
            for (let prop in propList) {
                element.setAttribute(prop, propList[prop]);
            }

            return element;
        },
        getPostUrl: function () {
            let reg = new RegExp(`(https?\:\/\/[^\/]*\/[^\?]*)?[#]`);
            let ret = reg.exec(document.location.href);
            if (ret) return ret[1];
            return document.location.href;
        },
        createQueryString: function (baseQuery, list) {
            let v = '';
            list.forEach(query => {
                v += `${baseQuery} ${query},`;
            });
            return v.substring(0, v.length - 2);
        }
    };

    console.log(`tmlTitle.js : 글쓰기를 더욱 다채롭게 (${scriptInfo.release})\n` +
        `개발자블로그 : ${scriptInfo.blog}\n` +
        `Git 주소: ${scriptInfo.git}\n\n` +
        `이용할 경우 이 로그를 포함한 이 로그에서 사용하는 정보를 변경하거나 삭제하는 행위를 제한합니다.\n` +
        `단, 코드 변경자에 한하여 기존 로그를 유지한 채 정보를 추가하는 것은 허용합니다.\n`);

    let isActive = false;
    let activateList = data.activeList || ['tt-body-page'];

    activateList.forEach(value => {
        if (document.body.id === value) isActive = true;
    });
    
    if (isActive === false) return; // function stop, if this page is not authorized to activate script.

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
                    tag: 'p',
                    show: data.addButton === true,
                    class: function (selector = true) {
                        let ret = null;
                        if (data.buttonClass && data.buttonClass.trim() != '') ret = data.buttonClass.trim();
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
                top: nowHeight
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
                class: base.doc.extraButton.class(false)
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

            let trigFindRegexp = new RegExp(`^${tools.escapeRegExp(base.default.prevWord)}(.*)`);

            if (openTitleItem) {
                let ret = trigFindRegexp.exec(openTitleItem.innerText);

                if (ret) {
                    element.setAttribute(base.doc.prop.more, ret[1]);
                    if (base.default.delTitleContent === true) openTitleItem.remove();
                } else {
                    openTitleItem = null;
                    element.setAttribute(base.doc.prop.more, base.default.defaultOpenTitle);
                }
            }

            if (closeTitleItem) {
                let ret = trigFindRegexp.exec(closeTitleItem.innerText);
                if (ret) {
                    element.setAttribute(base.doc.prop.less, ret[1]);
                    if (base.default.delTitleContent === true) closeTitleItem.remove();
                } else {
                    closeTitleItem = null;
                    element.setAttribute(base.doc.prop.less, base.default.defaultCloseTitle);
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
                trigger: (data.trigger || '# index').trim(),            // STR
                orderTag: data.orderIndex === true && 'OL' || 'UL',     // BOOL, tag name must maintain uppercase.
                showReverseBtn: data.showReverseBtn === true,           // BOOL
                showCopyBtn: data.showCopyBtn === true,                 // BOOL
                scrollType: data.scrollType || null,                    // STR
                uSetTarget: data.uSetTarget === true                    // BOOL, user can set target-id if the value is true.
            },
            headerField: {
                id: 'tmlTitle-tagIndexor',
                header: {
                    text: data.indexorTitle || 'Index', // STR
                    tag: data.indexorTitleTag || 'H3'   // STR
                },
                list: {
                    id: 'tmlTitle-idx-list'
                },
                idxList: {
                    tag: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'], // ARR OF STR, Item order is priority
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
                target: `tmlTitle-idx-target`,
                connectList: ['P', 'LI', 'BLOCKQUOTE', 'TD']
            },
            selfLinking:{
                class:`tmlTitle-id-selfLinking`
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
        function FindObjInParagraph(elt, index) {
            let ret = [];
            do {
                let tagIndex;
                if ((tagIndex = base.headerField.idxList.tag.indexOf(elt.tagName)) != -1) {
                    elt.classList.add(base.headerField.idxList.class(false)); // for finding target after this working
                    let idValue = base.headerField.idxList.id(index++);

                    let usrTarget = null;   // user defined value
                    let reg = new RegExp('(.*)\/\/ ?(.*)');
                    let result = reg.exec(elt.innerHTML);
                    if (base.default.uSetTarget && result) {
                        elt.innerHTML = result[1].trim();
                        usrTarget = result[2].trim();
                        elt.id = `${elt.id + (elt.id !== '' ? '-' : '')}tmlidx-${usrTarget}`;
                        index--; // uncounting value, if already has id that user defined.
                    }


                    if (elt.id == '') elt.id = `${usrTarget || idValue}`; // id-value normalization, without tag that already has id value
                    else idValue = elt.id;

                    let item = {
                        order: tagIndex,
                        id: idValue,
                        text: elt.innerText.trim()
                    };

                    ret.push(item);
                    if (base.default.showCopyBtn === true) { // create button that copying url of this paragraph
                        let copy = tools.getNewElement('span', {
                            class: base.copyBtn.class(false),
                            target: `${tools.getPostUrl()}#${elt.id}`
                        });
                        copy.append('copy');
                        elt.appendChild(copy);
                    }
                    if (base.default.showReverseBtn === true) { // create button that going to index area
                        let revBtn = tools.getNewElement('span', {
                            class: base.revBtn.class(false),
                            [base.prop.target]: `#${base.headerField.id}`,
                            title: `${base.headerField.title}로 이동`
                        });
                        revBtn.append('^');
                        elt.appendChild(revBtn);
                    }
                }

                elt = elt.nextElementSibling;

            } while (elt && elt.tagName != 'HR');
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

        for (let i = 0; i < nod.length; ++i) { // index tag creator
            if (!nod[i].length) continue;
            let stack = [];
            let curParent = idxGroup.listTag;

            let value = nod[i][0].order;
            nod[i].forEach(element => { // order count minimize
                if (element.order < value) element.order = 0;
                else element.order -= value;
            });

            for (let k = 0; k < nod[i].length; ++k) {
                while (!stack.empty() && stack.top().order >= nod[i][k].order) {
                    stack.pop();
                    curParent = ((curParent.parentElement || curParent).parentElement) || curParent;
                }
                if (!stack.empty()) {
                    let tmpChild = curParent.lastElementChild.childNodes || [];
                    let s;
                    for (s = tmpChild.length - 1; s >= 0; --s) {
                        if (tmpChild[s].tagName === base.default.orderTag) {
                            break;
                        }
                    }
                    if (s < 0) { // not exists
                        let tempLP = tools.getNewElement(base.default.orderTag);
                        curParent.lastElementChild.appendChild(tempLP);
                        curParent = tempLP;
                    } else {
                        curParent = tmpChild[s];
                    }
                }

                let li = tools.getNewElement('li');

                let p = tools.getNewElement('span', {
                    [base.prop.target]: `#${nod[i][k].id}`,
                    style: `font-size:${1.0 - .05 * stack.length}rem`
                });
                p.append(nod[i][k].text);

                li.appendChild(p);
                curParent.appendChild(li);

                stack.push(nod[i][k]);
            }
        }
        // end ordering
        if (!nod) return;
        idxGroup.baseTag.appendChild(idxGroup.listTag);
        let appendList = [hrList[0].cloneNode(true), scriptInfo.makerCode(false, 'tagIndexor'), idxGroup.baseTag];

        appendList.forEach(element => { // append indexor Node
            hrList[0].parentElement.insertBefore(element, hrList[0].nextElementSibling);
        });
        { // Linking some part of self document.
            let pList = document.querySelectorAll(tools.createQueryString(`${data.contentQuery} > `, base.prop.connectList));
            nod.forEach(item => {
                item.forEach(v => {
                    pList.forEach(elt => {
                        let aItem = tools.getNewElement(`span`, {
                            [base.prop.target]: `#${v.id}`,
                            class: base.selfLinking.class
                        });
                        aItem.innerText =  `<${v.text}>`;
                        elt.innerHTML = elt.innerHTML.split(`&lt;${v.text}&gt;`).join(aItem.outerHTML);
                    });
                });
            });
        }
        document.querySelectorAll(`[${base.prop.target}]`).forEach(element => { // binding Move Action
            element.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                scrollMove(element.getAttribute(base.prop.target), data.scrollType);
            });
        });
        document.querySelectorAll(`.${base.selfLinking.class}`).forEach(element =>{
            element.addEventListener('click', function (e){
                e.preventDefault();
                e.stopPropagation();
                scrollMove(element.getAttribute(base.prop.target), data.scrollType);
            });
        });
        document.querySelectorAll(`span.${base.copyBtn.class(false)}`).forEach(element => { // binding alert Message for copy to clipboard
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
                tools.alert("링크 복사 완료", `링크가 클립보드에 복사되었습니다.\n`, 'indexor-linkCopy')
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
        data.contentQuery = tools.findArticleArea(data.contentQuery);
        data.cursor = data.cursor || `pointer`;
        data.color = data.color || `#209dd4`;
        data.titleTag = data.titleTag || `h3`;
        let pDoc = '';

        pDoc = tools.createQueryString(data.contentQuery, ['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'td']);

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
                pDoc[i].innerHTML = pDoc[i].innerHTML.replace(reg, `<span class="tmlTitle-footNote" id="tmlTitle-footNoteOri-${count}"><sup style="cursor:${data.cursor}; color:${data.color}" value="${tools.encodeHTML(regTemp[2].split('\\n').join('<br>'))}">[${regTemp[1]}]</sup></span>`);
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
    
    function codeTabManager(){
        let codeList = document.querySelectorAll('code');
        {
            codeList.forEach(elt =>{
                let v = elt.innerHTML.split(`\n`);
                let regex = new RegExp(`^([\t ]*)(.*)`);
                let count = Number.MAX_VALUE;
                let result = ``;
                for(let i = 0; i < v.length; ++i){
                    if(v[i] != ``){
                        let temp = regex.exec(v[i]);
                        temp[1] = temp[1].split(`\t`).join('    ');
                        if(count > temp[1].length) count = temp[1].length;
                        v[i] = `${temp[1]}${temp[2]}`;
                    }
                }
                for(let i = 0 ; i < v.length; ++i){
                    if(regex.exec(v[i])[1] != '') v[i] = v[i].substring((count));
                }
                result = v.join(`\n`);
                elt.innerHTML = result;
            });
        }
        
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

    if (data.tagIndexor) {
        if (!("contentQuery" in data.tagIndexor)) console.error(`tmlTitle.js : contentQuery is missing from tagIndexor function.`);
        else tagIndexor(data.tagIndexor);
    }
    if (data.footNote) {
        if (!(`contentQuery` in data.footNote)) console.error(`tmlTitle.js : contentQuery is missing from footNote function.`);
        else footNote(data.footNote);
    }

    if(data.codeTabManager){
        codeTabManager(data.codeTabManager);
    }
}