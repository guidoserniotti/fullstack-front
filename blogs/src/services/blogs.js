import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;
const setToken = (newToken) => {
    token = `Bearer ${newToken}`;
};

let a = "ajsdja";

const getAll = async () => {
    try {
        const response = await axios.get(baseUrl);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const create = async (blog) => {
    try {
        const config = {
            headers: { Authorization: token },
        };
        const response = await axios.post(baseUrl, blog, config);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const update = async (blog) => {
    try {
        const config = {
            headers: { Authorization: token },
        };
        const response = await axios.put(`${baseUrl}/${blog.id}`, blog, config);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const deleteBlog = async (id) => {
    try {
        const config = {
            headers: { Authorization: token },
        };
        const response = await axios.delete(`${baseUrl}/${id}`, config);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default { getAll, create, update, deleteBlog, setToken };
