import { useRef, useState } from "react";
import Togglable from "./Togglable";

const BlogForm = ({ createBlog }) => {
    const togglableRef = useRef();

    const [newBlogData, setNewBlogData] = useState({
        title: "",
        author: "",
        url: "",
    });

    const handleNewBlogOnChange = (event) => {
        const { name, value } = event.target;
        setNewBlogData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmitBlog = async (event) => {
        event.preventDefault();
        await createBlog(newBlogData);
        togglableRef.current.toggleVisibility();
        setNewBlogData({
            title: "",
            author: "",
            url: "",
        });
    };

    return (
        <Togglable
            toggleTrueButtonLabel="Create Blog"
            toggleFalseButtonLabel="Cancel"
            ref={togglableRef}
        >
            <form onSubmit={handleSubmitBlog}>
                <label>title</label>
                <input
                    className="blogform-title-input"
                    data-testid="title"
                    type="text"
                    name="title"
                    value={newBlogData.title}
                    onChange={handleNewBlogOnChange}
                />
                <label>author</label>
                <input
                    className="blogform-author-input"
                    data-testid="author"
                    type="text"
                    name="author"
                    value={newBlogData.author}
                    onChange={handleNewBlogOnChange}
                />
                <label>url</label>
                <input
                    className="blogform-url-input"
                    data-testid="url"
                    type="text"
                    name="url"
                    value={newBlogData.url}
                    onChange={handleNewBlogOnChange}
                />
                <button type="submit">Crear</button>
            </form>
        </Togglable>
    );
};

export default BlogForm;
