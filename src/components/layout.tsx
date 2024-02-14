import { Link, Outlet, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { auth } from "../firebase";

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 4fr;
  height: 100%;
  padding: 50px 0px;
  width: 100%;
  max-width: 860px;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const MenuItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  .image {
    width: 30px;
  }
  &.log-out {
    border-color: tomato;
  }
`;

export default function Layout() {
  const navigate = useNavigate();

  const onLogOut = async () => {
    const ok = confirm("Are you sure you want to logout?");
    if (ok) {
      await auth.signOut();
      navigate("login");
    }
  };
  return (
    <>
      <Wrapper>
        <Menu>
          <Link to="/">
            <MenuItem>
              <img className="image" src="/home.svg" />
            </MenuItem>
          </Link>
          <Link to="/profile">
            <MenuItem>
              <img className="image" src="/profile.svg" />
            </MenuItem>
          </Link>
          <MenuItem className="log-out" onClick={onLogOut}>
            <img className="image" src="/logout.svg" />
          </MenuItem>
        </Menu>
        <Outlet />
      </Wrapper>
    </>
  );
}
