import { getDocs, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import {
  Community,
  CommunitySnippet,
  communityState
} from "../atoms/communitiesAtom";
import { auth, firestore } from "../firebase/clientApps";

const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };
  const getMySnippets = async () => {
    setLoading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[]
      }));

      console.log(snippets, "🙌🚀🚀");
    } catch (error: any) {
      console.log("Get My Snippet Error", error);
    }
  };
  const joinCommunity = (communityData: Community) => {};
  const leaveCommunity = (communityID: string) => {};
  useEffect(() => {
    if (!user) {
      return;
    }
    getMySnippets();
  }, [user]);

  return {
    communityStateValue,
    onJoinOrLeaveCommunity
  };
};
export default useCommunityData;
