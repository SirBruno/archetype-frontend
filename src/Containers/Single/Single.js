import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export default function Single() {
  const { topicId } = useParams();
  const client = useApolloClient();
  const [post, setPost] = useState(0);

  const dataTitle = React.createRef();
  const dataAuthor = React.createRef();
  const dataDescription = React.createRef();

  useEffect(() => {

    const getPost = async () => {
      const res = await client.query({
        variables: { _id: topicId },
        query: gql`
          query post($_id: String){
            post(_id: $_id) {
              id
              postTitle
              postBody
              author
            }
          }
      `,
      })

      const postRes = await res.data.post
      setPost(postRes);
      console.log(post)
    }

    getPost()
  });

  const updatePost = async (_id) => {

    // console.log('*********************')
    // console.log(_id);
    // console.log(dataTitle.current.value);
    // console.log('*********************')
    const res = await client.mutate({
      variables: {
        _id,
        postTitle: dataTitle.current.value,
        postBody: dataDescription.current.value,
        author: dataAuthor.current.value
      },
      mutation: gql`
        mutation updatePost($_id: String, $postTitle: String, $author: String, $postBody: String){
          updatePost(_id: $_id, postTitle: $postTitle, author: $author, postBody: $postBody) {
            id
            postTitle
            postBody
            author
          }
        }
    `,
    })

    if (res.data.updatePost.id) {
      document.getElementById("updatePostSuccess").innerText = res.data.updatePost.id
    }
    
  }

  if (post === 0) {
    return <h3>Loading...</h3>
  } else return (
    <div>
      <p>stuff</p>
      <h3>{ post.id }</h3>
      <p>{ post.postTitle }</p>
      <p>{ post.postBody }</p>
      <input ref={dataTitle} defaultValue={ post.postTitle } />
      <br />
      <input ref={dataAuthor} defaultValue={ post.author } />
      <br />
      <input ref={dataDescription} defaultValue={ post.postBody } />
      <br />
      <button onClick={() => updatePost(post.id)}>Submit</button>
      <br />
      <p id="updatePostSuccess"> Success? </p>
    </div>
  )
}