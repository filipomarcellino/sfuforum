import { Box, Flex } from "@chakra-ui/react";
import React from "react";

interface PageContentProps {
  children: any;
}
const PageContent: React.FC<PageContentProps> = ({ children }) => {
  return (
    <Flex justify="center" p="16px 0px">
      <Flex width="95%" justify="center" maxWidth={"860px"}>
        {/* Right Content */}
        <Box
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          flexGrow={1}
        >
          {children && children[1 as keyof typeof children]}
        </Box>
        {/* Left Content */}
        <Flex
          direction="column"
          width={{ base: "100%", md: "65%" }}
          ml={{ base: 0, md: 6 }}
        >
          {children && children[0 as keyof typeof children]}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PageContent;
