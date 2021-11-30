// 오늘 얻은 인사이트
// 1. 이벤트 위임을 어떻게 할 수 있는지 알게 되서 좋았다.
// 2. 요구사항을 전략적으로 접근해야 하는지, 단계별로 세세하게 나누는게 중요하다는걸 알게 되었다.
// 3. DOM 요소를 가져올때는 $표시를 써서 변수처럼 사용할 수 있는게 좋았다.
// 4. 새롭게 알게된 메서드 innerText, innerHTML, insertAdjacentHtml, closest, e.target 

// (e)의 e가 이벤트를 의미한다는 것을 알게 되었다.
// 중복 코드 정리
// document.getElementById만 알았는데 queryselector로도 찾을수 있는것 


// step1 요구사항 구현을 위한 전략(요구사항의 순서 부터 정리해야한다)
// TODO 메뉴추가
// - [x] 메뉴의 이름을 입력 받고 엔터키 입력으로 추가한다.
// - [x] 메뉴의 이름을 입력 받고 확인 버튼을 클릭하면 메뉴를 추가한다.
// - [x] 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.


const $ = (selector) => document.querySelector(selector); 
// 중복되는 부분을 줄이기위해 jquery처럼 $로 사용하도록 명시 
// ex) ocument.querySelector("#espresso-menu-form") -> $("#espresso-menu-form")

function App(){
    // TODO 메뉴 수정
    // - [x] 메뉴의 수정 버튼클릭 이벤트를 받고, 메뉴수정 모델창('prompt')이 뜬다.
    // - [x] 모델창에서 신규메뉴명을 입력 받고, 확인버튼을 누르면 메뉴가 수정된다.

    // TODO 메뉴 삭제
    // - [x] 메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴삭제 모델창('confirm')이 뜬다
    // - [x] 확인 버튼을 클릭하면 메뉴가 삭제된다.
    // - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
    
    const updateMenuCount = () =>{ //보통 함수는 동사를 앞에 넣어줌
        //li 갯수 카운팅해서 갯수 넣기
        const menuCount =  $("#espresso-menu-list").querySelectorAll("li").length  
        $(".menu-count").innerText = `총 ${menuCount}개`;
    }


    const updateMenuName = (e) =>{ //알아보기 쉽도록 이런식으로 이름을 붙여줌
        const $menuName = e.target.closest("li").querySelector(".menu-name");
        // element자체를 넣을때는 $변수명 
        // closest 근처의 원하는 element 로 이동한뒤, 메뉴이름으로 이동하여 해당 값을 가져옴
        const updatedMenuName = prompt(
            "메뉴명을 수정하세요", 
            $menuName.innerText
        );
        if(updatedMenuName){ //prompt에서 취소를 누르면 공백값이 들어가 if문 안에 넣어줌
            $menuName.innerText = updatedMenuName;
        }
        // 역으로 수정한 이름을 innerText에 넣어줌
    };

    const removeMenuName = (e) =>{
        if(confirm("정말 삭제하시겠습니까?")){
            // 확인버튼을 누르면 true 리턴, 취소버튼을 누르면 false 리턴이 되기에 if문으로 동작되도록 한다.
            e.target.closest("li").remove();
            //remove() 하면 삭제됨 
            updateMenuCount();
        }; 
    }

    // 현재 메인화면에 수정 버튼이 없기 때문에 espresso-menu-list에 이벤트를 위임해 놓고,
    // 수정 버튼 클릭시 작동하도록 설정
    $("#espresso-menu-list").addEventListener("click", (e) => {
        // TODO 메뉴 수정
        // console.log(e.target); 
        if(e.target.classList.contains("menu-edit-button")){
            // e.target 현재 클릭 버튼이 어떤것인지 확인 
            // classList 클래스 목록을 가져온다. // contains 목록에 원하는 이름이 있는지 확인
            updateMenuName(e);
        };
        //TODO 메뉴 삭제
        if (e.target.classList.contains("menu-remove-button")){
            removeMenuName(e);
        };
    });    
    

    //--TODO메뉴추가-----------------------------------------------------------    
    
    // form태그가 자동으로 전송되는걸 막아준다.
    $("#espresso-menu-form").addEventListener("submit", (e) => {
            e.preventDefault(); //방지하는것
        });    
    
    // 동일한 변수 사용 하는 것들끼리 묶어 줘야 하여 updateMenuCount 밑에 두어야 하지만
    // 메뉴추가 부분 끼리 묶어두기 위해 이 자리에 놔둠
    const addMenuName = () => {
        if ($('#espresso-menu-name').value === ""){
            alert("값을 입력해주세요.");
            return; //return 넣으면 하단 if문 실행안되고 종료
        }        

        const espressoMenuName = $('#espresso-menu-name').value;
        const menuItemTemplate = (espressoMenuName) => {
            return `
            <li class="menu-list-item d-flex items-center py-2">
                <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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
        };    
        $("#espresso-menu-list").insertAdjacentHTML(
            "beforeend", 
            menuItemTemplate(espressoMenuName)
        );    

        // Html 코드를 저장할때는 innerHTML을 사용한다.(다만 새로운 글 쓰면 덮어 씌우기 때문에)
        // 계속 추가 하려면 insertAdjacentHTML을 사용해야한다.
        //element.insertAdjacentHTML(position, text);  덮어씌우는게 아니라 원하는 위치에 글이 쓰이도록 할수 있다.
        // <!-- beforebegin -->
        // <p>
        // <!-- afterbegin -->
        // foo
        // <!-- beforeend -->
        // </p>
        // <!-- afterend -->
        
        updateMenuCount();
        $('#espresso-menu-name').value = "";
        
    }    
        


    $("#espresso-menu-submit-button").addEventListener("click", addMenuName);  
    // () => { addMenuName();} -> addMenuName  이벤트를 사용하지 않으면 함수보다는 그냥 변수를 사용하는것이 깔끔하다. 

    // 메뉴의 이름을 입력 받기 //querySelector(아이디) 해당 아이디 찾기  //addEventListener(이벤트 받는 형태) 이벤트 받기
    $('#espresso-menu-name').addEventListener("keypress", (e) => { //엔터시 #espresso-menu-name 값은 리셋되도록 추가 
        if(e.key !== "Enter"){
            return;
        };    
        addMenuName();
    }); //e는 event의 약자    



}

App(); //함수 실행












