import React, {Component} from 'react';
import {isAuthenticated} from '../auth';
import {create} from './apiPost';
import {Redirect} from 'react-router-dom';
// import DefaultProfile from '../images/avatar.jpg';
    
    
class NewPost extends Component {
    constructor() {
        super();
        this.state = {
            // title: '', 
            body: '',
            // photo: '',
            error: '',
            user: {}, 
            // fileSize: 0,
            loading: false,
            redirectToProfile: false
        };
    }

    componentDidMount() {
        this.postData = new FormData();
        this.setState({user: isAuthenticated().user})
    }

    isValid = () => {
        // const {title, body, fileSize} = this.state;

        const {body, fileSize} = this.state;
        if (fileSize>100000) {
            this.setState({
                error: 'File size should be less than 100kb',
                loading: false
            });
            return false;
        }
        // if (title.length === 0 || body.length === 0) {
        if (body.length === 0) {
            this.setState({error: 'All fields are required', loading: false});
            return false;
        }
        return true;
    };

    handleChange = name => event => {
        this.setState({error: ''});
        const value = 
            name === 'photo' ? 
            event.target.files[0] : 
            event.target.value;

        const fileSize = 
            name === 'photo' ? 
            event.target.files[0].size : 
            0;
            
        this.postData.set(name, value);

        console.log(this.postData.get("body"));

        this.setState({ [name]: value });

    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true});

        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;


            create(userId, token, this.postData) 
            // console.log(this.state.body);
            // console.log(this.state.body.stringify)
            .then(data => {
                console.log(data);
                if (data.error) this.setState({ error: data.error});
                else {
                    console.log('New Post: ', data);
                    this.setState({ 
                        loading: false,
                        // title: '',
                        body: '',
                        // photo: '',
                        redirectToProfile: true
                    })};
            });
        }
    };



            // .then(data => {
            //     console.log('New Post: ', data);
            // })
            // .catch(data.error) this.setState({ error: data.error})
            // });
                           
    //     }
    // };
    // newPostForm = (title, body) => (

    newPostForm = (body) => (
        <form>
                
            {/* <div className='form-group'>
                <label className='text-muted'>Photo Post</label>
                <input
                    onChange= {this.handleChange('photo')}
                    type='file'
                    accept='image/*'
                    className='form-control'
                />
            </div> */}

            {/* <div className='form-group'>
                <label className='text-muted'>Title</label>
                <input
                    onChange={this.handleChange('title')}
                    type='text'
                    className='form-control'
                    value={title}
                />
            </div> */}
                
            <div className='form-group'>
                <div class="col-sm-6 my-1">
                    <label className='text-muted'>Write something here...</label>
                    <textarea
                        onChange={this.handleChange('body')}
                        type='text'
                        className='form-control'
                        value={body}
                    />
                </div>
            </div>
            
            <button
                onClick={this.clickSubmit}
                className='btn btn-raised btn-dark'
            >
                Create Post
            </button>
        </form>
    );

    render() {
        const {
            // title,
            body,
            // photo,
            user, 
            error,
            loading,
            redirectToProfile
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />;
        }

        
            
        return (
            <div className='container'>
                <h2 className='mt-5 mb-5'>Create a New Post</h2>
                <div
                    className='alert alert-danger'
                    style={{display: error ? "" : "none"}}
                >
                    {error}
                </div>

                {loading ? (
                    <div className='jumpotron text-center'>
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    ''
                )}
                    
                {/* {this.newPostForm(title, body)} */}

                {this.newPostForm(body)}
            </div>
        );
    };
};

export default NewPost;