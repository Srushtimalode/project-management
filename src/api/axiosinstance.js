import axios from "axios";

const axiosinstance = axios.create({
    baseURL:"https://674e84f1635bad45618eebc1.mockapi.io/api/v1",
    headers:{
        "Content-Type":"application/json"
    }
})
export default axiosinstance