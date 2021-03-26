class Tooltip {
    _TooltipContainer;
    _DefaultClass = "tooltip-container";
    _DefaultAttribute = "data-tooltip";
    _DefaultAttributeHeader = "tooltip-header";
    _DefaultAttributePosition = "tooltip-position";
    _DefaultMarginPX = 10;

    constructor(defClass = this._DefaultClass) {
        this._DefaultClass = defClass;

        this.createTooltipContainer();
        this.createTooltipEvent(this._DefaultAttribute);
    }

    createTooltipContainer() {
        const idTooltip = "tooltip-" + this.randomNumber(1000, 9999);
        const tooltipText = `
            <div class="tooltip-container" id="${idTooltip}">
                <div class="tooltip-container__header"></div>
                <div class="tooltip-container__body"></div>
            </div>
        `;

        const tooltipElement = this.createHtmlElement(tooltipText);
        document.body.appendChild(tooltipElement);

        this._TooltipContainer = document.getElementById(idTooltip);
    }

    createTooltipEvent(attribute) {
        const _Tooltip = this;

        const eventAttribute = "[" + attribute + "]";
        const eventContainers = document.querySelectorAll(eventAttribute);

        eventContainers.forEach(function(elem) {
            elem.addEventListener("mouseenter", () => {
                _Tooltip._TooltipContainer.classList.add("shown");

                const tooltipBody = elem.hasAttribute(attribute) ? elem.getAttribute(attribute) : "";
                const tooltipHeader = elem.hasAttribute(_Tooltip._DefaultAttributeHeader) ? elem.getAttribute(_Tooltip._DefaultAttributeHeader) : "";
                _Tooltip.changeTooltipContent(tooltipHeader, tooltipBody);
                _Tooltip.moveTooltipContainer(elem);

                console.log('mouseenter');
            });

            elem.addEventListener("mouseleave", () => {
                _Tooltip._TooltipContainer.classList.remove("shown");
                console.log('mouseleave');
            });
        });

    }

    changeTooltipContent(header, body) {
        const headerContainer = this._TooltipContainer.querySelector(".tooltip-container__header");
        const bodyContainer = this._TooltipContainer.querySelector(".tooltip-container__body");

        headerContainer.innerHTML = header;
        bodyContainer.innerHTML = body;
    }

    moveTooltipContainer(data) {
        if (this.isNodeElement(data)) {
            const widthTooltip = this._TooltipContainer.offsetWidth;
            const heightTooltip = this._TooltipContainer.offsetHeight;

            const posElement = this.getElementPosition(data);
            const xElement = posElement.left;
            const yElement = posElement.top;

            var dynamicPosition = false;
            var tooltipPosition;
            if (data.hasAttribute(this._DefaultAttributePosition)) {
                if (data.getAttribute(this._DefaultAttributePosition) == null) {
                    tooltipPosition = "bottom";
                    dynamicPosition = true;
                } else tooltipPosition = data.getAttribute(this._DefaultAttributePosition);
            } else {
                tooltipPosition = "bottom";
                dynamicPosition = true;
            }

            const rightPosition = {
                left: xElement + data.offsetWidth + this._DefaultMarginPX,
                top: yElement
            };

            const leftPosition = {
                left: xElement - widthTooltip - this._DefaultMarginPX,
                top: yElement
            };

            const bottomPosition = {
                left: xElement,
                top: yElement + data.offsetHeight + this._DefaultMarginPX,
            };

            const topPosition = {
                left: xElement,
                top: yElement - heightTooltip - this._DefaultMarginPX
            };

            if (dynamicPosition == true) {
                // const dPArray = [
                //     bottomPosition,
                //     topPosition,
                //     rightPosition,
                //     leftPosition
                // ]
                // this.dynamicPositionTooltip(dPArray);
                this._TooltipContainer.style.top = bottomPosition.top + "px";
                this._TooltipContainer.style.left = bottomPosition.left + "px";
            } else if (tooltipPosition == "bottom") {
                this._TooltipContainer.style.top = bottomPosition.top + "px";
                this._TooltipContainer.style.left = bottomPosition.left + "px";
            } else if (tooltipPosition == "top") {
                console.log("top")
                this._TooltipContainer.style.top = topPosition.top + "px";
                this._TooltipContainer.style.left = topPosition.left + "px";
            } else if (tooltipPosition == "right") {
                this._TooltipContainer.style.top = rightPosition.top + "px";
                this._TooltipContainer.style.left = rightPosition.left + "px";
            } else if (tooltipPosition == "left") {
                this._TooltipContainer.style.top = leftPosition.top + "px";
                this._TooltipContainer.style.left = leftPosition.left + "px";
            }
        }
    }

    //dynamicPositionTooltip(array) {}

    isNodeElement(elem) {
        return elem.nodeName ? "true" : "false";
    }

    getElementPosition(elem) {
        var box = elem.getBoundingClientRect();

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return {
            top: top,
            left: left
        };
    }

    createHtmlElement(htmlStr) {
        var frag = document.createDocumentFragment(),
            temp = document.createElement('div');
        temp.innerHTML = htmlStr;
        while (temp.firstChild) {
            frag.appendChild(temp.firstChild);
        }
        return frag;
    }

    randomNumber(minV, maxV) {
        const maxValue = parseInt(minV);
        const minValue = parseInt(maxV);
        return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    }


}