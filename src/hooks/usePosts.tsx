import {
  collection, deleteDoc, doc, getDocs,
  query,
  where, writeBatch
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import { communityState } from "../atoms/communitiesAtom";
import { Post, postState, PostVote } from "../atoms/postAtom";
import { auth, firestore, storage } from "../firebase/clientApps";

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const router = useRouter();
  const [user] = useAuthState(auth);
  const currentCommunity = useRecoilValue(communityState).currentCommunity;
  const setAuthModalState = useSetRecoilState(authModalState);

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => {
    event.stopPropagation();

    //open auth modal if user is not loged in
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    try {
      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes.find(
        (vote) => vote.postId === post.id
      );
      const batch = writeBatch(firestore);
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];
      //voteChange is the final number to subtract/add from/to the current num of votes
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

      if (postStateValue.selectedPost) {
        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: updatedPost
        }));
      }

      const postRef = doc(firestore, "posts", post.id!);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });

      await batch.commit();
    } catch (error) {
      console.log("onvote error", error);
    }
  };
  const onSelectPost = (post: Post) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post
    }));
    router.push(`/r/${post.communityId}/comments/${post.id}`);
  };
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

  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuarry = query(
      collection(firestore, "users", `${user?.uid}/postVotes`),
      where("communityId", "==", communityId)
    );

    const postVoteDocs = await getDocs(postVotesQuarry);
    const postVotes = postVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[]
    }));
  };

  useEffect(() => {
    if (!user || !currentCommunity?.id) return;
    getCommunityPostVotes(currentCommunity?.id);
  }, [user, currentCommunity]);

  useEffect(() => {
    if (!user) {
      // if check user ?
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: []
      }));
    }
  }, [user]);

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost
  };
};
export default usePosts;
