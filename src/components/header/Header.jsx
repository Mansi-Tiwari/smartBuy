import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { HiShoppingCart } from "react-icons/hi";
import { BiMenuAltRight } from "react-icons/bi";
import { FaWindowClose, FaUserCircle } from "react-icons/fa";
import { AdminOnlyLink } from "../adminOnlyRoute/AdminOnlyRoute";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import {
  SET_ACTIVE_USER,
  REMOVE_ACTIVE_USER,
} from "../../redux/slice/authSlice";
import { GrHpeLabs } from "react-icons/gr";
import ShowOnLogin, { ShowOnLogout } from "../hiddenLink/HiddeLink";
const logo = (
  <div className={` flex flex-row pl-6 ${styles.logo}`}>
    <Link to={"/"} className="flex flex-row gap-3">
      <GrHpeLabs size={20} className="ml-4 text-white" />
      <h2 className="text-3xl flex flex-row  ">
        Smart
        <span>Buy.</span>
      </h2>{" "}
    </Link>
  </div>
);
const activeTab = ({ isActive }) => (isActive ? `${styles.active}` : "");

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);

  const [displayName, setDisplayName] = useState("");

  const user = auth.currentUser;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //monitor current sign in user
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userEmail = user.email.indexOf("@");
        if (user.displayName == null) {
          const u1 = user.email.substring(0, userEmail);
          const uName = u1.charAt(0).toUpperCase() + u1.slice(1);
          setDisplayName(uName);
        } else {
          setDisplayName(user.displayName);
        }

        dispatch(
          SET_ACTIVE_USER({
            email: user.email,
            userName: user.displayName ? user.displayName : displayName,
            userID: user.uid,
          })
        );
      } else {
        setDisplayName("");
        dispatch(REMOVE_ACTIVE_USER());
      }
    });
  }, [dispatch, displayName]);

  const logOut = () => {
    signOut(auth)
      .then(() => {
        toast.success("Log out Successfully.");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  const hideMenu = () => {
    setShowMenu(false);
  };

  const cart = (
    <span className={styles.cart}>
      <NavLink to="/cart">
        Cart
        <  HiShoppingCart size={20} />
        <p>5</p>
      </NavLink>
    </span>
  );


  return (
    <header>
      <div className={`flex flex-row ${styles.header} `}>
        {logo}
        {/* {desktop nav section} */}
        <nav
          className={
            showMenu ? `${styles["show-nav"]}` : `${styles["hide-nav"]}`
          }
        >
          <div
            className={
              showMenu
                ? `font-bold ${styles["nav-wrapper"]}${styles["show-nav-wrapper"]}`
                : `${styles["nav-wrapper"]}`
            }
            onClick={hideMenu}
          ></div>

          <ul onClick={hideMenu}>
            <li className={styles["logo-mobile"]}>
              {logo}
              <FaWindowClose
                size={22}
                className="mb-20"
                color="#fff"
                onClick={hideMenu}
              />
            </li>
            <AdminOnlyLink>
              <li>
                <Link to="/admin/home">
                  <button className="--btn --btn-primary">Admin</button>
                </Link>
              </li>
            </AdminOnlyLink>
            <li>
              <NavLink to="/" className={activeTab}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={activeTab}>
                Contact Us
              </NavLink>
            </li>
          </ul>
          <div className={` ${styles["header-right"]}`} onClick={hideMenu}>

              <ShowOnLogout>
                <NavLink className={activeTab} to={"/login"}>
                  Login
                </NavLink>
              </ShowOnLogout>
              <ShowOnLogin >
                <a href="#home" className="flex gap-3 items-center text-teal-200" >


                  <FaUserCircle size={16} />
                  Hi, {displayName}

                </a>
              </ShowOnLogin>
              <ShowOnLogout>
                <NavLink className={activeTab} to={"/register"}>
                  Register
                </NavLink>
              </ShowOnLogout>
              <ShowOnLogin>
                <NavLink className={activeTab} to={"/order-history"}>
                  My order
                </NavLink>
              </ShowOnLogin>
              <ShowOnLogin>
                <NavLink onClick={logOut} to={"/"}>
                  Logout
                </NavLink>
              </ShowOnLogin>

            {cart}
          </div>
        </nav>
        {/* {Mobile nav section} */}
        <div className= {styles["menu-icon"]}>
            {cart}

          <BiMenuAltRight size={40} onClick={toggleMenu} />
          </div>

      </div>
    </header>
  );
};

export default Header;