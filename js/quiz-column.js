function syntax_highlight(code) {
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

//--------------------------------------------------------------------------------------------

class QuizColumn {
    _QuestionsArray;
    _Object;
    _Title;
    _TagsArray;

    constructor(object, title, questions, tags = false) {
        this._QuestionsArray = this.shuffleArray(questions);
        this._Object = object;
        this._Title = title;
        this._TagsArray = tags;

        if (object != null) this.createView();
    }

    createView() {
        const _Quiz = this;

        const mainContainer = this._Object.querySelector(".quiz-container__main");
        const titleContainer = this._Object.querySelector(".quiz-container__title");
        const tagsContainer = this._Object.querySelector(".quiz-container__tags-group");

        const resetButton = this._Object.querySelector(".quiz-container__reset");
        const submitButton = this._Object.querySelector(".quiz-container__submit");

        _Quiz.clearAllChildren(mainContainer);

        if (titleContainer != null) titleContainer.innerText = this._Title;

        this._TagsArray.forEach(function(value) {
            const tag = document.createElement("div");
            tag.classList.add("quiz-container__tag");
            tag.innerText = value;
            tagsContainer.append(tag);
        });

        this._QuestionsArray.forEach(function(value, i) {
            const text = syntax_highlight(value);
            const tag = `
                <div class="quiz-container__elem" draggable="true" data-number=${i}>
                    <pre class="syntax">
                        ${text}
                    </pre>
                    <div class="quiz-conatainer__elem-number">${i}</div>
                </div>
            `;

            mainContainer.innerHTML = mainContainer.innerHTML + tag;
        });

        const draggableElements = mainContainer.querySelectorAll('.quiz-container__elem[draggable="true"]');

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

                draggingElement = elem;
                document.body.append(cloneElement);
            });

            elem.addEventListener("dragend", () => {
                if (cloneElement != null) cloneElement.parentNode.removeChild(cloneElement);

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

        mainContainer.addEventListener("dragover", e => {
            e.preventDefault();
            const afterElement = _Quiz.getDragAfterElement(mainContainer, e.clientY);
            const draggableElement = mainContainer.querySelector('.dragging');

            if (draggableElement != null) {
                if (afterElement != null) {
                    mainContainer.insertBefore(draggableElement, afterElement);
                } else {
                    mainContainer.appendChild(draggableElement);
                }
            }
        });

        resetButton.addEventListener("click", () => {
            var mainElems = mainContainer.querySelectorAll(".quiz-container__elem");

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

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('[draggable="true"]:not(.dragging)')];

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

    get result() {
        var mainElems = this._Object.querySelectorAll(".quiz-container__elem");

        if (mainElems != null) {
            var resultArray = new Array();

            mainElems.forEach(function(value, key) {
                resultArray[key] = value.getAttribute("data-number");
            });
            return resultArray;

        } else return false;

    }

}