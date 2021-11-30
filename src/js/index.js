
//step2 요구사항 분석
// TODO localStorage Read & Write 
// - [x] localStorage에 데이터를 저장한다.
// localStorage.setItem("menu", "espresso") // key와 value로 하여 로컬스토리지에 저장가능
// localStorage.getItem("menu") //불러올때는 get을 이용
// - [x] 메뉴를 추가할 때 저장
// - [x] 메뉴를 수정할 때 저장 
// - [x] 메뉴를 삭제할 때 저장 
// - [x] localStorage에 있는 데이터를 읽어온다.

// TODO 카테고리별 메뉴판 관리
// - [] 에스프레소 메뉴판 관리
// - [] 프라푸치노 메뉴판 관리
// - [] 블렌디드 메뉴판 관리
// - [] 티바나 메뉴판 관리
// - [] 디저트 메뉴판 관리

// TODO 페이지 접근시 최초 데이터 Read & Rendering
// - [] 페이지에 최초로 로딩될때 localStorage에 에스프레소 메뉴를 읽어온다.
// - [] 에스프레소 메뉴를 페이지에 그려준다.

// TODO 품절 상태 관리
// - [] 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 sold-out class를 추가하여 상태를 변경한다.
// - [] 품절 버튼을 추가한다.
// - [] 품절 버튼을 클릭하면 lcalStorage에 상태값이 저장된다.
// - [] 클릭이벤트에서 가장 가까운 li태그의 class속성 값에 sold-out을 추가한다.

const $ = (selector) => document.querySelector(selector); 

const store = {
    setLocalStorage(menu) {
        localStorage.setItem("menu", JSON.stringify(menu));
        //JSON 형식을 문자형으로 바꿔줌
    },
    getLocalStorage() {
        return JSON.parse(localStorage.getItem("menu")); 
        //리턴을 안해주면 다른곳에서 값을 못찾을수 있음
        //문자로 저장한 객체를 다시 JSON 형태로 바꿔줌
    }
};

function App(){
    // 상태는 변하는 데이터이다. 이 앱에서 변하는 것이 무엇인가 - 메뉴명
    this.menu = []; // menu 상태값 초기화 //초기화를 하여야 어떤 값이 들어올지 알수 있고, push도 사용 가능하다
    this.init = () => {
        if(store.getLocalStorage().length > 0){
            this.menu = store.getLocalStorage();
        }
        render();
    };

    const render = () => {
        const template = this.menu.map((menuItem, index )=> { //item -> menu의 원소 item으로 해도 되고 menuItem으로 해도 됨
            return `
            <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
                <span class="w-100 pl-2 menu-name">${menuItem.name}</span>
                <button
                type="button"
                    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
                >    
                수정
                </button>
                <button
                    type="button"
                    class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
                >    
                    삭제
                </button>    
            </li>`;  
        }).join(""); // 문자열을 하나로 합쳐줌 
        // [`<li>~</li>,<li>~</li>,`]  //메뉴의 갯수대로 만들어줌
        $("#espresso-menu-list").innerHTML = template;         
        updateMenuCount();
    }
    const updateMenuCount = () =>{ 
        const menuCount =  $("#espresso-menu-list").querySelectorAll("li").length  
        $(".menu-count").innerText = `총 ${menuCount}개`;
    }
    
    const addMenuName = () => {
        if ($('#espresso-menu-name').value === ""){
            alert("값을 입력해주세요.");
            return; 
        }        
    
        const espressoMenuName = $('#espresso-menu-name').value;
        this.menu.push({ name : espressoMenuName }); //객체로 menu에 값을 넣어줌
        store.setLocalStorage(this.menu);
        render();
        $('#espresso-menu-name').value = "";        
    };    
    
    const updateMenuName = (e) =>{ 
        const menuId = e.target.closest("li").dataset.menuId;
        const $menuName = e.target.closest("li").querySelector(".menu-name");
        const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
        if(updatedMenuName){ 
            this.menu[menuId].name = updatedMenuName;
            store.setLocalStorage(this.menu);
            $menuName.innerText = updatedMenuName;
        }
    };

    const removeMenuName = (e) =>{
        if(confirm("정말 삭제하시겠습니까?")){
            const menuId = e.target.closest("li").dataset.menuId;
            this.menu.splice(menuId, 1); // splice 몇번째 인덱스부더 , 몇개를 삭제할지 설정
            store.setLocalStorage(this.menu);
            e.target.closest("li").remove();
            updateMenuCount();
        }; 
    }

    $("#espresso-menu-list").addEventListener("click", (e) => {
        if(e.target.classList.contains("menu-edit-button")){
            updateMenuName(e);
        };
        if (e.target.classList.contains("menu-remove-button")){
            removeMenuName(e);
        };
    });    
        
    $("#espresso-menu-form").addEventListener("submit", (e) => {
            e.preventDefault(); 
        });    
    
    $("#espresso-menu-submit-button").addEventListener("click", addMenuName);  

    $('#espresso-menu-name').addEventListener("keypress", (e) => { 
        if(e.key !== "Enter"){
            return;
        };    
        addMenuName();
    });     

}

const app = new App();
// 함수 선언만 하면 해당 함수 하나면 있게 되는데,
// 인스턴스 변수 = new 함수()를 하게 되면 함수를 모델로, 
// 새로운객체가 여러개 만들어지고 각각의 상태를 가지게됨
app.init();











