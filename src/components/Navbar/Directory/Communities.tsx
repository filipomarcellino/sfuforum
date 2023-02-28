import React, { useState } from "react";
import CreateCommunityModal from "../../Modal/CreateCommunity/CreateCommunityModal";
import { GrAdd } from "react-icons/gr";
import { MenuItem, Flex, Icon, Box, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { communityState } from "@/src/atoms/communitiesAtom";
import MenuListItem from "./MenuListItem";
import { RiCommunityLine } from "react-icons/ri";

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
  const [open, setOpen] = useState(false);
  const mySnippets = useRecoilValue(communityState).mySnippets;
  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MODERATING
        </Text>
        {mySnippets.filter(snippet=>snippet.isModerator).map((snippet) => (
          <MenuListItem
            key={snippet.communityId}
            icon={RiCommunityLine}
            displayText={`${snippet.communityId}`}
            link={`/${snippet.communityId}`}
            iconColor="brand.300"
            imageURL={snippet.imageURL}
          />
        ))}
      </Box>
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MY COMMUNITIES
        </Text>
        <MenuItem
          width="100%"
          fontSize="10pt"
          _hover={{ bg: "gray.100" }}
          onClick={() => setOpen(true)}
        >
          <Flex>
            <Icon as={GrAdd} mr={2} fontSize={20} />
            Create Community
          </Flex>
        </MenuItem>
        {mySnippets.map((snippet) => (
          <MenuListItem
            key={snippet.communityId}
            icon={RiCommunityLine}
            displayText={`${snippet.communityId}`}
            link={`/${snippet.communityId}`}
            iconColor="brand.100"
            imageURL={snippet.imageURL}
          />
        ))}
      </Box>
    </>
  );
};
export default Communities;
