import React from "react";
import { useRecoilState } from "recoil";
import { postState } from "../atoms/postAtom";


const usePosts = () => {
  const[postStateValue, setPostStateValue] = useRecoilState(postState);

  const onVote = async () => {}
  const onSelectPost = async () => {}
  const onDeletePost = () => {}

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost
  };
};
export default usePosts;
