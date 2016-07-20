import React, {Component, PropTypes} from 'react'
import _ from  'lodash';
import {reduxForm} from 'redux-form'
import * as userAction from '../actions/user';
import {Link} from 'react-router'

class Form extends Component {
  constructor(props) {
    super(props);
  }
  onSubmit(props){
    this.props.createPost(props)
      .then(()=>{
        //blog post has benn created navigate the user to the index
        this.context.router.push('/')
      })
  }

  render() {
    const {fields:{title, categories, content}, handleSubmit} = this.props;
    return (
      <div >
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <h3>新增</h3>

          <div className={`form-group ${title.touched && title.invalid ? 'has-danger' : ''}`}>
            <lable>Title</lable>
            <input type="text" className="form-control"  {...title}/>
            <div className="text-help">
              {title.touched ? title.error : ' '}
            </div>
          </div>

          <div className={`form-group ${categories.touched && categories.invalid ? 'has-danger' : ''}`}>
            <lable>Categories</lable>
            <input type="text" className="form-control" {...categories}/>
            <div className="text-help">
              {categories.touched ? categories.error : ' '}
            </div>
          </div>

          <div className={`form-group ${content.touched && content.invalid ? 'has-danger' : ''}`}>
            <lable>Content</lable>
            <textarea type="text" className="form-control" {...content}/>
            <div className="text-help">
              {content.touched ? content.error : ' '}
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Submit</button>
          <Link to="/" className="btn btn-danger">取消</Link>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};
  if (!values.title) {
    errors.title = 'Enter a username'
  }
  if (!values.categories) {
    errors.categories = 'Enter categories'
  }
  if (!values.content) {
    errors.content = 'Enter some content'
  }
  return errors
}

Form.propTypes = { router:PropTypes.object};

export default reduxForm({
  form: 'PostsNewForm',
  fields: ['title', 'categories', 'content'],
  validate
}, null, {userAction})(Form)