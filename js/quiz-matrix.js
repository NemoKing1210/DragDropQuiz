class QuizMatrix {
    _MatrixArray;
    _StorageArray;
    _Object;
    _Title;
    _TagsArray;

    _MatrixSizeX;
    _MatrixSizeY;

    _ImgSrc = "img/matrix/";

    constructor(object, title, matrix, storage, tags = false) {
        this._MatrixArray = matrix;
        this._StorageArray = storage;
        this._Object = object;
        this._Title = title;
        this._TagsArray = tags;

        if (matrix != null) {
            this._MatrixSizeY = matrix.length;
            this._MatrixSizeX = matrix[0].length;
        }

        if (object != null) this.createView();
    }

    createView() {
        const _Quiz = this;

        const mainContainer = this._Object.querySelector(".quiz-container__main");
        const titleContainer = this._Object.querySelector(".quiz-container__title");
        const tagsContainer = this._Object.querySelector(".quiz-container__tags-group");

        const resetButton = this._Object.querySelector(".quiz-container__reset");
        const submitButton = this._Object.querySelector(".quiz-container__submit");

        const storageContainer = this._Object.querySelector(".quiz-container__storage");
        const matrixContainer = this._Object.querySelector(".quiz-container__matrix");

        _Quiz.clearAllChildren(storageContainer);
        _Quiz.clearAllChildren(matrixContainer);

        if (titleContainer != null) titleContainer.innerText = this._Title;

        this._TagsArray.forEach(function(value) {
            const tag = document.createElement("div");
            tag.classList.add("quiz-container__tag");
            tag.innerText = value;
            tagsContainer.append(tag);
        });


        this._MatrixArray.forEach(function(row) {
            row.forEach(function(value, i) {

                const lValue = value.toLowerCase();
                const img = _Quiz._ImgSrc + value.toLowerCase() + ".png";

                var newTag;
                if (lValue == "null") {
                    newTag = `<div class="quiz-container__cont-matrix null" data-number=${i}></div>`;
                } else if (lValue == "drop") {
                    newTag = `<div class="quiz-container__cont-matrix" data-drop="true" data-number=${i}></div>`;
                } else {
                    newTag = `
                    <div class="quiz-container__cont-matrix" data-number=${i}>
                        <img class="quiz-container__matrix-img" src="${img}" alt="">
                    </div>
                    `;
                }

                matrixContainer.innerHTML = matrixContainer.innerHTML + newTag;
            });
        });

        matrixContainer.style.gridTemplateColumns = "repeat(" + _Quiz._MatrixSizeX + ", 128px)";

        this._StorageArray.forEach(function(value, i) {
            const lValue = value.toLowerCase();
            const img = _Quiz._ImgSrc + value.toLowerCase() + ".png";

            const tag = `
                <div class="quiz-container__elem-matrix" draggable="true" data-value=${value}>  
                    <img class="quiz-container__matrix-img" src="${img}" alt="">
                </div>
                `;

            storageContainer.innerHTML = storageContainer.innerHTML + tag;
        });

        const draggableElements = mainContainer.querySelectorAll('.quiz-container__elem-matrix[draggable="true"]');
        const dropContainers = matrixContainer.querySelectorAll('.quiz-container__cont-matrix[data-drop="true"]');

        draggableElements.forEach(function(elem) {
            var cloneElement, draggingElement, elementPosition;

            elem.addEventListener("dragstart", e => {
                mainContainer.classList.add("dragging");
                elem.classList.add("dragging");

                cloneElement = elem.cloneNode(true);
                cloneElement.setAttribute("draggable", false);
                cloneElement.classList.add("clone");
                cloneElement.style.width = elem.offsetWidth + "px";

                const pos = elem.getBoundingClientRect()
                elementPosition = {
                    left: e.clientX - pos.left,
                    top: e.clientY - pos.top
                };

                const dropEffect = mainContainer.querySelectorAll('.quiz-container__cont-matrix[data-drop="true"]:empty');
                _Quiz.changeGroupClass(dropEffect, "drop", "add");

                draggingElement = elem;
                document.body.append(cloneElement);
            });

            elem.addEventListener("dragend", () => {
                if (cloneElement != null) cloneElement.parentNode.removeChild(cloneElement);

                const dropEffect = mainContainer.querySelectorAll('.quiz-container__cont-matrix[data-drop="true"]:empty');
                _Quiz.changeGroupClass(dropEffect, "drop", "remove");

                mainContainer.classList.remove("dragging");
                elem.classList.remove("dragging");
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

        storageContainer.addEventListener("dragover", e => {
            e.preventDefault();
            const draggableElement = mainContainer.querySelector('.dragging');

            if (draggableElement != null) {
                storageContainer.appendChild(draggableElement);
            }
        });

        dropContainers.forEach(function(child) {
            child.addEventListener("dragover", e => {
                e.preventDefault();
                const draggableElement = mainContainer.querySelector('.dragging');

                if (draggableElement != null) {
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
            const dropEffect = mainContainer.querySelectorAll('.quiz-container__cont-matrix[data-drop="true"]:empty');
            _Quiz.changeGroupClass(dropEffect, "drop", "remove");
        });

    }

    shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
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

    visibleContent(elem, opacity) {
        Array.from(elem.children).forEach(function(child) {
            child.style.opacity = opacity;
        });
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

    get result() {
        // var mainElems = this._Object.querySelectorAll(".quiz-container__elem");

        // if (mainElems != null) {
        //     var resultArray = new Array();

        //     mainElems.forEach(function(value, key) {
        //         resultArray[key] = value.getAttribute("data-number");
        //     });
        //     return resultArray;

        // } else return false;
    }

}