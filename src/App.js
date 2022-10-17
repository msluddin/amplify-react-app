import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsExports);

function App({ signOut, user }) {
  return (
    <>
      {/* Add Todo JSX here  */}
      <Heading level={1}>Hello {user.username}</Heading>
      <Button onClick={signOut}>Sign out</Button>
    </>
  );
}

export default withAuthenticator(App);
