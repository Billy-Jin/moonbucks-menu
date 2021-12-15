// 회고
// - '상태값'의 중요성
// - 스텝1하고 스텝2하는데 상태 값을 사용해서 사용자 관점에서 페이지 렌더링 될 때 어떻게 되는지 처음 제대로 사용해 봄
// - menu[키값] 으로 객체 키 밸류 사용 하는 것이 인상 깊었음
// - this는 일반적으로 객체 자신을 가리킨다.(인스턴스가 여러개 일때 자신을 가리키기에, 외부에서 불러올때 유용하다. 단, 맥락에 따라서 가리키는게 다를순 있다)

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
// - [x] 에스프레소 메뉴판 관리
// - [x] 프라푸치노 메뉴판 관리
// - [x] 블렌디드 메뉴판 관리
// - [x] 티바나 메뉴판 관리
// - [x] 디저트 메뉴판 관리

// TODO 페이지 접근시 최초 데이터 Read & Rendering
// - [x] 페이지에 최초로 로딩될때 localStorage에 에스프레소 메뉴를 읽어온다.
// - [x] 에스프레소 메뉴를 페이지에 그려준다.

// TODO 품절 상태 관리
// - [x] 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 sold-out class를 추가하여 상태를 변경한다.
// - [x] 품절 버튼을 추가한다.
// - [x] 품절 버튼을 클릭하면 lcalStorage에 상태값이 저장된다.
// - [x] 클릭이벤트에서 가장 가까운 li태그의 class속성 값에 sold-out을 추가한다.
import { $ } from "./utils/dom.js";
import store from "./store/index.js";

function App() {
  // 상태는 변하는 데이터이다. 이 앱에서 변하는 것이 무엇인가 - 메뉴명
  this.menu = {
    // menu 상태값 초기화 //초기화를 하여야 어떤 값이 들어올지 알수 있고, push도 사용 가능하다
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.init = () => {
    if (store.getLocalStorage()) {
      //&& store.getLocalStorage().length > 0 같은 의미라 삭제
      this.menu = store.getLocalStorage();
    }
    render();
    initEventListeners();
  };
  this.currentCategory = "espresso";
  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((menuItem, index) => {
        //item -> menu의 원소 item으로 해도 되고 menuItem으로 해도 됨
        return `
            <li data-menu-id="${index}" class= "menu-list-item d-flex items-center py-2">
                <span class="${
                  menuItem.soldOut ? "sold-out" : ""
                } w-100 pl-2 menu-name">${menuItem.name}</span>
                <button
                type="button"
                    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
                >    
                품절
                </button>
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
      })
      .join(""); // 문자열을 하나로 합쳐줌
    // [`<li>~</li>,<li>~</li>,`]  //메뉴의 갯수대로 만들어줌
    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };
  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addMenuName = () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요.");
      return;
    }

    const menuName = $("#menu-name").value;
    this.menu[this.currentCategory].push({ name: menuName }); //객체로 menu에 값을 넣어줌
    store.setLocalStorage(this.menu);
    render();
    $("#menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    if (updatedMenuName) {
      // 취소 눌러서 진행 undefined 값이 진행되어, if문으로 해당 부분 막음
      this.menu[this.currentCategory][menuId].name = updatedMenuName;
      store.setLocalStorage(this.menu);
      render();
    }
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1); // splice 몇번째 인덱스부더 , 몇개를 삭제할지 설정
      store.setLocalStorage(this.menu);
      render();
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut; // 토글키 처럼 현재 상태의 반대 상태로 만들때 사용 초기값은 undefind로 반대값을 넣으면 true가 되고, 이후 부터는 false <-> true 번갈아가면서 나옴
    store.setLocalStorage(this.menu);
    render();
  };

  const initEventListeners = () => {
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        //클릭한게 어떤 버튼인지?
        updateMenuName(e);
        return; // if문이 여러개 일때는 불필요한 연산을 줄이기 위해 if문 안에 return을 안에 넣어주면 좋다.
      }
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-submit-button").addEventListener("click", addMenuName);

    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    });

    $("nav").addEventListener("click", (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        // 메뉴 사이 공간 값 클릭시 작동안하도록 예외처리
        const CategoryName = e.target.dataset.categoryName;
        this.currentCategory = CategoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴관리`;
        render();
      }
    });
  };
}

const app = new App();
// 함수 선언만 하면 해당 함수 하나면 있게 되는데,
// 인스턴스 변수 = new 함수()를 하게 되면 함수를 모델로,
// 새로운객체가 여러개 만들어지고 각각의 상태를 가지게됨
app.init();
