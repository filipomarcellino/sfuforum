import { Button, Flex, Stack } from "@chakra-ui/react";
import React, { useRef } from "react";
import { Image } from "@chakra-ui/react";

type ImageUploadProps = {
  selectedFile?: string;
  onSelectedImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectTab: (value: string) => void;
  setSelectedFile: (value: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedFile,
  onSelectedImage,
  setSelectTab,
  setSelectedFile
}) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);
  return (
    <Flex justify="center" align="center" width="100%" direction={"column"}>
      {selectedFile ? (
        <>
          <Image src={selectedFile} maxWidth="400px" maxHeight="400px"></Image>
          <Stack direction="row" mt={4}>
            <Button height="28px" onClick={() => setSelectTab("Post")}>
              Back to Post
            </Button>
            <Button
              variant="outline"
              height="28px"
              onClick={() => setSelectedFile("")}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify="center"
          align="center"
          p={20}
          border="1px dashed"
          borderColor="gray.200"
          width="100%"
          borderRadius={4}
        >
          <Button
            variant="outline"
            height="28px"
            onClick={() => selectedFileRef.current?.click()}
          >
            Upload
          </Button>
          <input
            ref={selectedFileRef}
            type="file"
            hidden
            onChange={onSelectedImage}
          />
        </Flex>
      )}
    </Flex>
  );
};
export default ImageUpload;
