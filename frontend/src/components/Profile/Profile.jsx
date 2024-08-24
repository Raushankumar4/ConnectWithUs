import { useNavigate, Link } from "react-router-dom";
import { useGetProfile } from "../../hooks/useGetProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { user, profile } = useSelector((store) => store.user);
  const token = useSelector((store) => store.auth);
  console.log(user?.user?._id);
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
        <div className="lg:w-[30vw] w-2/3  mx-auto box-content mt-[20vw]  lg:mt-10 p-6 bg-gray-100 text-black shadow-lg rounded-lg overflow-hidden lg:h-[38vw]">
          <button
            onClick={handleBackClick}
            className="flex items-center text-black p-2 rounded-md hover:bg-gray-200 hover:text-white py-2 focus:outline-none mb-1"
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
            {/* <span className="bg-black p-2 rounded-lg text-white">Back</span> */}
          </button>

          {/* Cover Image */}
          <div
            className="relative h-40 md:h-48 lg:h-56 bg-cover bg-center rounded-t-lg rounded-md "
            style={{
              backgroundImage: `url(${profile?.coverImage})`,
            }}
          ></div>

          {/* Profile Image and User Info */}
          <div className="relative -top-16 flex flex-col items-center px-4 md:px-6">
            <img
              src={`${profile?.profileImage}`}
              alt="Profile Image"
              className="w-20 h-20 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full border-4 border-gray-800 shadow-lg"
            />
            <h1 className="text-xl md:text-2xl font-semibold mt-4">
              {profile?.fullName}
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              {profile?.username}
            </p>
            <div className="flex mt-4 space-x-4 md:space-x-6">
              <div className="text-center">
                <p className="text-lg md:text-xl font-semibold">
                  {profile?.followers?.length || 0}
                </p>
                <p className="text-black text-sm md:text-base">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-lg md:text-xl font-semibold">
                  {profile?.following?.length || 0}
                </p>
                <p className="text-black text-sm md:text-base">Following</p>
              </div>
            </div>
            <Link
              to={`/profile/${profile?._id}/update`}
              className="rounded-xl bg-black p-3 border text-white mt-4 hover:scale-105 transition-all ease-in-out"
            >
              Update details
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
