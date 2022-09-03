/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Message } from '@open-wa/wa-automate';

const FAKE_AUTHOR_ID = '5511987654321@c.us' as const;
const FAKE_CHAT_ID = '987654321@c.us' as const;
const FAKE_MESSAGE = '!ping';

export const generateClientMessage = (value: Partial<Message>): Message =>
  ({
    author: value.author ?? FAKE_AUTHOR_ID,
    body: value.body ?? FAKE_MESSAGE,
    broadcast: value.broadcast ?? false,
    chat: value.chat ?? {
      archive: false,
      archiveAtMentionViewedInDrawer: false,
      canSend: true,
      contact: {
        formattedName: 'Test Chat',
        id: FAKE_CHAT_ID,
        name: 'TEST_CHAT_NAME',
      },
      formattedTitle: 'FORMATTED_TITLE',
      groupMetadata: {
        announce: false,
        creation: 1_649_873_278,
        defaultSubgroup: false,
        desc: '',
        descId: 'desc-id',
        descOwner: '0000@c.us',
        descTime: 1_651_170_177,
        ephemeralDuration: 0,
        id: '0000@g.us',
        incognito: false,
        isParentGroup: false,
        membershipApprovalRequests: [],
        owner: '000@c.us',
        participants: [],
        restrict: true,
        size: 256,
      },
      id: FAKE_CHAT_ID,
      isAnnounceGrpRestrict: false,
      isGroup: true,
      isOnline: true,
      isReadOnly: false,
      kind: 'group',
      msgs: null,
      name: 'chat-name-test',
      participantsCount: 256,
    },
    chatId: FAKE_CHAT_ID,
    content: FAKE_MESSAGE,
    from: FAKE_CHAT_ID,
    fromMe: false,
    hasReaction: false,
    id: 'false_120363041787903899@g.us_1FD4A828E5CAB9193F74B458CE225004_5511987654321@c.us',
    isGroupMsg: true,
    isMedia: false,
    mediaData: {},
    quotedMsg: null,
    quotedMsgObj: null,
    sender: {
      formattedName: 'sender name',
      id: FAKE_AUTHOR_ID,
      msgs: null,
      profilePicThumbObj: {},
      pushname: 'SENDER_NAME',
      type: 'in',
    },
    t: 1_662_077_622,
    text: FAKE_MESSAGE,
    to: value.to ?? '00000@c.us',
    type: value.type ?? 'chat',
  } as any);
// TODO: we should remove as any, but the current type of Message is wrong
