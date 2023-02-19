import { Box, Flex } from "@chakra-ui/react";
import React from "react";

interface PageContentProps {
  children: React.ReactNode;
}
const PageContent: React.FC<PageContentProps> = ({ children }) => {
  console.log("Here is children", children);
  return (
    <Flex justify="center" p="16px 0px" border={"1px solid red"}>
      <Flex
        width="95%"
        justify="center"
        maxWidth={"860px"}
        border={"1px solid green"}
      >
        <Flex
          border={"1px solid blue"}
          direction="column"
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: 6 }}
        >
          {children && children[0 as keyof typeof children]}
        </Flex>
        {/* Right Content */}
        <Box
          border={"1px solid orange"}
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          flexGrow={1}
        >
          {children && children[1 as keyof typeof children]}
        </Box>
      </Flex>
    </Flex>
  );
};
export default PageContent;
