const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


function showModal(content) {
    const backdrop = document.createElement('div');
    backdrop.className = "modal-backdrop";
    backdrop.innerHTML = `
        <div class="modal-container">
            <button class="modal-close">&times;</button>
            <div class="modal-content">
                ${content}
            </div>
        </div>
    `
    document.body.appendChild(backdrop);
    // hàm setTimeout này sẽ delay 0ms để cho css transition hoạt động
    // nếu không có hàm này thì css transition sẽ không hoạt động
    setTimeout(function() {
        backdrop.classList.add('show');
    },0)

    // Bắt sự kiện click vào nút close để đóng modal
    backdrop.querySelector(".modal-close").onclick = function() {
        closeModal(backdrop);
    }

    // Bắt sự kiện click vào backdrop để đóng modal
    backdrop.onclick = function(e) {
        if(e.target === this) {
            closeModal(backdrop);
        }
    }
    // Bắt sự kiện ESC để đóng modal
    document.onkeydown = function(e) {
        if(e.key === "Escape") {
            closeModal(backdrop);
        }   
    }
}


// Bắt sự kiện click vào từng nút để mở modal, truyền nội dung trực tiếp vào hàm showModal

$(".btn-1").onclick = function() {
    showModal("<h1>Modal 1  : The order property specifies the order of the flex items inside the flex container.</h1>");
}
$(".btn-2").onclick = function() {
    showModal("<h3>Modal 2  : The order propertr.</h3>");
}
$(".btn-3").onclick = function() {
    showModal("<p>Modal 3  :rope order of the flex items inside the flex container.</p>");
}

function closeModal(element) {
    element.classList.remove('show');
    
    // Đợi hiệu ứng kết thúc mới remove
    element.addEventListener('transitionend', () => {
        element.remove();
    }, { once: true }); // `once: true` giúp lắng nghe 1 lần duy nhất
}