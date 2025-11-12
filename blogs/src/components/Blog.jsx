import Togglable from './Togglable';
const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
};

const Blog = ({ blog, handleLikes, deleteBlog }) => {
    return (
        <div className='blog' style={blogStyle}>
            <div className='blog-title'>
                {blog.title} by {blog.author}
            </div>
            <Togglable
                toggleTrueButtonLabel='view'
                toggleFalseButtonLabel='hide'
            >
                <div className='blog-url'>{blog.url}</div>
                <div className='blog-likes'>
                    {blog.likes} likes
                    <button onClick={() => handleLikes(blog.id)}>like</button>
                </div>
                <div className='blog-username'>{blog.user.name}</div>
                <button onClick={() => deleteBlog(blog.id)}>delete</button>
            </Togglable>
        </div>
    );
};

export default Blog;
