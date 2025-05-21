const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


function Modal (options = {}) {
    const {templateId, 
            closeMethod = ["buttonX", "overlay", "escape"], 
            destroyOnClose = true, 
            cssClass = [],
            footer = false,
            onOpen,
            onClose,
        } = options
    
    const template = $(`#${templateId}`)
        if(!template) {
            console.error(`${templateId} not found`);
            return;
        }

    /**
     * Tính và trả về độ rộng của thanh cuộn (scrollbar) trình duyệt.
     * Kết quả được lưu đệm vào thuộc tính `getScrollbarWidth.value` để tái sử dụng,
     * tránh phải tạo phần tử tạm và tính toán lại nhiều lần.
     *
     * @returns {number} Độ rộng của scrollbar (tính bằng pixel).
     */
    function getScrollbarWidth() {
        if (getScrollbarWidth.value) {
            return getScrollbarWidth.value
        }

        const div = document.createElement("div");
        Object.assign(div.style, {
            position: "absolute",
            top: "-9999px",
            overflow: "scroll",
        })

        document.body.appendChild(div);
        const width = div.offsetWidth - div.clientWidth;
        getScrollbarWidth.value = width;
        // remove div after getting scrollbar width
        document.body.removeChild(div);
        return width;
    }

    /**
     * Tạo cấu trúc DOM cho modal (backdrop + container + nội dung + footer nếu có),
     * nhưng chưa bật animation/show.
     */
    this.createModal = function () {
        // cloneNode chỉ copy được nội dung của phần tử, không copy  sự kiện handle của phần tử
        const content = template.content.cloneNode(true)

        this._backdrop = document.createElement("div");
        this._backdrop.className = "modal-backdrop";
        const container = document.createElement("div");
        container.className = "modal-container";
        container.classList.add(...cssClass);
        if(closeMethod.includes("buttonX")) {
            const btnClose = document.createElement("button");
            btnClose.className = "modal-close";
            btnClose.innerHTML = "&times;"
            container.appendChild(btnClose);

            btnClose.onclick = () => this.close()
        }

        const contents = document.createElement("div");
        contents.className = "modal-content";
        
        contents.append(content) // append nội dung của template vào modal-content
        container.appendChild(contents);

        if(footer) {
            this._modalFooter = document.createElement("div");
            this._modalFooter.className = "modal-footer";

            container.append(this._modalFooter);
        }

        this._backdrop.append(container);
        document.body.append(this._backdrop);
    };

    /**
     * Thiết lập nội dung HTML cho phần footer.
     *
     * @param {string} htmlString - Chuỗi HTML muốn chèn vào footer.
     */
    this.setFooterContent = function(htmlString) {
        if(htmlString) {
            this._modalFooter.innerHTML = htmlString;
        }
    };

    /**
     * Thêm một nút vào footer modal với callback khi click.
     *
     * @param {string} text - Văn bản hiển thị trên nút.
     * @param {string[]} [cssArray=[]] - Mảng class CSS gán cho nút.
     * @param {function} callback - Hàm sẽ được gọi khi nút được click.
     */
    this.setFooterButton = function (text, cssArray=[], callback) {
        if (text) {
            const button = document.createElement("button")
            button.innerHTML = text
            button.classList.add(...cssArray)
            button.onclick = (e) => callback(e)
            this._modalFooter.appendChild(button)
        }
    };
    
    /**
     * Mở modal: khởi tạo nếu cần, thêm class `show` để bật animation,
     * đăng ký sự kiện đóng (overlay, escape), vô hiệu hóa cuộn trang.
     *
     * @returns {HTMLElement} Phần tử backdrop của modal.
     */
    this.open = function() {
        if(!this._backdrop) {
            this.createModal();
        }
        setTimeout(() => {
            this._backdrop.classList.add("show");
        },0)

        if(closeMethod.includes("overlay")) {
            this._backdrop.onclick =  (e) =>{
                if(e.target === this._backdrop) {
                    this.close()
                }
            }
        }

        if (closeMethod.includes("escape")) {
            document.addEventListener("keydown",  (e) => {
                if (e.key === "Escape") {
                    this.close()
                }
            })
        }
        
        //Disable scroll
        document.body.classList.add("no-scroll")
        document.body.style.paddingRight = `${getScrollbarWidth()}px`
        
        this._onTransitionEnd(() => {
            if(typeof onOpen === "function") onOpen()
        })

        return this._backdrop
    };

    /**
     * Đăng ký một callback thực thi sau khi animation transition
     * của backdrop kết thúc (ngoại trừ transform).
     *
     * @param {function} callback - Hàm được gọi khi transition kết thúc.
     */
    this._onTransitionEnd = (callback) => {
        this._backdrop.ontransitionend = (e) => {
            if(e.propertyName === "transform") return;
            if(typeof callback === "function") callback();
        }
    };
    
    /**
     * Đóng modal: bỏ class `show`, gọi onClose sau khi transition kết thúc,
     * khôi phục cuộn trang và gỡ backdrop nếu destroy = true.
     *
     * @param {boolean} [destroy=destroyOnClose] - Nếu true sẽ xóa backdrop khỏi DOM.
     */
    this.close = function( destroy = destroyOnClose) {
        this._backdrop.classList.remove("show");
        this._onTransitionEnd(() => {
            if(this._backdrop && destroy) {
                this._backdrop.remove(); 
                this._backdrop = null;
                this._modalFooter = null;
            }
            if(typeof onClose === "function") onClose() 
        })
        
        document.body.classList.remove("no-scroll")
        document.body.style.paddingRight = "0px"
        
        
    };

    /**
     * Đóng và xóa hẳn modal (tương tự close(true)).
     */
    this.destroy = () => {
        this.close(true)
    }
}


// modal 1
const modal1 = new Modal({
        templateId: "modal-1",
        closeMethod: ["overlay", "escape"],
        footer: true, // hiện footer
        cssClass: ["class1", "class2"],
        destroyOnClose: true,
        footer: true,
        onOpen: () => {
            // console.log("Modal 1 opened");
            //logic khi mở modal
        },
        onClose: () => {
            // console.log("Modal 1 closed");
            //logic khi đóng modal
        }
    });

$("#open-modal-1").onclick = function () {
    modal1.open()
    modal1.setFooterButton("MORE",["btn", "btn-more", "pull-Left"], function(e) {
        console.log(e.target.innerText);
        //logic khi click vào button
    }) 
    modal1.setFooterButton("OK",["btn", "btn-ok"], function(e) {
        console.log(e.target.innerText);
        //logic khi click vào button
    })  
    modal1.setFooterButton("CANCEL",["btn", "btn-cancel"], function(e) {
        console.log(e.target.innerText);
        modal1.close()
        //logic khi click vào button
    }) 
}

//modal 2
const modal2 = new Modal({
        templateId: "modal-2",
        cssClass: ["class1", "class2"],
        destroyOnClose: false,
        footer: true}
    );

$("#open-modal-2").onclick = function () {
    modal2.open()
}

//modal 3
const modal3 = new Modal({
        templateId: "modal-3",
        closeMethod: ["escape"]})

$("#open-modal-3").onclick = function () {
    const modalElement = modal3.open() // không cho phép đóng modal khi click vào backdrop
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