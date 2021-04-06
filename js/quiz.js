class Quiz {
    _DataArray;
    _ResultArray = new Array();

    _ElementsValueArray = new Array();

    _Object;
    _Title;
    _TagsArray;

    _Shuffle = true;
    _Split;

    _DefaultType = "column"
    _Type;

    _DefaultScrollKeys = { 37: 1, 38: 1, 39: 1, 40: 1 };

    _DefaultMainContClass = "quiz-container__main";
    _DefaultHeaderContClass = "quiz-container__header";
    _DefaultTitleClass = "quiz-container__title";
    _DefaultTagsContClass = "quiz-container__tags-group";

    _DefaultStorageContClass = "quiz-container__storage";
    _DefaultMatrixContClass = "quiz-container__matrix";

    _DefaultMatrixElemContClass = "quiz-container__cont-matrix";
    _DefaultMatrixElementClass = "quiz-container__elem-matrix";
    _DefaultMatrixImgClass = "quiz-container__matrix-img";

    _DefaultTagClass = "quiz-container__tag";
    _DefaultElementClass = "quiz-container__elem";
    _DefaultElementNumberClass = "quiz-conatainer__elem-number";

    _DefaultDraggingElementClass = "dragging";
    _DafaultCloneElementClass = "clone";

    _DefaultResetButtonClass = "quiz-container__reset";
    _DefaultSubmitButtonClass = "quiz-container__submit";

    _MatrixSizeX;
    _MatrixSizeY;

    _DefaultMatrixSizeElements = 128;

    _DefaultMatrixImgSrc = "img/matrix/";
    _MatrixImgSrc;

    constructor(settings) { // Initializing settings
        this._Object = settings.Object != undefined ? settings.Object : false;
        this._Title = settings.Title != undefined ? settings.Title : false;
        this._TagsArray = settings.Tags != undefined ? settings.Tags : false;
        this._Shuffle = settings.Shuffle != undefined ? settings.Shuffle : false;
        this._Type = settings.Type != undefined ? settings.Type.toLowerCase() : this._DefaultType;
        this._Split = settings.Split != undefined ? settings.Split : false;

        if (this._Type == "column" || this._Type == 1) {

            if (settings.Split != undefined && settings.Split != false && (typeof settings.Data) == 'string') {
                this._Split = settings.Split;

                const arrayString = settings.Data.split("\n");
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
                        var newString = newString + arrayString[i] + "\n";
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
                this._DataArray = settings.Data != undefined ? this.shuffleArray(settings.Data) : false;
            } else {
                this._DataArray = settings.Data != undefined ? settings.Data : false;
            }

        } else {

            this._DataArray = settings.Data != undefined ? settings.Data : false;
            this._DefaultMatrixSizeElements = settings.Size != undefined ? settings.Size : false;
            this._MatrixImgSrc = settings.ImgSrc != undefined ? settings.ImgSrc : this._DefaultMatrixImgSrc;

            if (this._DataArray != null || this._DataArray != undefined) {
                this._MatrixSizeY = this._DataArray.length;
                this._MatrixSizeX = this._DataArray[0].length;
            }

        }

        if (this._Object != false && this._DataArray != false) this.createBaseComponents();
    }

    createBaseComponents() {
        const _Class = this;

        var headerContainer = this._Object.querySelector(`.${this._DefaultHeaderContClass}`);
        var titleContainer = this._Object.querySelector(`.${this._DefaultTitleClass}`);
        var tagsContainer = this._Object.querySelector(`.${this._DefaultTagsContClass}`);
        var mainContainer = this._Object.querySelector(`.${this._DefaultMainContClass}`);

        if (headerContainer == null || headerContainer == undefined) {
            headerContainer = document.createElement("div");
            headerContainer.classList.add(_Class._DefaultHeaderContClass);
            _Class._Object.prepend(headerContainer);
        }

        if (this._Title != false) {
            if (titleContainer == null || titleContainer == undefined) {
                titleContainer = document.createElement("div");
                titleContainer.classList.add(_Class._DefaultTitleClass);
                headerContainer.prepend(titleContainer);
            }
            titleContainer.innerText = this._Title;
        }

        if (tagsContainer == null || tagsContainer == undefined) {
            tagsContainer = document.createElement("div");
            tagsContainer.classList.add(_Class._DefaultTagsContClass);
            headerContainer.append(tagsContainer);
        }

        if (this._TagsArray != false) {
            this._TagsArray.forEach(function(value) {
                const tag = document.createElement("div");
                tag.classList.add(_Class._DefaultTagClass);
                tag.innerText = value;
                tagsContainer.append(tag);
            });
        }

        if (mainContainer == null || mainContainer == undefined) {
            mainContainer = document.createElement("div");
            mainContainer.classList.add(_Class._DefaultMainContClass);
            _Class._Object.prepend(headerContainer);
            headerContainer.parentNode.insertBefore(mainContainer, headerContainer.nextSibling);
        }

        if (this._Type.toLowerCase() === "column" || this._Type == 1) {
            this.createColumnView();
        } else if (this._Type.toLowerCase() === "matrix" || this._Type == 2) {
            this.createMatrixView();
        } else {
            console.log("Invalid parameter");
        }

    }

    createColumnView() {
        const _Class = this;

        const mainContainer = this._Object.querySelector(`.${this._DefaultMainContClass}`);

        const resetButton = this._Object.querySelector(`.${this._DefaultResetButtonClass}`);
        const submitButton = this._Object.querySelector(`.${this._DefaultSubmitButtonClass}`);

        _Class.clearAllChildren(mainContainer);

        this._DataArray.forEach(function(value, i) {
            const text = _Class.syntaxHighlight(value);
            const tag = `
                <div class="${_Class._DefaultElementClass}" draggable="true" data-number="${i}">
                    <pre class="syntax">
                        ${text}
                    </pre>
                    <div class="${_Class._DefaultElementNumberClass}">${i}</div>
                </div>
            `;

            mainContainer.innerHTML = mainContainer.innerHTML + tag;

            var createdElement = mainContainer.querySelector(`.${_Class._DefaultElementClass}[data-number="${i}"]`);

            _Class._ElementsValueArray[i] = {
                _ElementDOM: createdElement,
                _Value: value
            };

            _Class._ResultArray[i] = createdElement;
        });

        console.log(_Class._ResultArray);
        console.log(_Class._ElementsValueArray);

        const draggableElements = mainContainer.querySelectorAll(`.${_Class._DefaultElementClass}[draggable="true"]`);
        var cloneElement, draggingElement, elementPosition;

        // draggableElements.forEach(function(elem, i) {
        //     _Class._ResultArray[i] = elem;
        // });

        //console.log(_Class._ResultArray);

        draggableElements.forEach(function(elem) {

            elem.addEventListener("dragstart", e => {
                mainContainer.classList.add(_Class._DefaultDraggingElementClass);
                elem.classList.add(_Class._DefaultDraggingElementClass);

                cloneElement = elem.cloneNode(true);
                cloneElement.setAttribute("draggable", false);
                cloneElement.classList.add(_Class._DafaultCloneElementClass);
                cloneElement.style.width = elem.offsetWidth + "px";

                const pos = elem.getBoundingClientRect()
                elementPosition = {
                    left: e.clientX - pos.left,
                    top: e.clientY - pos.top
                };

                draggingElement = elem;
                document.body.append(cloneElement);
            });

            elem.addEventListener("touchstart", e => {
                mainContainer.classList.add(_Class._DefaultDraggingElementClass);
                elem.classList.add(_Class._DefaultDraggingElementClass);

                const pos = elem.getBoundingClientRect()
                elementPosition = {
                    left: e.clientX - pos.left,
                    top: e.clientY - pos.top
                };

                draggingElement = elem;
            });

            elem.addEventListener("touchend", () => {
                if (cloneElement != null) {
                    cloneElement.parentNode.removeChild(cloneElement);
                    cloneElement = null;
                }

                mainContainer.classList.remove(_Class._DefaultDraggingElementClass);
                elem.classList.remove(_Class._DefaultDraggingElementClass);
            });

            elem.addEventListener("dragend", () => {
                if (cloneElement != null) {
                    cloneElement.parentNode.removeChild(cloneElement);
                    cloneElement = null;
                }

                mainContainer.classList.remove(_Class._DefaultDraggingElementClass);
                elem.classList.remove(_Class._DefaultDraggingElementClass);
            });

            elem.addEventListener("drag", e => {
                if (cloneElement != null) {
                    var topValue = e.pageY - elementPosition.top;
                    var leftValue = e.pageX - elementPosition.left;
                    cloneElement.style.top = topValue + "px";
                    cloneElement.style.left = leftValue + "px";

                    cloneElement.style.opacity = "1"
                }
            });
        });

        mainContainer.addEventListener("dragover", e => {
            e.preventDefault();
            const afterElement = _Class.getDragAfterElement(mainContainer, e.clientY);
            const draggableElement = mainContainer.querySelector(`.${_Class._DefaultDraggingElementClass}`);

            if (draggableElement != null) {
                if (afterElement != null) {
                    mainContainer.insertBefore(draggableElement, afterElement);


                } else {
                    mainContainer.appendChild(draggableElement);


                    var positionDragElement = 0;
                    _Class._ResultArray.forEach(function(value, i) {
                        _Class.clearAllChildren(value);
                        //console.log(value, draggableElement);
                        if (value == draggableElement) positionDragElement = i;
                    });


                    console.log(positionDragElement);

                }
            }
        });

        resetButton.addEventListener("click", () => {
            var mainElems = mainContainer.querySelectorAll(`.${_Class._DefaultElementClass}`);

            mainElems = [].slice.call(mainElems).sort(function(a, b) {
                var aNum = a.getAttribute("data-number");
                var bNum = b.getAttribute("data-number");
                return aNum - bNum;
            });

            mainElems.forEach(function(elem) {
                mainContainer.append(elem);
            });

        });

    }

    createMatrixView() {
        const _Class = this;

        const mainContainer = this._Object.querySelector(`.${this._DefaultMainContClass}`);

        const resetButton = this._Object.querySelector(`.${this._DefaultResetButtonClass}`);
        const submitButton = this._Object.querySelector(`.${this._DefaultSubmitButtonClass}`);

        var storageContainer = this._Object.querySelector(`.${this._DefaultStorageContClass}`);
        var matrixContainer = this._Object.querySelector(`.${this._DefaultMatrixContClass}`);

        if (storageContainer == null || storageContainer == undefined) {
            storageContainer = document.createElement("div");
            storageContainer.classList.add(_Class._DefaultStorageContClass);
            mainContainer.prepend(storageContainer);
        }

        if (matrixContainer == null || matrixContainer == undefined) {
            matrixContainer = document.createElement("div");
            matrixContainer.classList.add(_Class._DefaultMatrixContClass);
            mainContainer.append(matrixContainer);
        }

        _Class.clearAllChildren(storageContainer);
        _Class.clearAllChildren(matrixContainer);

        var _StorageArray = new Array();

        this._DataArray.forEach(function(row, a) {
            row.forEach(function(value, i) {
                const splValue = value.split(" ");

                if (splValue[1] != null || splValue[1] != undefined) {
                    const modif = splValue[1].toLowerCase();

                    if (modif == "drop") {
                        _Class._DataArray[a][i] = modif;
                        _StorageArray.push(splValue[0]);
                    } else if (modif == "null") {
                        _Class._DataArray[a][i] = modif;
                    }

                }
            });
        });

        this._DataArray.forEach(function(row) {
            row.forEach(function(value, i) {

                const lValue = value.toLowerCase();
                const img = _Class._MatrixImgSrc + value.toLowerCase() + ".png";

                var newTag;
                if (lValue == "null") {
                    newTag = `<div class="${_Class._DefaultMatrixElemContClass} null" data-number=${i}></div>`;
                } else if (lValue == "drop") {
                    newTag = `<div class="${_Class._DefaultMatrixElemContClass}" data-drop="true" data-number=${i}></div>`;
                } else {
                    newTag = `
                    <div class="${_Class._DefaultMatrixElemContClass}" data-number=${i}>
                        <img class="${_Class._DefaultMatrixImgClass}" src="${img}" alt="">
                    </div>
                    `;
                }

                matrixContainer.innerHTML = matrixContainer.innerHTML + newTag;
            });
        });

        matrixContainer.style.gridTemplateColumns = `repeat(${_Class._MatrixSizeX}, ${_Class._DefaultMatrixSizeElements}px)`;
        matrixContainer.style.gridTemplateRows = `repeat(${_Class._MatrixSizeY}, ${_Class._DefaultMatrixSizeElements}px)`;

        _StorageArray.forEach(function(value, i) {
            const lValue = value.toLowerCase();
            const img = _Class._MatrixImgSrc + value.toLowerCase() + ".png";

            const tag = `
                <div class="${_Class._DefaultMatrixElementClass}" draggable="true" data-value=${value}>  
                    <img class="${_Class._DefaultMatrixImgClass}" src="${img}" alt="">
                </div>
                `;

            storageContainer.innerHTML = storageContainer.innerHTML + tag;
        });

        const draggableElements = mainContainer.querySelectorAll(`.${_Class._DefaultMatrixElementClass}[draggable="true"]`);
        const dropContainers = matrixContainer.querySelectorAll(`.${_Class._DefaultMatrixElemContClass}[data-drop="true"]`);

        draggableElements.forEach(function(elem) {
            var cloneElement, draggingElement, elementPosition;

            elem.addEventListener("dragstart", e => {
                mainContainer.classList.add(_Class._DefaultDraggingElementClass);
                elem.classList.add(_Class._DefaultDraggingElementClass);

                cloneElement = elem.cloneNode(true);
                cloneElement.setAttribute("draggable", false);
                cloneElement.classList.add(_Class._DafaultCloneElementClass);
                cloneElement.style.width = elem.offsetWidth + "px";

                const pos = elem.getBoundingClientRect()
                elementPosition = {
                    left: e.clientX - pos.left,
                    top: e.clientY - pos.top
                };

                const dropEffect = mainContainer.querySelectorAll(`.${_Class._DefaultMatrixElemContClass}[data-drop="true"]:empty`);
                _Class.changeGroupClass(dropEffect, "drop", "add");

                draggingElement = elem;
                document.body.append(cloneElement);
            });

            elem.addEventListener("dragend", () => {
                if (cloneElement != null || cloneElement != undefined) {
                    cloneElement.parentNode.removeChild(cloneElement);
                    cloneElement = null;
                }

                const dropEffect = mainContainer.querySelectorAll(`.${_Class._DefaultMatrixElemContClass}[data-drop="true"]:empty`);
                _Class.changeGroupClass(dropEffect, "drop", "remove");

                mainContainer.classList.remove(_Class._DefaultDraggingElementClass);
                elem.classList.remove(_Class._DefaultDraggingElementClass);
            });

            elem.addEventListener("drag", e => {
                if (cloneElement != null || cloneElement != undefined) {
                    var topValue = e.pageY - elementPosition.top;
                    var leftValue = e.pageX - elementPosition.left;
                    cloneElement.style.top = topValue + "px";
                    cloneElement.style.left = leftValue + "px";

                    cloneElement.style.opacity = "1"
                }
            });
        });

        storageContainer.addEventListener("dragover", e => {
            e.preventDefault();
            const draggableElement = mainContainer.querySelector(`.${_Class._DefaultDraggingElementClass}`);

            if (draggableElement != null || draggableElement != undefined) {
                storageContainer.appendChild(draggableElement);
            }
        });

        dropContainers.forEach(function(child) {
            child.addEventListener("dragover", e => {
                e.preventDefault();
                const draggableElement = mainContainer.querySelector(`.${_Class._DefaultDraggingElementClass}`);

                if (draggableElement != null || draggableElement != undefined) {
                    if (child.firstChild == null) {
                        child.appendChild(draggableElement);
                    }
                }
            });
        });

        resetButton.addEventListener("click", () => {
            draggableElements.forEach(function(elem) {
                storageContainer.append(elem);
            });
            const dropEffect = mainContainer.querySelectorAll(`.${_Class._DefaultMatrixElemContClass}[data-drop="true"]:empty`);
            _Class.changeGroupClass(dropEffect, "drop", "remove");
        });

    }

    // ---------------------------------------------------------------------------------------

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

    shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    clearAllChildren(elem) {
        if (Array.isArray(elem)) {
            Array.from(elem.children).forEach(function(child) {
                child.innerHTML = "";
            });
        } else {
            elem.innerHTML = "";
        }
    }

    changeGroupClass(array, classC, func) {
        const funcL = func.toLowerCase();
        array.forEach(function(child) {
            if (funcL == "add") {
                child.classList.add(classC);
            } else if (funcL == "remove") {
                child.classList.remove(classC);
            }
        });
    }

    createHTML(htmlStr) {
        var frag = document.createDocumentFragment(),
            temp = document.createElement('div');
        temp.innerHTML = htmlStr;
        while (temp.firstChild) {
            frag.appendChild(temp.firstChild);
        }
        return frag;
    }

    visibleContent(elem, opacity) {
        Array.from(elem.children).forEach(function(child) {
            child.style.opacity = opacity;
        });
    }

    isMobile() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
            return true;
        } else return false;
    }

    getResult(originalData) {

        if (this._Type == "column" || this._Type == 1) {
            var mainElements = this._Object.querySelectorAll(`.${this._DefaultElementClass}`);

            if (mainElements != null) {
                var resultArray = new Array();

                mainElems.forEach(function(value, key) {
                    resultArray[key] = value.getAttribute("data-number");
                });

                if (typeof originalData == "string") {

                } else if (typeof originalData == "array" || typeof originalData == "object") {

                }



            } else return false;

        }

    }

}