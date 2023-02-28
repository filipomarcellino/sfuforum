import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { communityState } from "../atoms/communitiesAtom";
import {
  DirectoryMenuItem,
  directoryMenuState
} from "../atoms/DirectoryMenuAtom";
import { RiCommunityLine } from "react-icons/ri";

const useDirectory = () => {
  const [directoryState, setDirectoryState] =
    useRecoilState(directoryMenuState);
  const router = useRouter();
  const communityStateValue = useRecoilValue(communityState);

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem
    }));
    router.push(menuItem.link);
    if (directoryState.isOpen) {
      toggleMenuOpen();
    }
  };
  const toggleMenuOpen = () => {
    setDirectoryState((prev) => ({
      ...prev,
      isOpen: !directoryState.isOpen
    }));
  };

  useEffect(() => {
    const { currentCommunity } = communityStateValue;
    if (currentCommunity) {
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `${currentCommunity.id}`,
          link: `${currentCommunity.id}`,
          imageURL: currentCommunity.imageURL,
          icon: RiCommunityLine,
          iconColor: "Blue.500"
        }
      }));
    }
  }, []);
  return { directoryState, toggleMenuOpen, onSelectMenuItem };
};
export default useDirectory;
