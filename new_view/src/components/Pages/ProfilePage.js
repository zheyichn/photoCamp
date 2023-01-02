import Gallery from "../Profile/Gallery";
import Profile from "../Profile/Profile";
import Header from "../Activity/Header";
import "../../styles/profileStyle.css";

export default function ProfilePage() {
  return (
    <>
      <Header />
      <Profile />
      <Gallery />
    </>
  );
}
