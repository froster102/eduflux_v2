import React from 'react';
import { LocalUserChoices } from '@livekit/components-react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { addToast } from '@heroui/toast';
import { AxiosError } from 'axios';

import VideoConference from '@/features/meetings/components/VideoConference';
import { PreJoin } from '@/features/meetings/components/Prejoin';
import { tryCatch } from '@/utils/try-catch';
import { joinSession } from '@/features/session/services/session';
import { DEFAULT_ERROR_MESSAGE } from '@/config/error-messages';
import { LIVEKIT_SERVER_URL } from '@/lib/constants';
import { meetingPageSearchParamSchema } from '@/features/meetings/validation/meetingPageSearchParamSchema';

export const Route = createFileRoute('/meetings/$meetingsId/')({
  component: RouteComponent,
  validateSearch: meetingPageSearchParamSchema,
});

function RouteComponent() {
  const [connectionDetails, setConnectionDetails] = React.useState<
    ConnectionDetails | undefined
  >(undefined);
  const [preJoinChoices, setPreJoinChoices] = React.useState<
    LocalUserChoices | undefined
  >(undefined);

  const navigate = useNavigate();
  const sessionId = Route.useParams().meetingsId;
  const { returnTo } = Route.useSearch();

  const handlePreJoinSubmit = React.useCallback(
    async (values: LocalUserChoices) => {
      setPreJoinChoices(values);

      const { data: response, error } = await tryCatch<
        JsonApiResponse<JoinSessionResponse>,
        AxiosError<JsonApiErrorResponse>
      >(joinSession(sessionId));

      if (error) {
        const errorData = error.response?.data as
          | JsonApiErrorResponse
          | undefined;

        const errorMessage =
          errorData?.errors?.map((e) => e.title).join(', ') ||
          DEFAULT_ERROR_MESSAGE;

        addToast({ description: errorMessage, color: 'danger' });

        return;
      }

      setConnectionDetails({ ...response.data, serverUrl: LIVEKIT_SERVER_URL });
    },
    [],
  );

  const handleOnLeave = React.useCallback(() => {
    navigate({ to: returnTo });
  }, [returnTo]);

  return (
    <main data-lk-theme="default" style={{ height: '100%' }}>
      {connectionDetails === undefined || preJoinChoices === undefined ? (
        <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
          <PreJoin joinLabel="Join Session" onJoin={handlePreJoinSubmit} />
        </div>
      ) : (
        <VideoConference
          connectionDetails={connectionDetails}
          handleOnLeave={handleOnLeave}
          options={{ codec: 'h264', hq: false }}
          userChoices={preJoinChoices}
        />
      )}
    </main>
  );
}
