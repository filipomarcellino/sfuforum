import { authModalState } from "@/src/atoms/authModalAtom";
import { auth } from "@/src/firebase/clientApps";
import useDirectory from "@/src/hooks/useDirectory";
import { Button, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { useSetRecoilState } from "recoil";
import CreateCommunityModal from "../Modal/CreateCommunity/CreateCommunityModal";

const PersonalHome: React.FC = () => {
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const { toggleMenuOpen } = useDirectory();
  const [open, setOpen] = useState(false);

  const onClickPost = () => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    toggleMenuOpen();
  };

  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <Flex
        direction="column"
        bg="white"
        borderRadius={4}
        cursor="pointer"
        border="1px solid"
        borderColor="gray.300"
        position="sticky"
      >
        <Flex
          align="flex-end"
          color="white"
          p="6px 10px"
          bg="blue.500"
          height="34px"
          borderRadius="4px 4px 0px 0px"
          fontWeight={600}
          bgImage="url(/images/redditPersonalHome.png)"
          backgroundSize="cover"
        ></Flex>
        <Flex direction="column" p="12px">
          <Flex align="center" mb={2}>
            <Icon as={FaReddit} fontSize={50} color="brand.100" mr={2} />
            <Text fontWeight={600}>Home</Text>
          </Flex>
          <Stack spacing={3}>
            <Text fontSize="9pt">
              Your personal Reddit frontpage, built for you.
            </Text>
            <Button onClick={onClickPost} height="30px">
              Create Post
            </Button>
            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              height="30px"
            >
              Create Community
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </>
  );
};
export default PersonalHome;
