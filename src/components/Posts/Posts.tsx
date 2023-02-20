import { Community } from "@/src/atoms/communitiesAtom";
import { Post } from "@/src/atoms/postAtom";
import { firestore } from "@/src/firebase/clientApps";
import { query, collection, where, orderBy, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const [loading, setLoading] = useState(false);
  const getPost = async () => {
    try {
        setLoading(true);
        // get posts for this community
        const postQuery = query(
          collection(firestore, "posts"),
          where("communityId", "==", communityData.id),
          orderBy("createdAt", "desc")
        );
        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        // setPostStateValue((prev) => ({
        //   ...prev,
        //   posts: posts as Post[]
        // }));
      console.log("hello");
    } catch (error: any) {
      console.log("get post error", error.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    getPost();
  }, [communityData]);
  return <div>posts</div>;
};
export default Posts;
