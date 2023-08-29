import {useRouter} from 'next/router';
import {api} from '../../utils/api';
import {Button, Layout, Typography} from 'antd';
import CircularProgressIndicator from '../../components/CircularProgressIndicator/CircularProgressIndicator';
import {signIn, signOut, useSession} from 'next-auth/react';
import Image from 'next/image';
import ErrorIcon from '../../components/ErrorIcon/ErrorIcon';

const {Text} = Typography;
const Invite = () => {
  const router = useRouter();
  const session = useSession();

  const {token} = router.query;

  const getTokenDetailsQuery = api.workspace.getWorkspaceInviteById.useQuery({
    token: token as string,
  });

  const {
    mutate: acceptProjectInvite,
    isLoading: isAccepting,
    isError: acceptError,
    error: errorMessage,
  } = api.workspace.acceptWorkspaceInvite.useMutation({
    onSuccess(data) {
      router.push(`/w/${data.shortName}/projects`);
    },
  });

  if (getTokenDetailsQuery.isLoading)
    return (
      <Layout className="flex h-full justify-center items-center flex-col gap-1">
        <CircularProgressIndicator />
        <Text>Loading...</Text>
      </Layout>
    );

  if (getTokenDetailsQuery.error)
    return (
      <Layout className="flex h-full justify-center items-center flex-col gap-1">
        <ErrorIcon />
        <Text>{getTokenDetailsQuery.error.message}</Text>
      </Layout>
    );

  if (!session.data?.user) {
    return (
      <Layout className="flex h-full justify-center items-center flex-col gap-1">
        <Text>You need to be signed in to accept this invite.</Text>
        <Button
          className="flex items-center justify-center gap-1-2"
          onClick={() =>
            void signIn('google', {
              callbackUrl: `/invite?token=${token}`,
              redirect: false,
            })
          }
        >
          <Image src="/google.webp" width={16} height={16} alt="google" />
          <p>Sign In with Google</p>
        </Button>
      </Layout>
    );
  }

  if (acceptError && errorMessage.data?.code === 'CONFLICT')
    return (
      <Layout className="flex h-full justify-center items-center flex-col gap-1">
        <ErrorIcon />
        <Text>{errorMessage.message}</Text>
        <Text> Logout and signin with another account</Text>
        <Button onClick={()=>signOut()}>Logout</Button>
      </Layout>
    );
  if (acceptError) {
    return (
      <Layout className="flex h-full justify-center items-center flex-col gap-1">
        <ErrorIcon />
        <Text>{errorMessage.message}</Text>
      </Layout>
    );
  }

  return (
    <Layout className="flex h-full justify-center items-center flex-col gap-1">
      <Text>
        Hi there,
        {getTokenDetailsQuery.data.createdByEmail} has invited you to{' '}
        {getTokenDetailsQuery.data.workspace.name} workspace to collaborate with
        them.
      </Text>
      <Text>Click the button below to get started:</Text>
      <Button
        type="primary"
        onClick={() =>
          acceptProjectInvite({
            token: token as string,
            email: session.data.user?.email!,
          })
        }
        loading={isAccepting}
      >
        Join {getTokenDetailsQuery.data.workspace.name} as{' '}
        {session.data.user.name}
      </Button>
    </Layout>
  );
};

export default Invite;
