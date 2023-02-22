import { WriteBatch } from "@google-cloud/firestore";
import { doc, deleteDoc, writeBatch, collection } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { Post, postState, PostVote } from "../atoms/postAtom";
import { auth, firestore, storage } from "../firebase/clientApps";

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const [user] = useAuthState(auth);

  const onVote = async (post: Post, vote: number, communityId: string) => {
    //open auth modal if user is not loged in
    try {
      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes.find(
        (vote) => vote.postId === post.id
      );
      const batch = writeBatch(firestore);
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];
      let voteChange = vote;

      //new vote
      if (!existingVote) {
        const postVoteRef = doc(
          collection(firestore, "users", `${user?.uid}/postVotes`)
        );

        //create a new postvote document
        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id!,
          communityId,
          voteValue: vote
        };
        batch.set(postVoteRef, newVote);
        //add/subtract 1 from post.voteStatus
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      } else {
        const postVoteRef = doc(
          firestore,
          "users",
          `${user?.uid}/postVotes/${existingVote.id}`
        );
        //removing their vote
        if (existingVote.voteValue === vote) {
          //add/subtract 1 from post.voteStatus
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          );

          //delete the postVote document
          batch.delete(postVoteRef);

          voteChange *= -1;
        }
        //changing their vote
        else {
          //add/subtract 2 from post.votestatus
          //update the existing postVote document
          voteChange = 2 * vote;
          updatedPost.voteStatus = voteStatus + 2 * vote;

          const voteIndex = postStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );

          if (voteIndex !== -1) {
            updatedPostVotes[voteIndex] = {
              ...existingVote,
              voteValue: vote
            };
          }
          batch.update(postVoteRef, {
            voteValue: vote
          });
        }
      }
      //updating states
      const postIdx = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      );

      updatedPosts[postIdx] = updatedPost;

      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes
      }));

      const postRef = doc(firestore, "posts", post.id!);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });

      await batch.commit();
    } catch (error) {
      console.log("onvote error", error);
    }
  };
  const onSelectPost = () => {};
  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      //check if image exists, if true delete image from storage
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }
      //delete post from firestore
      const postDocRef = doc(firestore, "posts", post.id!);
      await deleteDoc(postDocRef);
      //update state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id)
      }));
      return true;
    } catch (error) {}
    return false;
  };

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost
  };
};
export default usePosts;
