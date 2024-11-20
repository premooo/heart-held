import React from 'react'

const PostPoemForm = () => {
    return (
        <form className='PostForm'>
            <input type="text" className='post-poem-recipient'
            placeholder='Reciepient'/>
    
           <textarea
            name="post-poem-message"
            id='post-poem-message'
            className='post-message'
            placeholder='Write Poem Here?'
           >
    
           </textarea>
    
            <button>Submit</button>
    
        </form>
      )
    }
export default PostPoemForm
