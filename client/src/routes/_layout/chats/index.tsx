import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import React from "react";

import ChatHistory from "@/features/chat/components/ChatHistory";
import { useGetChats } from "@/features/chat/hooks/useGetChats";
import { useChatStore } from "@/store/useChatStore";
import ChatPanel from "@/features/chat/components/ChatPanel";
import { useAuthStore } from "@/store/auth-store";

export const Route = createFileRoute("/_layout/chats/")({
  component: RouteComponent,
});

export const dummyMessages = [
  {
    id: "msg_001",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_2",
    senderId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP",
    content: "Hey, how's it going?",
    status: "sent",
    isRead: true,
    createdAt: "2025-09-04T10:00:00Z",
    updatedAt: "2025-09-04T10:01:00Z",
  },
  {
    id: "msg_002",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_2",
    senderId: "user_2",
    content: "It's going well! Just finished a big project.",
    status: "received",
    isRead: true,
    createdAt: "2025-09-04T10:02:00Z",
    updatedAt: "2025-09-04T10:03:00Z",
  },
  {
    id: "msg_003",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_3",
    senderId: "user_3",
    content: "Can we meet tomorrow?",
    status: "received",
    isRead: false,
    createdAt: "2025-09-04T11:00:00Z",
    updatedAt: "2025-09-04T11:00:00Z",
  },
  {
    id: "msg_004",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_1",
    senderId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP",
    content: "What time works best for you?",
    status: "sent",
    isRead: true,
    createdAt: "2025-09-04T12:00:00Z",
    updatedAt: "2025-09-04T12:00:00Z",
  },
  {
    id: "msg_005",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_4",
    senderId: "user_4",
    content: "I'll send you the document later today.",
    status: "received",
    isRead: false,
    createdAt: "2025-09-04T13:00:00Z",
    updatedAt: "2025-09-04T13:00:00Z",
  },
  {
    id: "msg_006",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_5",
    senderId: "user_5",
    content: "Did you get my last message?",
    status: "received",
    isRead: true,
    createdAt: "2025-09-04T14:00:00Z",
    updatedAt: "2025-09-04T14:01:00Z",
  },
  {
    id: "msg_007",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_6",
    senderId: "user_6",
    content: "The meeting is canceled.",
    status: "received",
    isRead: true,
    createdAt: "2025-09-04T15:00:00Z",
    updatedAt: "2025-09-04T15:00:00Z",
  },
  {
    id: "msg_008",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_7",
    senderId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP",
    content: "See you there!",
    status: "sent",
    isRead: true,
    createdAt: "2025-09-04T16:00:00Z",
    updatedAt: "2025-09-04T16:00:00Z",
  },
  {
    id: "msg_009",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_8",
    senderId: "user_8",
    content: "Let's grab coffee soon.",
    status: "received",
    isRead: false,
    createdAt: "2025-09-04T17:00:00Z",
    updatedAt: "2025-09-04T17:00:00Z",
  },
  {
    id: "msg_010",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_9",
    senderId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP",
    content: "Sounds like a plan.",
    status: "sent",
    isRead: true,
    createdAt: "2025-09-04T18:00:00Z",
    updatedAt: "2025-09-04T18:00:00Z",
  },
  {
    id: "msg_011",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_10",
    senderId: "user_10",
    content: "I'm running late.",
    status: "received",
    isRead: true,
    createdAt: "2025-09-04T19:00:00Z",
    updatedAt: "2025-09-04T19:00:00Z",
  },
  {
    id: "msg_012",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_1",
    senderId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP",
    content: "No worries, take your time.",
    status: "sent",
    isRead: true,
    createdAt: "2025-09-04T20:00:00Z",
    updatedAt: "2025-09-04T20:00:00Z",
  },
  {
    id: "msg_013",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_2",
    senderId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP",
    content: "Thanks for the update!",
    status: "sent",
    isRead: true,
    createdAt: "2025-09-04T21:00:00Z",
    updatedAt: "2025-09-04T21:00:00Z",
  },
  {
    id: "msg_014",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_3",
    senderId: "user_3",
    content: "Can you review this report?",
    status: "received",
    isRead: false,
    createdAt: "2025-09-04T22:00:00Z",
    updatedAt: "2025-09-04T22:00:00Z",
  },
  {
    id: "msg_015",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_4",
    senderId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP",
    content: "Got it. I'll check it now.",
    status: "sent",
    isRead: true,
    createdAt: "2025-09-04T23:00:00Z",
    updatedAt: "2025-09-04T23:00:00Z",
  },
  {
    id: "msg_016",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_5",
    senderId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP",
    content: "Happy birthday!",
    status: "sent",
    isRead: true,
    createdAt: "2025-09-05T00:00:00Z",
    updatedAt: "2025-09-05T00:00:00Z",
  },
  {
    id: "msg_017",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_6",
    senderId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP",
    content: "Thank you so much!",
    status: "sent",
    isRead: true,
    createdAt: "2025-09-05T01:00:00Z",
    updatedAt: "2025-09-05T01:00:00Z",
  },
  {
    id: "msg_018",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_7",
    senderId: "user_7",
    content: "Don't forget to call me.",
    status: "received",
    isRead: false,
    createdAt: "2025-09-05T02:00:00Z",
    updatedAt: "2025-09-05T02:00:00Z",
  },
  {
    id: "msg_019",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_8",
    senderId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP",
    content: "I'll be there in 15 minutes.",
    status: "sent",
    isRead: true,
    createdAt: "2025-09-05T03:00:00Z",
    updatedAt: "2025-09-05T03:00:00Z",
  },
  {
    id: "msg_020",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_9",
    senderId: "user_9",
    content: "What's the address?",
    status: "received",
    isRead: true,
    createdAt: "2025-09-05T04:00:00Z",
    updatedAt: "2025-09-05T04:00:00Z",
  },
  {
    id: "msg_021",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_10",
    senderId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP",
    content: "It's 123 Main St.",
    status: "sent",
    isRead: true,
    createdAt: "2025-09-05T05:00:00Z",
    updatedAt: "2025-09-05T05:00:00Z",
  },
  {
    id: "msg_022",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_2",
    senderId: "user_2",
    content: "See you soon!",
    status: "received",
    isRead: true,
    createdAt: "2025-09-05T06:00:00Z",
    updatedAt: "2025-09-05T06:00:00Z",
  },
  {
    id: "msg_023",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_3",
    senderId: "user_3",
    content: "What's the weather like?",
    status: "received",
    isRead: false,
    createdAt: "2025-09-05T07:00:00Z",
    updatedAt: "2025-09-05T07:00:00Z",
  },
  {
    id: "msg_024",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_1",
    senderId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP",
    content: "It's raining here.",
    status: "sent",
    isRead: true,
    createdAt: "2025-09-05T08:00:00Z",
    updatedAt: "2025-09-05T08:00:00Z",
  },
  {
    id: "msg_025",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_4",
    senderId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP",
    content: "The forecast says it'll clear up.",
    status: "sent",
    isRead: false,
    createdAt: "2025-09-05T09:00:00Z",
    updatedAt: "2025-09-05T09:00:00Z",
  },
  {
    id: "msg_026",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_5",
    senderId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP",
    content: "Let's plan for a picnic tomorrow.",
    status: "sent",
    isRead: true,
    createdAt: "2025-09-05T10:00:00Z",
    updatedAt: "2025-09-05T10:00:00Z",
  },
  {
    id: "msg_027",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_6",
    senderId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP",
    content: "That sounds like a great idea!",
    status: "sent",
    isRead: true,
    createdAt: "2025-09-05T11:00:00Z",
    updatedAt: "2025-09-05T11:00:00Z",
  },
  {
    id: "msg_028",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_7",
    senderId: "user_7",
    content: "I'll bring the sandwiches.",
    status: "received",
    isRead: false,
    createdAt: "2025-09-05T12:00:00Z",
    updatedAt: "2025-09-05T12:00:00Z",
  },
  {
    id: "msg_029",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_8",
    senderId: "user_8",
    content: "I'll bring the drinks.",
    status: "received",
    isRead: true,
    createdAt: "2025-09-05T13:00:00Z",
    updatedAt: "2025-09-05T13:00:00Z",
  },
  {
    id: "msg_030",
    chatId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP-user_9",
    senderId: "ipMUSP8Mk2GSnGbj4wL0egXXjneNmYOP",
    content: "Perfect!",
    status: "sent",
    isRead: true,
    createdAt: "2025-09-05T14:00:00Z",
    updatedAt: "2025-09-05T14:00:00Z",
  },
];

