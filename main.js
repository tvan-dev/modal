const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Popzy.elements = []

function Popzy (options = {}) {
    this.opt = Object.assign({ 
            closeMethod : ["buttonX", "overlay", "escape"], 
            destroyOnClose : true, 
            cssClass : [],
            footer : false,
        },options);
    
    this.template = $(`#${this.opt.templateId}`);

    if(!this.template) {
        console.error(`${this.opt.templateId} not found`);
        return;
    }
    this._handleEscapeKey = this._handleEscapeKey.bind(this);

}

Popzy.prototype.getScrollbarWidth = function() {
        if(this._srollbarWidth) return this._srollbarWidth
        const div = document.createElement("div");
        Object.assign(div.style, {
            position: "absolute",
            top: "-9999px",
            overflow: "scroll",
        })

        document.body.appendChild(div);
        this._srollbarWidth = div.offsetWidth - div.clientWidth;
        // remove div after getting scrollbar width
        document.body.removeChild(div);
        return this._srollbarWidth;
}
Popzy.prototype.createModal = function () {
        // cloneNode chỉ copy được nội dung của phần tử, không copy  sự kiện handle của phần tử
        const content = this.template.content.cloneNode(true)

        this._backdrop = document.createElement("div");
        this._backdrop.className = "popzy__backdrop";
        const container = document.createElement("div");
        container.className = "popzy__container";
        container.classList.add(...this.opt.cssClass);

        if(this.opt.closeMethod.includes("buttonX")) {
            const btnClose = this._createButton("&times;", ['popzy__close'], () => this.close())
            container.appendChild(btnClose);
        }

        const contents = document.createElement("div");
        contents.className = "popzy__content";
        
        contents.append(content) // append nội dung của template vào modal-content
        container.appendChild(contents);

        if(this.opt.footer) {
            this._modalFooter = document.createElement("div");
            this._modalFooter.className = "popzy__footer";

            container.append(this._modalFooter);
        }

        this._backdrop.append(container);
        document.body.append(this._backdrop);
};

Popzy.prototype.setFooterContent = function(htmlString) {
    if(htmlString) {
        this._modalFooter.innerHTML = htmlString;
    }
};

Popzy.prototype.setFooterButton = function (text, cssArray=[], callback) {
    const button = this._createButton(text, cssArray, callback)
    this._modalFooter.appendChild(button)
    
};

Popzy.prototype._handleEscapeKey = function (e) {
    const lastModal = Popzy.elements[Popzy.elements.length -1]
    if(e.key === "Escape" && lastModal === this) {
        this.close()
    }
}

Popzy.prototype._onTransitionEnd = function (callback) {
    this._backdrop.ontransitionend = (e) => {
        if(e.propertyName === "transform") return;
        if(typeof callback === "function") callback();
    }
};

Popzy.prototype._createButton = function(text, cssArray=[], callback)  {
    if (text) {
        const button = document.createElement("button")
        button.innerHTML = text
        button.classList.add(...cssArray)
        button.onclick = callback
        return button
    }
}

Popzy.prototype.open = function() {
    Popzy.elements.push(this)
    if(!this._backdrop) {
        this.createModal();
    }
    setTimeout(() => {
        this._backdrop.classList.add("popzy--show");
    },0)

    if(this.opt.closeMethod.includes("overlay")) {
        this._backdrop.onclick =  (e) =>{
            if(e.target === this._backdrop) {
                this.close()
            }
        }
    }

    if (this.opt.closeMethod.includes("escape")) {
        document.addEventListener("keydown", this._handleEscapeKey)
    }
    
    //Disable scroll
    document.body.classList.add("no-scroll")
    document.body.style.paddingRight = this.getScrollbarWidth() + "px"
    
    this._onTransitionEnd(this.opt.onOpen)

    return this._backdrop
};

Popzy.prototype.close = function(destroy = this.opt.destroyOnClose) {
    Popzy.elements.pop()
    if (this.opt.closeMethod.includes("escape")) {
        document.removeEventListener("keydown", this._handleEscapeKey)
    }
    this._backdrop.classList.remove("popzy--show");
    this._onTransitionEnd(() => {
        if(this._backdrop && destroy) {
            this._backdrop.remove(); 
            this._backdrop = null;
            this._modalFooter = null;
        }
        if(typeof this.opt.onClose === "function") this.opt.onClose() 
    })
    
    if(Popzy.elements.length === 0) {
        document.body.classList.remove("no-scroll")
        document.body.style.paddingRight = "0px"
    }
    
    
};

Popzy.prototype.destroy = function() {
    this.close(true)
}
// popzy-1
const popzy1 = new Popzy({
        templateId: "popzy-1",
        closeMethod: ["overlay", "escape"],
        footer: true, // hiện footer
        cssClass: ["class1", "class2"],
        destroyOnClose: true,
        footer: true,
        onOpen: () => {
            console.log("popzy-1 opened");
            //logic khi mở modal
        },
        onClose: () => {
            // console.log("popzy-1 closed");
            //logic khi đóng modal
        }
    });

$("#open-popzy-1").onclick = function (e) {
    e.currentTarget.blur();  
    popzy1.open()

    popzy1.setFooterButton("MORE",["btn", "btn-more", "pull-Left"], function(e) {
        console.log(e.target.innerText);
        //logic khi click vào button
    }) 
    popzy1.setFooterButton("OK",["btn", "btn-ok"], function(e) {
        console.log(e.target.innerText);
        //logic khi click vào button
    })  
    popzy1.setFooterButton("CANCEL",["btn", "btn-cancel"], function(e) {
        console.log(e.target.innerText);
        popzy1.close()
        //logic khi click vào button
    }) 
}

//popzy 2
const popzy2 = new Popzy({
        templateId: "popzy-2",
        cssClass: ["class1", "class2"],
        destroyOnClose: true,
        footer: true}
    );

$("#open-popzy-2").onclick = function () {
    popzy2.open()
}

//popzy 3
const popzy3 = new Popzy({
        templateId: "popzy-3",
        closeMethod: ["escape"]})

$("#open-popzy-3").onclick = function () {
    const modalElement = popzy3.open() // không cho phép đóng modal khi click vào backdrop
    const loginForm = modalElement.querySelector("#login-form")
    if(loginForm) {
        loginForm.onsubmit = function (e) {
        e.preventDefault()
        const nameInput = $(".nameInput")
        const submitModal = $(".submit-modal")
        submitModal.onclick = () => {
            console.log(nameInput.value);
        }
    }
    }
}