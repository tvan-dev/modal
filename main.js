const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
let currentModal = null;
$$(".btn").forEach(function(btn) {
    btn.onclick = function() {
        const modal = $(this.dataset.modal)
        if(modal) {
            modal.classList.add("show")
            currentModal = modal
        }
    }
})

$$(".modal-close").forEach(function(btnClose) {
    btnClose.onclick = function() {
        const modal = this.closest(".modal-backdrop")
        if(modal) {
            modal.classList.remove("show");
            currentModal = null;
        }
    }
})
// chú ý: this chính là phần tử gắn sự kiện / còn e,target là phần tử phát ra sự kiện/ tùy vào trường hợp mà this === e.target những có lúc không
$$(".modal-backdrop").forEach(function(backdrop) {
    backdrop.onclick = function(e) {
        if(e.target === backdrop) {
            e.target.classList.remove("show")
            currentModal = null
        }
    }
})

document.addEventListener("keydown",function(e) {
    if(e.key === "Escape" && currentModal) {
        currentModal.classList.remove("show")
        currentModal = null
    }
})