// if (true) {
//   return (
//     <Card className="w-full bg-background p-0 border border-default-200">
//       <Skeleton className="!bg-default-200" isLoaded={false}>
//         <CardHeader className="p-0">
//           <Card className="w-full">
//             <CardBody className="p-4">
//               <div className="flex items-center gap-2">
//                 <Avatar
//                   size="lg"
//                   src="https://heroui.com/images/hero-card-complete.jpeg"
//                 />
//                 <div>
//                   <p className="text-lg font-medium">recipient</p>
//                   <Chip
//                     className="border-0 p-0"
//                     color="success"
//                     variant="dot"
//                   >
//                     Online
//                   </Chip>
//                 </div>
//               </div>
//             </CardBody>
//           </Card>
//         </CardHeader>
//       </Skeleton>
//       <CardBody className="flex-1 overflow-y-auto pt-0">
//         {skeletonMessages.map((_, idx) => (
//           <div
//             key={idx}
//             className={`flex ${idx % 2 === 0 ? "justify-end" : "justify-start"}`}
//           >
//             <div className="p-2">
//               <Skeleton
//                 className="!bg-default-200 h-12 w-32 rounded-lg"
//                 isLoaded={false}
//               />
//             </div>
//           </div>
//         ))}
//       </CardBody>
//       <CardFooter>
//         <div className="w-full">
//           <Input
//             classNames={{
//               inputWrapper: "h-14 bg-default-200/90",
//             }}
//             endContent={
//               <Button isIconOnly color="primary" size="sm">
//                 <SendIcon />
//               </Button>
//             }
//             name="message"
//             placeholder="Message"
//             type="text"
//             variant="faded"
//           />
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

function RouteComponent() {
  const { data: chats, isLoading: chatsLoading } = useGetChats({
    role: "LEARNER",
    page: 1,
  });
  const { selectedChat } = useChatStore();
  const { user } = useAuthStore();

  if (chatsLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex h-full gap-4 w-full">
      <div className="w-full hidden xl:max-w-md xl:block h-full">
        <ChatHistory chats={chats!} />
      </div>
      {selectedChat ? (
        <ChatPanel
          currentUser={user!}
          messages={dummyMessages.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          )}
          recipient={{
            id: "",
            firstName: "Jane Doe",
            lastName: "",
            bio: "",
            image: undefined,
            createdAt: "",
            updatedAt: "",
          }}
        />
      ) : (
        <Card className="hidden xl:flex justify-center items-center w-full h-full bg-background border border-default-200">
          <Chip> Select a chat to start messaging</Chip>
        </Card>
      )}
    </div>
  );
}
