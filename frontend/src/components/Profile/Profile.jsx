import { useNavigate, Link } from "react-router-dom";
import { useGetProfile } from "../../hooks/useGetProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { user, profile } = useSelector((store) => store.user);
  const token = useSelector((store) => store.auth);
  useGetProfile(user?.user?._id);

  if (!token) return;
  if (!isAuthenticated) return null;
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/home");
  };

  return (
    <>
      {isAuthenticated && (
        <div className="min-h-screen bg-gray-200 flex items-center justify-center">
          <div className="w-[88%] lg:w-1/2 max-w-1xl mx-auto my-4 p-6 bg-white text-gray-800 shadow-lg rounded-lg overflow-hidden">
            {/* Back Button */}
            <button
              onClick={handleBackClick}
              className="flex items-center text-gray-600 p-2 rounded-md hover:bg-gray-200 hover:text-gray-900 transition-colors duration-300"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              Back
            </button>

            {/* Cover Image */}
            <div
              className="relative h-40 md:h-30 lg:h-30 bg-cover bg-center rounded-t-lg"
              style={{
                backgroundImage: `url(${profile?.coverImage})`,
              }}
            ></div>

            {/* Profile Image and User Info */}
            <div className="relative -top-16 flex flex-col items-center px-4 md:px-6 lg:px-8">
              <img
                src={`${profile?.profileImage}`}
                alt="Profile Image"
                className="w-32 h-32 md:w-34 md:h-34 lg:w-40 lg:h-40 rounded-full border-4 border-white shadow-lg"
              />
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mt-4">
                {profile?.fullName}
              </h1>
              <p className="text-gray-500 text-base md:text-lg lg:text-xl">
                @{profile?.username}
              </p>
              <div className="flex mt-4 space-x-6">
                <div className="text-center">
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
                    {profile?.followers?.length || 0}
                  </p>
                  <p className="text-gray-600 text-sm md:text-base">
                    Followers
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
                    {profile?.following?.length || 0}
                  </p>
                  <p className="text-gray-600 text-sm md:text-base">
                    Following
                  </p>
                </div>
              </div>
              <Link
                to={`/profile/${profile?._id}/update`}
                className="mt-4 inline-block rounded-xl bg-blue-500 p-3 text-white font-semibold hover:bg-blue-600 transition-colors duration-300"
              >
                Update Details
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
