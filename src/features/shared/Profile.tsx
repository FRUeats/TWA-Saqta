// Placeholder for Profile page
import { useTelegram } from '../../hooks/useTelegram';

const Profile = () => {
    const { user } = useTelegram();

    return (
        <div className="p-4 text-tg-text">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            <p>Name: {user?.first_name} {user?.last_name}</p>
            <p>Username: @{user?.username || 'N/A'}</p>
        </div>
    );
};

export default Profile;
