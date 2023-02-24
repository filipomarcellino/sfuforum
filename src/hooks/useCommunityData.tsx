import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  writeBatch
} from "firebase/firestore";
import { useRouter } from "next/router";
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
  const [_error, setError] = useState("");
  const router = useRouter();

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
      const snippets = snippetDocs.docs.map((doc) => ({
        ...doc.data()
      }));

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
        snippetsFetched: true
      }));
    } catch (error: any) {
      console.log("Get My Snippet Error", error);
      setError(error.message);
    }
    setLoading(false);
  };
  const joinCommunity = async (communityData: Community) => {
    //batch write from firestore
    try {
      const batch = writeBatch(firestore);

      //creating a new community snippet
      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
        isModerator: user?.uid === communityData.creatorId
      };
      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );
      batch.update(doc(firestore, `communities`, communityData.id), {
        //updating the numberOfMembers
        numberOfMembers: increment(1)
      });
      await batch.commit();

      //update recoil state - communitystate.mysnippet
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet]
      }));
    } catch (error: any) {
      console.log("joinCommunity error, error");
      setError(error.message);
    }
    setLoading(false);
  };
  const leaveCommunity = async (communityId: string) => {
    //batch write
    //deleting a new community snippet
    //updating the numberOfMembers

    try {
      const batch = writeBatch(firestore);

      //deleting a community snippet
      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      );
      batch.update(doc(firestore, "communities", communityId), {
        //updating the numberOfMembers
        numberOfMembers: increment(-1)
      });
      await batch.commit();

      //update recoil state - communitystate.mysnippet
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        )
      }));
    } catch (error: any) {
      console.log("leaveCommunity error, error");
      setError(error.message);
    }

    //update recoil state - communitystate.mysnippet
  };

  const getCommunityData = async (communityId: string) => {
    try {
      const communityDocRef = doc(firestore, "communities", communityId);
      const communityDoc = await getDoc(communityDocRef);

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id,
          ...communityDoc.data()
        } as Community
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [],
        snippetsFetched: false
      }));
      return;
    }
    getMySnippets();
  }, [user]);

  useEffect(() => {
    const { communityId } = router.query;

    if (communityId && !communityStateValue.currentCommunity) {
      getCommunityData(communityId as string);
    }
  }, [router.query, communityStateValue.currentCommunity]);

  return { communityStateValue, onJoinOrLeaveCommunity, loading };
};
export default useCommunityData;
