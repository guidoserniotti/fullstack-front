import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";

const App = () => {
    const [blogs, setBlogs] = useState([]);

    // ACÁ SE GUARDA EL TOKEN
    const [user, setUser] = useState(null);

    const [objNotification, setObjNotification] = useState({
        type: "",
        text: "",
    });

    // ESTE ESTADO GUARDA LOS DATOS DEL USUARIO PARA EL LOGIN
    const [userData, setUserData] = useState({
        username: "",
        password: "",
    });

    useEffect(() => {
        blogService.getAll().then((blogs) => {
            setBlogs(blogs);
        });
    }, []);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    const handleLoginOnChange = (event) => {
        const { name, value } = event.target;
        setUserData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const user = await loginService.loginUser(userData);
            window.localStorage.setItem("loggedUser", JSON.stringify(user));
            setUser(user);
            blogService.setToken(user.token);
            setObjNotification({
                type: "success",
                text: `${user.username} has logged in.`,
            });
            setUserData({
                username: "",
                password: "",
            });
        } catch (error) {
            setObjNotification({
                type: "error",
                text: error.response.data.error,
            });
        } finally {
            setTimeout(
                () =>
                    setObjNotification({
                        type: "",
                        text: "",
                    }),
                5000
            );
        }
    };

    const handleLogOut = () => {
        setUser(null);
        window.localStorage.removeItem("loggedUser");
        setObjNotification({
            type: "success",
            text: "Logged out successfully",
        });
        setTimeout(
            () =>
                setObjNotification({
                    type: "",
                    text: "",
                }),
            5000
        );
    };

    const createBlog = async (blogObject) => {
        try {
            // COMUNICACIÓN CON EL SERVIDOR
            const returnedBlog = await blogService.create(blogObject);

            // ACTUALIZAR EL ESTADO DE FRONTEND
            setBlogs(blogs.concat(returnedBlog));

            // MANEJO DE NOTIFICACIONES
            setObjNotification({
                type: "success",
                text: `A NEW BLOG: "${blogObject.title} by ${blogObject.author}" has been created.`,
            });
            return returnedBlog;
        } catch (error) {
            setObjNotification({
                type: "error",
                text: error.response.data.error,
            });
        } finally {
            setTimeout(
                () =>
                    setObjNotification({
                        type: "",
                        text: "",
                    }),
                5000
            );
        }
    };

    const deleteBlog = async (id) => {
        const blogToDelete = blogs.find((b) => b.id === id);
        const confirmDelete = window.confirm(
            `Are you sure you want to delete the blog "${blogToDelete.title}" by ${blogToDelete.author}?`
        );
        if (!confirmDelete) return;
        try {
            await blogService.deleteBlog(id);
            const updatedBlogs = blogs.filter((b) => b.id !== id);
            setBlogs(updatedBlogs);
            setObjNotification({
                type: "success",
                text: `"${blogToDelete.title}" de ${blogToDelete.author}... DELETEADO.`,
            });
        } catch (error) {
            console.error("Error al eliminar el blog:", error);
            setObjNotification({
                type: "error",
                text: "Error al eliminar el blog",
            });
        } finally {
            setTimeout(
                () =>
                    setObjNotification({
                        type: "",
                        text: "",
                    }),
                5000
            );
        }
    };

    const handleLikesBlog = async (id) => {
        const blogToLike = blogs.find((b) => b.id === id);
        const updatedBlogData = {
            ...blogToLike,
            likes: blogToLike.likes + 1,
            user: blogToLike.user.id,
        };

        try {
            const likedBlog = await blogService.update(updatedBlogData);
            const updatedBlogs = blogs.map((b) =>
                b.id === likedBlog.id ? likedBlog : b
            );
            setBlogs(updatedBlogs);
        } catch (error) {
            console.error("Error al dar like:", error);
            setObjNotification({
                type: "error",
                text: "Error al actualizar los likes",
            });
            setTimeout(
                () =>
                    setObjNotification({
                        type: "",
                        text: "",
                    }),
                5000
            );
        }
    };

    const blogsOrdenados = (blogs) => {
        const updatedList = [...blogs];
        updatedList.sort((a, b) => {
            if (a.likes !== b.likes) {
                return b.likes - a.likes;
            }
        });
        return updatedList;
    };

    if (user === null) {
        return (
            <div>
                <h2>Log in to application</h2>
                <Notification
                    type={objNotification.type}
                    text={objNotification.text}
                />
                <form onSubmit={handleLogin}>
                    <div>
                        Username
                        <input
                            type="text"
                            data-testid="username"
                            name="username"
                            value={userData.username}
                            onChange={handleLoginOnChange}
                        />
                    </div>
                    <div>
                        <label>Contraseña</label>
                        <input
                            type="password"
                            data-testid="password"
                            name="password"
                            value={userData.password}
                            onChange={handleLoginOnChange}
                        />
                    </div>
                    <button type="submit">Ingresar</button>
                </form>
            </div>
        );
    }

    return (
        <div>
            <h2>blogs</h2>
            <Notification
                type={objNotification.type}
                text={objNotification.text}
            />
            <p>{user.username} logged in</p>
            <button onClick={handleLogOut}>Cerrar Sesión</button>
            <BlogForm createBlog={createBlog} />
            {blogsOrdenados(blogs).map((blog) => (
                <Blog
                    key={blog.id}
                    blog={blog}
                    handleLikes={handleLikesBlog}
                    deleteBlog={deleteBlog}
                />
            ))}
        </div>
    );
};

export default App;
