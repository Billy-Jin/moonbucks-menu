import { $ } from "./utils/dom.js";
import store from "./store/index.js";
import MenuApi from "./api/index.js";

// - [] 링크에 있는 웹 서버 저장소를 clone하여 로컬에서 웹 서버를 실행시킨다.
// 커뮤니케이션을 잘하도록 나눠서 하나하나 작성해야한다.

// TODO 서버 요청 부분
// - [x] 웹 서버를 띄운다.
// - [x] 서버에 새로운 메뉴명을 추가 될 수 있도록 요청한다.
// - [x] 서버에 카테고리별 메뉴리스트를 불러온다.
// - [x] 서버에 메뉴가 수정 될 수 있도록 요청한다
// - [x] 서버에 품질상태가 토글 될 수 있도록 요청한다.
// - [x] 서버에 메뉴가 삭제 될 수 있도록 요청한다.

// TODO 리펙토링 부분
// - [x] localStorage에 저장하는 로직은 지운다.
// - [x] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

// TODO 사용자 경험
// - [x] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
// - [x] 중복되는 메뉴는 추가할 수 없다.

// 오늘의 회고 , 내가 혼자 짤 때의 전략 --뭉뚱하게 생각하지말고 세부적으로 전략 짜야 해야 한다. 또한 순차적으로 전략을 짜고 얼마나 걸릴지도 생각해야한다.
// 서버와 따로 분리하여 진행
// async await 으로 순차적으로 처리할 수 있다는 것을 알았음
// 1. 웹서버 연동
// 2. BASE_URL 변수명 먼저 선언
// 3. 비동기 처리하는데 해당하는 부분이 어디인지 확인하고, 웹서버에 요청하게끔 코드 짜기
// 4. 서버에 요청한 후 데이터를 받아서 화면에 렌더링 하기
// 5. 리팩터링
// - localStorage 부분 지우기
// - API 파일 따로 만들어서 진행
// - 페이지 렌더링과 관련하여 중복되는 부분들 제거
// - 서버요청 할 때 option 객체
// - 카테고리 버튼 클릭 시 콜백함수 분리
// 6. 사용자 경험 부분

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

  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    ); // promise(카페 진동벨의 순서) 때문에 순서 구분을 위해 await을 매번 써줘야 한다.
    render();
    initEventListeners();
  };
  this.currentCategory = "espresso";
  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    const template = this.menu[this.currentCategory]
      .map((menuItem) => {
        //index삭제
        //item -> menu의 원소 item으로 해도 되고 menuItem으로 해도 됨
        return `
            <li data-menu-id="${
              menuItem.id
            }" class= "menu-list-item d-flex items-center py-2">
                <span class="${
                  menuItem.isSoldOut ? "sold-out" : ""
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

  const addMenuName = async () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요.");
      return;
    }

    const duplicatedItem = this.menu[this.currentCategory].find(
      (menuItem) => menuItem.name === $("#menu-name").value
    );
    console.log(duplicatedItem);
    if (duplicatedItem) {
      alert("이미 등록된 메뉴입니다. 다시 입력해주세요.");
      $("#menu-name").value = "";
      return;
    }

    const menuName = $("#menu-name").value;
    await MenuApi.createMenu(this.currentCategory, menuName);
    render();
    $("#menu-name").value = "";
  };

  const updateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    if (updatedMenuName) {
      render();
    }
  };

  const removeMenuName = async (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);

      render();
    }
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutmenu(this.currentCategory, menuId);

    render();
  };

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      // 메뉴 사이 공간 값 클릭시 작동안하도록 예외처리
      const CategoryName = e.target.dataset.categoryName;
      this.currentCategory = CategoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴관리`;
      render();
    }
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

    $("nav").addEventListener("click", changeCategory);
  };
}

const app = new App();
// 함수 선언만 하면 해당 함수 하나면 있게 되는데,
// 인스턴스 변수 = new 함수()를 하게 되면 함수를 모델로,
// 새로운객체가 여러개 만들어지고 각각의 상태를 가지게됨
app.init();
