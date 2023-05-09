import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Post from '../partials/Post'
import PostForm from '../partials/PostForm'
import Comments from '../partials/Comments'

export default function PostDetails({ currentUser, setCurrentUser }) {
    const [post, setPost] = useState({})
    const [author, setAuthor] = useState("")
    const [postLoaded, setPostLoaded] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_SERVER_URL}/posts/${id}`)
            .then((response) => {
                const [responsePost, responseAuthor] = response.data
                setPost(responsePost)
                setAuthor(responseAuthor)
                if (post !== {}) {
                    setPostLoaded(true)
                }
            })
            .catch(console.warn)
    }, [])

    const handleSubmit = async (e, form) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('jwt')
            // make the auth headers
            const options = {
                headers: {
                    Authorization: token,
                },
            }
            const response = await axios.put(
                `${process.env.REACT_APP_SERVER_URL}/posts`,
                form,
                options
            )
            // const userPosts = await axios.get(`${process.env.REACT_APP_SERVER_URL}/posts`)
            setPost(response.data)
            setShowForm(false)
        } catch (error) {
            console.log(error)
        }
    }

    // const handleDeleteClick = async () => {
    //     try {
    //         await axios.delete(
    //             `${process.env.REACT_APP_SERVER_URL}/posts/${id}`
    //         )

    //         //navigates home page
    //         navigate('/')
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    const loading = (
        <div>
            <h2>loading post...</h2>
        </div>
    )

    const loaded = (
        <>
            <Row>
                <Col />
                <Col md="auto">
                    <Post
                        post={post}
                        author={author}
                        currentUser={currentUser}
                        setCurrentUser={setCurrentUser}
                        id={id}
                    />
                    {/* need to lock this button to the logged-in user if they are the author of the post */}
                    {true ? 
                    <button onClick={() => setShowForm(true)}>Edit</button>
                    : null}
                    <Comments
                        currentUser={currentUser}
                        id={id}
                        comments={post.comments}
                    />
                </Col>
                <Col />
            </Row>
        </>
    )

    const postView = <>{postLoaded ? loaded : loading}</>

    const formView = (
        <>
            <PostForm
                initialState={post}
                handleSubmit={handleSubmit}
                handleCancel={() => setShowForm(false)}
            />
        </>
    )

    return (
        /* if the user is NOT editing the post, showForm is false:
    return a view that includes the Post component for the post whose ID was passed as a param
    
    if the user IS editing the post, showForm is true: return a view that includes the PostForm
    component and sending it as props the post whose ID was passed as a param */
        <Container className="bg-secondary">
            {showForm ? formView : postView}
        </Container>
    )
}
