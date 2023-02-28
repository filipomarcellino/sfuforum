import { Community } from "@/src/atoms/communitiesAtom";
import useCommunityData from "@/src/hooks/useCommunityData";
import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";
import { RiCommunityLine } from "react-icons/ri";

type HeaderProps = {
  communityData: Community;
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
  //read from community snippets
  const { communityStateValue, onJoinOrLeaveCommunity, loading } =
    useCommunityData();
  const isJoined = !!communityStateValue.mySnippets.find(
    (item) => item.communityId === communityData.id
  );
  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="brand.300" />
      <Flex justify="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {communityStateValue.currentCommunity?.imageURL ? (
            <Image
              borderRadius="full"
              boxSize="66px"
              src={communityStateValue.currentCommunity.imageURL}
              alt="profile Image"
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
            />
          ) : (
            <Icon
              as={RiCommunityLine}
              fontSize={60}
              bg={"white"}
              position="relative"
              top={-3}
              color="brand.100"
              border="4px solid"
            />
          )}

          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="16pt">
                {communityData.id}
              </Text>
              <Text fontWeight={600} fontSize="10pt" color="gray.400">
                {communityData.id}
              </Text>
            </Flex>
            <Button
              variant={isJoined ? "outline" : "solid"}
              height="30px"
              pr={6}
              pl={6}
              isLoading={loading}
              onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Header;
