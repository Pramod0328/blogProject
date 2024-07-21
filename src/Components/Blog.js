import { useState, useRef, useEffect, useReducer } from "react";

// Reducer function to manage the blogs state
function blogReducer(state, action) {
    switch (action.type) {
        case 'ADD_BLOG':
            return [{ title: action.payload.title, content: action.payload.content }, ...state];
        case 'REMOVE_BLOG':
            return state.filter((_, index) => index !== action.payload);
        case 'UPDATE_BLOG':
            return state.map((blog, index) =>
                index === action.payload.index
                    ? { title: action.payload.title, content: action.payload.content }
                    : blog
            );
        default:
            return state;
    }
}

export default function Blog() {
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [blogs, dispatch] = useReducer(blogReducer, []);
    const [editIndex, setEditIndex] = useState(null);

    const titleRef = useRef(null);

    useEffect(() => {
        titleRef.current.focus();
    }, []);

    useEffect(() => {
        if (blogs.length && blogs[0].title) {
            document.title = blogs[0].title;
        } else {
            document.title = "No blogs!";
        }
    }, [blogs]);

    function handleSubmit(e) {
        e.preventDefault();
        if (editIndex !== null) {
            dispatch({ type: 'UPDATE_BLOG', payload: { index: editIndex, title: formData.title, content: formData.content } });
            setEditIndex(null);
        } else {
            dispatch({ type: 'ADD_BLOG', payload: { title: formData.title, content: formData.content } });
        }
        setFormData({ title: "", content: "" });
        titleRef.current.focus();
    }

    function removeBlog(index) {
        dispatch({ type: 'REMOVE_BLOG', payload: index });
    }

    function editBlog(index) {
        setEditIndex(index);
        setFormData(blogs[index]);
        titleRef.current.focus();
    }

    return (
        <>
            <h1>Write a Blog!</h1>
            <div className="section">
                <form onSubmit={handleSubmit}>
                    <Row label="Title">
                        <input
                            className="input"
                            placeholder="Enter the Title of the Blog here.."
                            value={formData.title}
                            ref={titleRef}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </Row>

                    <Row label="Content">
                        <textarea
                            className="input content"
                            placeholder="Content of the Blog goes here.."
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </Row>

                    <button className="btn">{editIndex !== null ? "Update" : "Add"}</button>
                </form>
            </div>

            <hr />

            <h2>Blogs</h2>
            {blogs.map((blog, index) => (
                <div className="blog" key={index}>
                    <h3>{blog.title}</h3>
                    <hr />
                    <p>{blog.content}</p>
                    <div className="blog-btn">
                        <button onClick={() => editBlog(index)} className="btn edit">
                            Edit
                        </button>
                        <button onClick={() => removeBlog(index)} className="btn remove">
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </>
    );
}

function Row(props) {
    const { label } = props;
    return (
        <>
            <label>{label}<br /></label>
            {props.children}
            <hr />
        </>
    );
}
