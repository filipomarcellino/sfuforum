import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { Community } from "@/src/atoms/communitiesAtom";
import { firestore } from "@/src/firebase/clientApps";
import safeJsonStringify from 'safe-json-stringify'
type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({communityData}) => {
  return <div>Welcome to  {communityData.id}</div>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  //get community data
  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );
    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: JSON.parse(safeJsonStringify({id: communityDoc.id, ...communityDoc.data()}))
      }
    };
  } catch (error) {
    console.log("getserversideprops error", error);
  }
}

export default CommunityPage;
