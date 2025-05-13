const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


function Modal () {
    this.openModal = function (content) {
        const backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop";

        const container = document.createElement("div");
        container.className = "modal-container";

        const btnClose = document.createElement("button");
        btnClose.className = "modal-close";
        btnClose.innerHTML = "&times;"

        const contents = document.createElement("div");
        contents.className = "modal-content";
        
        contents.innerHTML = content;
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

        backdrop.onclick =  (e) =>{
            if (e.target === backdrop) {
                this.closeModal(backdrop);
            }
        }

        document.addEventListener("keydown",  (e) => {
            if (e.key === "Escape") {
                this.closeModal(backdrop);
            }
        })
    };
    this.closeModal = function(element) {
        element.classList.remove("show");
        element.ontransitionend = function () {
            element.remove(); 
        }
    }
}

const modal = new Modal();
// const template1 = $(".modal-1").innerHTML;
const template2 = $(".modal-2").innerHTML;



$("#open-modal-1").onclick = function () {
    modal.openModal(`${$(".modal-1").innerHTML}`);
}
$("#open-modal-2").onclick = function () {
    modal.openModal(`${template2}`);
}
$("#open-modal-3").onclick = function () {
    modal.openModal("<h1>Modal 3: content akfnf container.</h1>")
}