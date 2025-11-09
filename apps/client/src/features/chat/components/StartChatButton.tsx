import { Button } from '@heroui/button';

import MessageIcon from '@/components/icons/MessageIcon';
import WarnIcon from '@/components/icons/WarnIcon';

interface StartChatButtonProps {
  existingChat: Chat | null;
  isLoading: boolean;
  errorLoading: boolean;
  onClickHandler: () => void;
}

export default function StartChatButton({
  existingChat,
  isLoading,
  errorLoading,
  onClickHandler,
}: StartChatButtonProps) {
  function renderChatButtonContent(chat: Chat | null, isChatLoading: boolean) {
    return errorLoading ? (
      <p className="flex gap-2 items-center">
        <WarnIcon />
        Temporarily unavailable
      </p>
    ) : !isChatLoading && chat ? (
      <p className="flex justify-center gap-2 items-center">
        <MessageIcon />
        Go to chat
      </p>
    ) : (
      <p className="flex justify-center gap-2 items-center">
        <MessageIcon />
        Chat with instructor
      </p>
    );
  }

  return (
    <Button
      color="primary"
      isDisabled={errorLoading || isLoading}
      isLoading={isLoading}
      variant="bordered"
      onPress={onClickHandler}
    >
      {renderChatButtonContent(existingChat, isLoading)}
    </Button>
  );
}
