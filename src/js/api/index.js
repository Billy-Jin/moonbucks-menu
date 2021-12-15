const BASE_URL = "http://localhost:3000/api";

// fetch('url', option) url: 요청주소 , option : 서버의 데이터만 받을건지? 생산요청인지, 수정요청인지, 삭제 요청인지에 대한 구체적인 약속
// fetch('${BASE_URL}/', option);

const HTTP_METHOD = {
  POST(data) {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // content의 type 을 어떤 형태로 주고 받을건지에 대한 설정, 대부분 json형식으로 주고 받는다고 함
      },
      body: JSON.stringify(data), //body도 json 형식으로 받는다는 것으로 설정 // key와 value가 같다면 하나의 인자로 적어줘도 들어감
    };
  },
  PUT(data) {
    return {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    };
  },
  DELETE() {
    return {
      method: "DELETE",
    };
  },
};

const request = async (url, option) => {
  //await을 쓰려면 async는 필수이다.
  //   console.log(url, option);
  const response = await fetch(url, option);
  if (!response.ok) {
    alert("에러가 발생했습니다.");
    console.error(e);
  }
  return response.json();
};

const requestWithoutJson = async (url, option) => {
  // delete시 json형식이 아니라 에러발생
  const response = await fetch(url, option);
  if (!response.ok) {
    alert("에러가 발생했습니다.");
    console.error(e);
  }
  return response;
};

const MenuApi = {
  getAllMenuByCategory(category) {
    return request(`${BASE_URL}/category/${category}/menu`);
  },
  createMenu(category, name) {
    return request(
      `${BASE_URL}/category/${category}/menu`,
      HTTP_METHOD.POST({ name })
    );
  },
  async updateMenu(category, name, menuId) {
    return request(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      HTTP_METHOD.PUT({ name })
    );
  },
  async toggleSoldOutmenu(category, menuId) {
    return request(
      `${BASE_URL}/category/${category}/menu/${menuId}/soldout`,
      HTTP_METHOD.PUT()
    );
  },
  async deleteMenu(category, menuId) {
    return requestWithoutJson(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      HTTP_METHOD.DELETE()
    );
  },
};

export default MenuApi;
