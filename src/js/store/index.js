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

export default store; // 파일자체를 export하기 위해 사용