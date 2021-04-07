class Quiz {
    _DataArray;
    _ElementsValueArray = new Array();
    _StorageArray = new Array();

    _Object;
    _Title;
    _TagsArray;

    static _DefaultShuffle = true;
    _Shuffle;

    static _DefaultSplitChar = "\n";
    _Split;

    static _DefaultType = "column"
    _Type;
    _Code;

    static _DefaultMainContClass = "quiz-container__main";
    static _DefaultHeaderContClass = "quiz-container__header";
    static _DefaultTitleClass = "quiz-container__title";
    static _DefaultTagsContClass = "quiz-container__tags-group";
    static _DefaultFooterContClass = "quiz-container__footer";

    static _DefaultStorageContClass = "quiz-container__storage";
    static _DefaultMatrixContClass = "quiz-container__matrix";

    static _DefaultMatrixElemContClass = "quiz-container__cont-matrix";
    static _DefaultMatrixElementClass = "quiz-container__elem-matrix";
    static _DefaultMatrixImgClass = "quiz-container__matrix-img";

    static _DefaultTagClass = "quiz-container__tag";
    static _DefaultElementClass = "quiz-container__elem";
    static _DefaultElementVisualClass = "quiz-container__elem-vizual";
    static _DefaultElementNumberClass = "quiz-conatainer__elem-number";

    static _DefaultDraggingElementClass = "dragging";
    static _DafaultCloneElementClass = "clone";

    static _DefaultResetButtonClass = "quiz-container__reset";
    static _DefaultSubmitButtonClass = "quiz-container__submit";

    static _DefaultNumberAttribute = "data-number";

    // ------------------------------------ Tooltip ------------------------------------------

    static _DefaultTooltipBodyAttribute = "tooltip-body";
    static _DefaultTooltipHeaderAttribute = "tooltip-header";
    static _DefaultTooltipPositionAttribute = "tooltip-position";

    static _DefaultTooltip = {
        resetButton: {
            Body: "Return all items to their starting position",
            Header: "Help",
            Position: "Top"
        },
        submitButton: {
            Body: "Finish the task",
            Header: "Help",
            Position: "Top"
        }
    }

    _Tooltip;

    // ------------------------------------ Matrix ------------------------------------------

    static _DefaultImageType = ".png";

    _MatrixSizeX;
    _MatrixSizeY;

    static _DefaultMatrixSizeElements = 128;
    _MatrixSizeElements;

    static _DefaultMatrixImgSrc = "img/matrix/";
    _MatrixImgSrc;
    _ImgType;

    constructor(settings) { // Initializing settings
        this._Object = settings.Object != undefined ? settings.Object : false;
        this._Title = settings.Title != undefined ? settings.Title : false;
        this._TagsArray = settings.Tags != undefined ? settings.Tags : false;
        this._Shuffle = settings.Shuffle != undefined ? settings.Shuffle : Quiz._DefaultShuffle;
        this._Type = settings.Type != undefined ? settings.Type.toLowerCase() : Quiz._DefaultType;
        this._Split = settings.Split != undefined ? settings.Split : false;
        this._Code = settings.Code != undefined ? settings.Code : false;

        this._ImgType = settings.ImgType != undefined ? settings.ImgType : false;

        this._Tooltip = settings.Tooltip != undefined ? settings.Tooltip : true;

        if (this._Type == "column" || this._Type == 1) {

            if (settings.Split != undefined && settings.Split != false && (typeof settings.Data) == 'string') {
                this._Split = settings.Split;

                const arrayString = settings.Data.split(Quiz._DefaultSplitChar);
                const stringSize = arrayString.length / settings.Split;

                if (settings.Split >= arrayString) {
                    var newArray = [settings.Data];
                    settings.Data = newArray;

                } else {
                    var newString = "";
                    var curIter = 0;
                    var splitNum = 0;
                    var newArray = new Array();

                    for (var i = 0; i < arrayString.length; i++) {
                        var newString = newString + arrayString[i] + Quiz._DefaultSplitChar;
                        curIter++;

                        if (curIter >= Math.round(stringSize) && splitNum != settings.Split - 1) {
                            newArray.push(newString);
                            newString = "";

                            curIter = 0;
                            splitNum++;
                        } else if (i == arrayString.length - 1) {
                            newArray.push(newString);
                        }
                    }

                    settings.Data = newArray;
                }
            }

            if (this._Shuffle == true) {
                this._DataArray = settings.Data != undefined ? Quiz.shuffleArray(settings.Data.slice()) : false;
            } else {
                this._DataArray = settings.Data != undefined ? settings.Data.slice() : false;
            }

        } else {

            this._DataArray = settings.Data != undefined ? Quiz.deepObjectCopy(settings.Data) : false;
            this._MatrixSizeElements = settings.Size != undefined ? settings.Size : Quiz._DefaultMatrixSizeElements;
            this._MatrixImgSrc = settings.ImgSrc != undefined ? settings.ImgSrc : Quiz._DefaultMatrixImgSrc;

            if (this._DataArray != null || this._DataArray != undefined) {
                this._MatrixSizeY = this._DataArray.length;
                this._MatrixSizeX = this._DataArray[0].length;
            }

        }

        if (this._Object != false && this._DataArray != false) this.createBaseComponents();
    }

    createBaseComponents() {
        const _Class = this;

        var headerContainer = this._Object.querySelector(`.${Quiz._DefaultHeaderContClass}`);
        var titleContainer = this._Object.querySelector(`.${Quiz._DefaultTitleClass}`);
        var tagsContainer = this._Object.querySelector(`.${Quiz._DefaultTagsContClass}`);
        var mainContainer = this._Object.querySelector(`.${Quiz._DefaultMainContClass}`);
        var footerContainer = this._Object.querySelector(`.${Quiz._DefaultMainContClass}`);

        var resetButton = this._Object.querySelector(`.${Quiz._DefaultResetButtonClass}`);
        var submitButton = this._Object.querySelector(`.${Quiz._DefaultSubmitButtonClass}`);

        if (headerContainer == null || headerContainer == undefined) {
            headerContainer = document.createElement("div");
            headerContainer.classList.add(Quiz._DefaultHeaderContClass);
            _Class._Object.prepend(headerContainer);
        }

        if (this._Title != false) {
            if (titleContainer == null || titleContainer == undefined) {
                titleContainer = document.createElement("div");
                titleContainer.classList.add(Quiz._DefaultTitleClass);
                headerContainer.prepend(titleContainer);
            }
            titleContainer.innerText = this._Title;
        }

        if (tagsContainer == null || tagsContainer == undefined) {
            tagsContainer = document.createElement("div");
            tagsContainer.classList.add(Quiz._DefaultTagsContClass);
            headerContainer.append(tagsContainer);
        }

        if (this._TagsArray != false) {
            this._TagsArray.forEach(function(value) {
                const tag = document.createElement("div");
                tag.classList.add(Quiz._DefaultTagClass);
                tag.innerText = value;
                tagsContainer.append(tag);
            });
        }

        if (mainContainer == null || mainContainer == undefined) {
            mainContainer = document.createElement("div");
            mainContainer.classList.add(Quiz._DefaultMainContClass);
            headerContainer.parentNode.insertBefore(mainContainer, headerContainer.nextSibling);
        }

        if (footerContainer == null || footerContainer == undefined) {
            footerContainer = document.createElement("div");
            footerContainer.classList.add(Quiz._DefaultFooterContClass);
            _Class._Object.append(footerContainer);
        }

        if (resetButton == null || resetButton == undefined) {
            resetButton = document.createElement("button");
            resetButton.classList.add(Quiz._DefaultResetButtonClass);
            footerContainer.append(resetButton);
        }

        if (submitButton == null || submitButton == undefined) {
            submitButton = document.createElement("button");
            submitButton.classList.add(Quiz._DefaultSubmitButtonClass);
            footerContainer.prepend(submitButton);
        }

        if (this._Tooltip == true) {
            resetButton.setAttribute(Quiz._DefaultTooltipBodyAttribute, Quiz._DefaultTooltip.resetButton.Body);
            resetButton.setAttribute(Quiz._DefaultTooltipHeaderAttribute, Quiz._DefaultTooltip.resetButton.Header);
            resetButton.setAttribute(Quiz._DefaultTooltipPositionAttribute, Quiz._DefaultTooltip.resetButton.Position);

            submitButton.setAttribute(Quiz._DefaultTooltipBodyAttribute, Quiz._DefaultTooltip.submitButton.Body);
            submitButton.setAttribute(Quiz._DefaultTooltipHeaderAttribute, Quiz._DefaultTooltip.submitButton.Header);
            submitButton.setAttribute(Quiz._DefaultTooltipPositionAttribute, Quiz._DefaultTooltip.submitButton.Position);
        }

        resetButton.addEventListener("click", () => {
            _Class.resetDraggableElements(_Class);
        });

        if (this._Type.toLowerCase() == "column" || this._Type == 1) {
            this.createColumnView();
        } else if (this._Type.toLowerCase() == "matrix" || this._Type == 2) {
            this.createMatrixView();
        } else {
            console.log("Invalid TYPE parameter");
        }

    }

    createColumnView() {
        const _Class = this;

        const mainContainer = this._Object.querySelector(`.${Quiz._DefaultMainContClass}`);

        Quiz.clearAllChildren(mainContainer);

        this._DataArray.forEach(function(value, i) {
            const text = _Class._Code == true ? _Class.syntaxHighlight(value) : value;
            var createdElement = null;

            if (_Class._Code) {
                createdElement = `
                    <div class="${Quiz._DefaultElementClass}" draggable="true" ${Quiz._DefaultNumberAttribute}="${i}">
                        <pre class="syntax">
                            ${text}
                        </pre>
                        <div class="${Quiz._DefaultElementNumberClass}">${i}</div>
                    </div>`;
            } else {
                createdElement = `
                    <div class="${Quiz._DefaultElementClass}" draggable="true" ${Quiz._DefaultNumberAttribute}="${i}">
                        <div>
                            ${text}
                        </div>
                        <div class="${Quiz._DefaultElementNumberClass}">${i}</div>
                    </div>`;
            }

            mainContainer.innerHTML = mainContainer.innerHTML + createdElement;

            _Class._ElementsValueArray[i] = {
                _ElementDOM: null,
                _Value: value
            };
        });

        const draggableElements = mainContainer.querySelectorAll(`.${Quiz._DefaultElementClass}[draggable="true"]`);
        var cloneElement, draggableElement, elementPosition, afterElement, dropVisualElement;

        draggableElements.forEach(function(elem, i) {
            _Class._ElementsValueArray[i]._ElementDOM = elem;
        });

        draggableElements.forEach(function(elem) {

            elem.addEventListener("dragstart", e => {
                mainContainer.classList.add(Quiz._DefaultDraggingElementClass);
                elem.classList.add(Quiz._DefaultDraggingElementClass);

                if (!_Class.isMobile) {
                    cloneElement = elem.cloneNode(true);
                    cloneElement.setAttribute("draggable", false);
                    cloneElement.classList.add(Quiz._DafaultCloneElementClass);
                    cloneElement.style.width = elem.offsetWidth + "px";

                    dropVisualElement = document.createElement("div");
                    dropVisualElement.classList.add(Quiz._DefaultElementVisualClass);
                    dropVisualElement.style.width = elem.offsetWidth + "px";
                    dropVisualElement.style.height = elem.offsetHeight + "px";

                    document.body.append(dropVisualElement);
                    document.body.append(cloneElement);
                }

                const pos = elem.getBoundingClientRect()
                elementPosition = {
                    left: e.clientX - pos.left,
                    top: e.clientY - pos.top
                };

                draggableElement = elem;
            });

            elem.addEventListener("dragend", e => {
                if (cloneElement != null || cloneElement != undefined) {
                    cloneElement.parentNode.removeChild(cloneElement);
                    cloneElement = null;
                }

                if (dropVisualElement != null || dropVisualElement != undefined) {
                    dropVisualElement.parentNode.removeChild(dropVisualElement);
                    dropVisualElement = null;
                }

                mainContainer.classList.remove(Quiz._DefaultDraggingElementClass);
                elem.classList.remove(Quiz._DefaultDraggingElementClass);
            });

            elem.addEventListener("drag", e => {
                if (cloneElement != null || cloneElement != undefined) {
                    const topValue = e.clientY - elementPosition.top;
                    const leftValue = e.clientX - elementPosition.left;
                    cloneElement.style.top = topValue + "px";
                    cloneElement.style.left = leftValue + "px";

                    cloneElement.style.opacity = "1"
                }

                if (dropVisualElement != null || dropVisualElement != undefined) {
                    dropVisualElement.style.left = draggableElement.offsetLeft + "px";
                    dropVisualElement.style.top = draggableElement.offsetTop + "px";
                }
            });
        });

        mainContainer.addEventListener("dragover", e => {
            e.preventDefault();
            afterElement = _Class.getDragAfterElement(mainContainer, e.clientY);

            if (draggableElement != null) {
                if (afterElement != null) {
                    mainContainer.insertBefore(draggableElement, afterElement);
                } else {
                    mainContainer.appendChild(draggableElement);
                }
            }
        });

    }

    createMatrixView() {
        const _Class = this;

        const mainContainer = this._Object.querySelector(`.${Quiz._DefaultMainContClass}`);

        var storageContainer = this._Object.querySelector(`.${Quiz._DefaultStorageContClass}`);
        var matrixContainer = this._Object.querySelector(`.${Quiz._DefaultMatrixContClass}`);

        if (storageContainer == null || storageContainer == undefined) {
            storageContainer = document.createElement("div");
            storageContainer.classList.add(Quiz._DefaultStorageContClass);
            mainContainer.prepend(storageContainer);
        }

        if (matrixContainer == null || matrixContainer == undefined) {
            matrixContainer = document.createElement("div");
            matrixContainer.classList.add(Quiz._DefaultMatrixContClass);
            mainContainer.append(matrixContainer);
        }

        Quiz.clearAllChildren(storageContainer);
        Quiz.clearAllChildren(matrixContainer);

        this._DataArray.forEach(function(row, x) {
            row.forEach(function(value, y) {
                const splValue = value.split(" ");

                if (splValue[1] != null || splValue[1] != undefined) {
                    const modif = splValue[1].toLowerCase();

                    if (modif == "drop") {
                        _Class._DataArray[x][y] = modif;
                        _Class._StorageArray.push(splValue[0]);
                    } else if (modif == "null") {
                        _Class._DataArray[x][y] = modif;
                    }

                }

            });
        });

        _Class._StorageArray = Quiz.shuffleArray(_Class._StorageArray);

        this._DataArray.forEach(function(row, x) {
            row.forEach(function(value, y) {

                const extValue = value.split(".");
                const lValue = value.toLowerCase();
                var imgPath;

                if (extValue.length > 1) {
                    imgPath = _Class._MatrixImgSrc + value;
                } else {
                    if (_Class._ImgType != false) imgPath = _Class._MatrixImgSrc + value + _Class._ImgType;
                    else imgPath = _Class._MatrixImgSrc + value + Quiz._DefaultImageType;
                }

                const numValue = x + "|" + y;

                var createdElement;
                if (lValue == "null") {
                    createdElement = `<div class="${Quiz._DefaultMatrixElemContClass} null" ${Quiz._DefaultNumberAttribute}=${numValue}></div>`;
                } else if (lValue == "drop") {
                    createdElement = `<div class="${Quiz._DefaultMatrixElemContClass}" data-drop="true" ${Quiz._DefaultNumberAttribute}=${numValue}></div>`;
                } else {
                    createdElement = `
                    <div class="${Quiz._DefaultMatrixElemContClass}" ${Quiz._DefaultNumberAttribute}=${numValue}>
                        <img class="${Quiz._DefaultMatrixImgClass}" src="${imgPath}" alt="">
                    </div>
                    `;
                }

                matrixContainer.innerHTML = matrixContainer.innerHTML + createdElement;

            });
        });

        matrixContainer.style.gridTemplateColumns = `repeat(${_Class._MatrixSizeX}, ${_Class._MatrixSizeElements}px)`;
        matrixContainer.style.gridTemplateRows = `repeat(${_Class._MatrixSizeY}, ${_Class._MatrixSizeElements}px)`;

        _Class._StorageArray.forEach(function(value, i) {
            const extValue = value.split(".");
            var imgPath;

            if (extValue.length > 1) {
                imgPath = _Class._MatrixImgSrc + value;
            } else {
                if (_Class._ImgType != false) imgPath = _Class._MatrixImgSrc + value + _Class._ImgType;
                else imgPath = _Class._MatrixImgSrc + value + Quiz._DefaultImageType;
            }

            const tag = `
                <div class="${Quiz._DefaultMatrixElementClass}" draggable="true" ${Quiz._DefaultNumberAttribute}=${i}>  
                    <img class="${Quiz._DefaultMatrixImgClass}" src="${imgPath}">
                </div>
                `;

            storageContainer.innerHTML = storageContainer.innerHTML + tag;
        });

        const draggableElements = mainContainer.querySelectorAll(`.${Quiz._DefaultMatrixElementClass}[draggable="true"]`);
        const dropContainers = matrixContainer.querySelectorAll(`.${Quiz._DefaultMatrixElemContClass}[data-drop="true"]`);

        var cloneElement, draggableElement, elementPosition, dropContainer, lastDropContainer;

        draggableElements.forEach(function(elem) {

            elem.style.height = _Class._MatrixSizeElements + "px";
            elem.style.width = _Class._MatrixSizeElements + "px";

            elem.addEventListener("dragstart", e => {
                mainContainer.classList.add(Quiz._DefaultDraggingElementClass);
                elem.classList.add(Quiz._DefaultDraggingElementClass);

                if (!_Class.isMobile) {
                    cloneElement = elem.cloneNode(true);
                    cloneElement.setAttribute("draggable", false);
                    cloneElement.classList.add(Quiz._DafaultCloneElementClass);
                    cloneElement.style.width = elem.offsetWidth + "px";

                    document.body.append(cloneElement);
                }

                const pos = elem.getBoundingClientRect()
                elementPosition = {
                    left: e.clientX - pos.left,
                    top: e.clientY - pos.top
                };

                const dropEffect = mainContainer.querySelectorAll(`.${Quiz._DefaultMatrixElemContClass}[data-drop="true"]:empty`);
                Quiz.changeGroupClass(dropEffect, "drop", "add");

                lastDropContainer = elem.parentNode;
                draggableElement = elem;
            });

            elem.addEventListener("dragend", () => {
                if (cloneElement != null || cloneElement != undefined) {
                    cloneElement.parentNode.removeChild(cloneElement);
                    cloneElement = null;
                }

                if (draggableElement != null || draggableElement != undefined) {
                    if (dropContainer == null || dropContainer == undefined) {
                        storageContainer.append(draggableElement);
                    } else {
                        if (dropContainer == storageContainer) {
                            storageContainer.appendChild(draggableElement);
                        } else {
                            if (dropContainer.firstChild == null) {
                                dropContainer.appendChild(draggableElement);
                            } else {
                                const childElement = dropContainer.firstChild;
                                lastDropContainer.append(childElement);
                                dropContainer.appendChild(draggableElement);
                            }
                        }
                    }
                }

                const dropEffect = mainContainer.querySelectorAll(`.${Quiz._DefaultMatrixElemContClass}[data-drop="true"]:empty`);
                Quiz.changeGroupClass(dropEffect, "drop", "remove");

                mainContainer.classList.remove(Quiz._DefaultDraggingElementClass);
                elem.classList.remove(Quiz._DefaultDraggingElementClass);

                lastDropContainer = null;
                draggableElement = null;
            });

            elem.addEventListener("drag", e => {
                if (cloneElement != null || cloneElement != undefined) {
                    var topValue = e.clientY - elementPosition.top;
                    var leftValue = e.clientX - elementPosition.left;
                    cloneElement.style.top = topValue + "px";
                    cloneElement.style.left = leftValue + "px";

                    cloneElement.style.opacity = "1"
                }
            });
        });

        storageContainer.addEventListener("dragover", e => {
            e.preventDefault();
            dropContainer = storageContainer;
        });

        storageContainer.addEventListener("dragleave", e => {
            e.preventDefault();
            dropContainer = null;
        });

        dropContainers.forEach(function(child) {
            child.addEventListener("dragover", e => {
                e.preventDefault();
                dropContainer = child;
            });
        });

        dropContainers.forEach(function(child) {
            child.addEventListener("dragleave", e => {
                e.preventDefault();
                dropContainer = null;
            });
        });

    }

    // ---------------------------------------------------------------------------------------

    resetDraggableElements(_Class) {
        const mainContainer = this._Object.querySelector(`.${Quiz._DefaultMainContClass}`);

        if (this._Type == "column" || this._Type == 1) {

            var draggableElements = mainContainer.querySelectorAll(`.${Quiz._DefaultElementClass}`);

            draggableElements = [].slice.call(draggableElements).sort(function(a, b) {
                var aNum = a.getAttribute(Quiz._DefaultNumberAttribute);
                var bNum = b.getAttribute(Quiz._DefaultNumberAttribute);
                return aNum - bNum;
            });

            draggableElements.forEach(function(elem) {
                mainContainer.append(elem);
            });

        } else if (this._Type == "matrix" || this._Type == 2) {

            const draggableElements = mainContainer.querySelectorAll(`.${Quiz._DefaultMatrixElementClass}`);
            const storageContainer = mainContainer.querySelector(`.${Quiz._DefaultStorageContClass}`);

            draggableElements.forEach(function(elem) {
                storageContainer.append(elem);
            });

            const dropEffect = mainContainer.querySelectorAll(`.${Quiz._DefaultMatrixElemContClass}[data-drop="true"]:empty`);
            Quiz.changeGroupClass(dropEffect, "drop", "remove");
        } else console.error("Invalid Type")

    }

    syntaxHighlight(code) {
        var comments = [];
        var strings = [];
        var res = [];
        var all = { 'C': comments, 'S': strings, 'R': res };
        var safe = { '<': '<', '>': '>', '&': '&' };
        return code
            .replace(/[<>&]/g, function(m) { return safe[m]; })
            .replace(/\/\*[\s\S]*\*\//g, function(m) {
                var l = comments.length;
                comments.push(m);
                return '~~~C' + l + '~~~';
            })
            .replace(/([^\\])\/\/[^\n]*\n/g, function(m, f) {
                var l = comments.length;
                comments.push(m);
                return f + '~~~C' + l + '~~~';
            })
            .replace(/\/(\\\/|[^\/\n])*\/[gim]{0,3}/g, function(m) {
                var l = res.length;
                res.push(m);
                return '~~~R' + l + '~~~';
            })
            .replace(/([^\\])((?:'(?:\\'|[^'])*')|(?:"(?:\\"|[^"])*"))/g, function(m, f, s) {
                var l = strings.length;
                strings.push(s);
                return f + '~~~S' + l + '~~~';
            })
            .replace(/(var|function|typeof|new|return|if|for|in|while|break|do|continue|switch|case)([^a-z0-9\$_])/gi,
                '<span class="K">$1</span>$2')
            .replace(/(\{|\}|\]|\[|\|)/gi,
                '<span class="G">$1</span>')
            .replace(/([a-z\_\$][a-z0-9_]*)[\s]*\(/gi,
                '<span class="F">$1</span>(')
            .replace(/~~~([CSR])(\d+)~~~/g, function(m, t, i) { return '<span class="' + t + '">' + all[t][i] + '</span>'; })
            .replace(/\n/g,
                '<br/>')
            .replace(/\t/g,
                '&nbsp;&nbsp;&nbsp;&nbsp;');
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll(`[draggable="true"]:not(.${this._DefaultDraggingElementClass})`)];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    static shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    static deepObjectCopy(obj) {
        if (typeof obj == 'object') {
            if (Array.isArray(obj)) {
                var l = obj.length;
                var r = new Array(l);
                for (var i = 0; i < l; i++) {
                    r[i] = Quiz.deepObjectCopy(obj[i]);
                }
                return r;
            } else {
                var r = {};
                r.prototype = obj.prototype;
                for (var k in obj) {
                    r[k] = Quiz.deepObjectCopy(obj[k]);
                }
                return r;
            }
        }
        return obj;
    }

    static clearAllChildren(elem) {
        if (Array.isArray(elem)) {
            Array.from(elem.children).forEach(function(child) {
                child.innerHTML = "";
            });
        } else {
            elem.innerHTML = "";
        }
    }

    static changeGroupClass(array, classC, func) {
        const funcL = func.toLowerCase();
        array.forEach(function(child) {
            if (funcL == "add") {
                child.classList.add(classC);
            } else if (funcL == "remove") {
                child.classList.remove(classC);
            }
        });
    }

    static createHTML(htmlStr) {
        var frag = document.createDocumentFragment(),
            temp = document.createElement('div');
        temp.innerHTML = htmlStr;
        while (temp.firstChild) {
            frag.appendChild(temp.firstChild);
        }
        return frag;
    }

    static visibleContent(elem, opacity) {
        Array.from(elem.children).forEach(function(child) {
            child.style.opacity = opacity;
        });
    }

    get isMobile() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
            return true;
        } else return false;
    }

    get resetButton() {
        const resetButton = this._Object.querySelector(`.${Quiz._DefaultResetButtonClass}`);
        if (resetButton != null || resetButton != undefined && typeof resetButton == "object") {
            return resetButton;
        } else return false;
    }

    get submitButton() {
        var submitButton = this._Object.querySelector(`.${Quiz._DefaultSubmitButtonClass}`);
        if (submitButton != null || submitButton != undefined && typeof submitButton == "object") {
            return submitButton;
        } else return false;
    }

    getResult(originalData) {
        const _Class = this;

        if (this._Type == "column" || this._Type == 1) {
            var draggableElements = this._Object.querySelectorAll(`.${Quiz._DefaultElementClass}`);

            if (draggableElements != null || draggableElements != undefined) {
                var resultArray = new Array();
                var resultValue = true;

                draggableElements.forEach(function(value, key) {
                    resultArray[key] = value.getAttribute(Quiz._DefaultNumberAttribute);
                });

                if (typeof originalData == "string") {

                    const arrayString = originalData.split(Quiz._DefaultSplitChar);
                    var newOriginString = "";
                    var newCurString = "";

                    arrayString.forEach(function(value, i) {
                        newOriginString = newOriginString + value + Quiz._DefaultSplitChar;
                    });

                    resultArray.forEach(function(value, i) {
                        newCurString = newCurString + _Class._ElementsValueArray[resultArray[i]]._Value;
                    });

                    if (newOriginString == newCurString) return true;
                    else return false;

                } else if (typeof originalData == "object") {

                    for (var i = 0; i < draggableElements.length; i++) {
                        const curValue = _Class._ElementsValueArray[resultArray[i]]._Value;
                        const originalValue = originalData[i];

                        if (curValue != originalValue) {
                            resultValue = false;
                            break;
                        }

                    }

                    return resultValue;

                }

            } else return false;

        } else if (this._Type == "matrix" || this._Type == 2) {

            const draggableElements = this._Object.querySelectorAll(`.${Quiz._DefaultMatrixElementClass}[draggable="true"]`);

            const storageContainer = this._Object.querySelector(`.${Quiz._DefaultStorageContClass}`);
            const matrixContainer = this._Object.querySelector(`.${Quiz._DefaultMatrixContClass}`);

            if (draggableElements != null || draggableElements != undefined) {

                var resultValue = true;

                draggableElements.forEach(function(value, i) {
                    if (value.parentNode != storageContainer) {
                        const parent = value.parentNode;

                        if (parent.hasAttribute(Quiz._DefaultNumberAttribute) && value.hasAttribute(Quiz._DefaultNumberAttribute)) {

                            const splitNum = parent.getAttribute(Quiz._DefaultNumberAttribute).split("|");
                            const attributeValue = value.getAttribute(Quiz._DefaultNumberAttribute);
                            const curValue = _Class._StorageArray[value.getAttribute(Quiz._DefaultNumberAttribute)];
                            const originalValue = originalData[splitNum[0]][splitNum[1]].split(" ");

                            if (curValue != originalValue[0]) resultValue = false;

                        } else resultValue = false;
                    } else resultValue = false;
                });

                return resultValue;

            } else return false;

        }

    }

}