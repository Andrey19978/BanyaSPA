// components/UserProfile.tsx
type User = {
  name: string;
};

function Profile({ user }: { user: User }) {
  return <h1>{user.name}</h1>;
}

export default Profile;