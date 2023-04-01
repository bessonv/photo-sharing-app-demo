import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginProps from "./Login.props";
import { EmitEvent, ReciveEvent } from "../../enums";

function Login({ socket }: LoginProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    socket.on(ReciveEvent.loginSuccess, (data) => {
      toast.success(data.message);
      localStorage.setItem("_id", data.data._id);
      localStorage.setItem("_myEmail", data.data._email);

      navigate("/photos");
    });

    socket.on(ReciveEvent.loginError, (error) => {
      toast.error(error);
    });

    return () => {
      socket.off(ReciveEvent.loginSuccess);
      socket.off(ReciveEvent.loginError);
    };
  }, [socket, navigate]);

  const handleSignIn = (e: React.FormEvent) => {
    if (username.trim() && password.trim()) {
      e.preventDefault();
      socket.emit(EmitEvent.login, { username, password });
      console.log({ username, password });
      setPassword("");
      setUsername("");
    }
  };
  
  return (
    <div className='login'>
      <h2 style={{ marginBottom: "30px" }}>Login</h2>
      <form className="login__form" method='POST' onSubmit={handleSignIn}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          className="input"
          name="username"
          id="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="input"
          name="password"
          id="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="loginBtn">LOG IN</button>
        <p style={{ textAlign: "center" }}>
          Dont't have an account?{" "}
          <Link className="link" to="/register">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
