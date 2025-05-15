const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


function Modal () {
    this.openModal = function (options = {}) {
        const {templateId, allowBackdropClose = true} = options
        const template = $(`#${templateId}`)
        if(!template) {
            console.error(`${templateId} not found`);
            return;
        }
        // cloneNode chỉ copy được nội dung của phần tử, không copy  sự kiện handle của phần tử
        const content = template.content.cloneNode(true)

        const backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop";

        const container = document.createElement("div");
        container.className = "modal-container";

        const btnClose = document.createElement("button");
        btnClose.className = "modal-close";
        btnClose.innerHTML = "&times;"

        const contents = document.createElement("div");
        contents.className = "modal-content";
        
        contents.append(content)
        container.append(btnClose, contents);
        backdrop.append(container);
        document.body.append(backdrop);
        setTimeout(function() {
            backdrop.classList.add("show");
        },0)

        //Attach event listeners
        btnClose.onclick = () => {
            this.closeModal(backdrop);
            
        }

        if(allowBackdropClose) {
            backdrop.onclick =  (e) =>{
                if (e.target === backdrop) {
                    this.closeModal(backdrop);
                }
            }
        }

        document.addEventListener("keydown",  (e) => {
            if (e.key === "Escape") {
                this.closeModal(backdrop);
            }
        })

        //Disable scroll
        document.body.classList.add("no-scroll")
        return backdrop;
        // vì return lại backdrop nên có thể sử dụng backdrop ở ngoài, ví dụ sau khi mở modal thì có nhiều sự kiện xảy ra trong modal nữa, như submit form
    };

    this.closeModal = function(element) {
        element.classList.remove("show");
        element.ontransitionend = function () {
            element.remove(); 
        }
        document.body.classList.remove("no-scroll")
    }
    
    
}

const modal = new Modal();

$("#open-modal-1").onclick = function () {
    modal.openModal({
        templateId: "modal-1"})
}
$("#open-modal-2").onclick = function () {
    modal.openModal({templateId: "modal-2"})
}
$("#open-modal-3").onclick = function () {
    const modalElement = modal.openModal({
        templateId: "modal-3",
        allowBackdropClose: false}) // không cho phép đóng modal khi click vào backdrop

    const loginForm = modalElement.querySelector("#login-form")
    if(loginForm) {
        loginForm.onsubmit = function (e) {
        e.preventDefault()
        const name = $(".nameInput")
        console.log(name.value);
    }
    }
}