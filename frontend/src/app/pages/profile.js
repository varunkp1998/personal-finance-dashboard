import { useState } from 'react';
import { updateProfile } from '../lib/auth';

export default function Profile() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    const { error } = await updateProfile({ data: { username } });
    setMessage(error ? error.message : 'Profile updated successfully!');
  };

  return (
    <div>
      <input type="text" placeholder="New Username" onChange={(e) => setUsername(e.target.value)} />
      <button onClick={handleUpdate}>Update Profile</button>
      {message && <p>{message}</p>}
    </div>
  );
}
