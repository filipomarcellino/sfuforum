import { defaultMenuItem } from "@/src/atoms/DirectoryMenuAtom";
import useDirectory from "@/src/hooks/useDirectory";
import { Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApps";
import Directory from "./Directory/Directory";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);
  const { onSelectMenuItem } = useDirectory();
  return (
    <Flex
      bg="white"
      height="44px"
      padding="6px 12px"
      justify={{ md: "space-between" }}
    >
      <Flex
        align="center"
        width={"auto"}
        mr={2}
        onClick={() => onSelectMenuItem(defaultMenuItem)}
        cursor="pointer"
        bg={"brand.300"}
      >

        <Image src="/images/SFU-block-logo.svg" height="32px" />
        <Text fontStyle={"italic"} paddingTop={"9px"} paddingRight={"6px"} paddingLeft={"4px"} fontWeight="400" textColor={"white"} >Forum</Text>
      </Flex>
      <SearchInput user={user} />
      {user && <Directory />}
      <RightContent user={user} />
    </Flex>
  );
};
export default Navbar;
